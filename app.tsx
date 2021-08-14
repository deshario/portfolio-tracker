import express from 'express'
import next from 'next';
import session from "express-session"
import dotenv from 'dotenv'
import passport from "passport"
import cookieParser from "cookie-parser"
import { createServer } from "http";
import { ReqRes } from "./interface"
import { ApolloServer } from 'apollo-server-express'
import { schema } from './server/config/apollo'
import crypto from "crypto"
import userController from "./server/api/user/db/controller"

dotenv.config();

const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev, dir: "./client" });
const handle = nextApp.getRequestHandler();

(async () => {
  await nextApp.prepare();
  const app = express();
  const HOSTNAME = process.env.HOSTNAME || "localhost";
  const PORT = process.env.PORT || 3000;

  const isProdEnv = process.env.NODE_ENV === 'production';
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
        return { url, user, authorized: true, req, res }
      }
      return { ...user, url, authorized: false, req, res }
    },
  });

  apolloApp.applyMiddleware({ app, path:'/playground' });

  app.use(
    session({
      genid: (req: express.Request): string => crypto.randomBytes(16).toString("hex"),
      secret: "optimus",
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