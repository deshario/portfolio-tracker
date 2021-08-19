import express from 'express'
import next from 'next';
import session from "express-session"
import passport from "passport"
import cookieParser from "cookie-parser"
import { createServer } from "http";
import { ReqRes } from "./interface"
import { ApolloServer } from 'apollo-server-express'
import { schema } from './server/config/apollo'
import { NODE_ENV, HOSTNAME, PORT, JWT_SECRET } from "./server/config/environment"
import userController from "./server/api/user/db/controller"
import { verifyCredentials } from "./server/auth/auth.service"
import crypto from "crypto"

const dev = NODE_ENV !== 'production';
const nextApp = next({ dev, dir: "./client" });
const handle = nextApp.getRequestHandler();

(async () => {
  await nextApp.prepare();
  const app = express();
  const isProdEnv = NODE_ENV === 'production';
  const ORIGIN = `${isProdEnv ? 'https' : 'http'}://${HOSTNAME}:${PORT}`;

  const apolloApp = new ApolloServer({
    schema,
    playground: !isProdEnv,
    context: async ({ req, res }: ReqRes) => {
      if (!req || !req.headers) return
      const url = `${req.protocol || "https"}://${req.get("host")}`
      const token = req.headers.authorization || ""
      const user = await userController.verifyToken(token)
      if (user && user._id){
        const { credentials: {key,secret} } = user;
        const { valid } = await verifyCredentials({ key, secret })
        return { user, url, authorized: true, validKey:valid, req, res }
      }
      return { ...user, url, authorized: false, validKey:false, req, res }
    },
  });

  apolloApp.applyMiddleware({ app, path:'/playground' });

  app.use(
    session({
      genid: (req: express.Request): string => crypto.randomBytes(16).toString("hex"),
      secret: JWT_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: true
      }
    })
  )
  .use(express.urlencoded({ extended: true }))
  .use(cookieParser())
  .use(passport.initialize())
  .use(passport.session())
  .use(express.static(__dirname))
  .use(express.json())
  .get('*', (req, res) => handle(req, res));

  const httpServer = createServer(app);
  apolloApp.installSubscriptionHandlers(httpServer);

  httpServer.listen(PORT, ():void => {
    console.log(`> 🚀 Playground ready at ${ORIGIN}${apolloApp.graphqlPath}`)
    console.log(`> 🚀 Websocket ready at ${ORIGIN}${apolloApp.subscriptionsPath}`);
  });

})();