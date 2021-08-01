import express from 'express'
import next from 'next';
import { ApolloServer } from 'apollo-server-express'
import { schema } from './server/config/apollo'
import dotenv from 'dotenv'
import { createServer } from "http";

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

  const apolloApp = new ApolloServer({ schema, playground: !isProdEnv });
  apolloApp.applyMiddleware({ app, path:'/playground' });

  app.use(express.urlencoded({ extended: true }));
  app.use(express.static(__dirname));
  app.use(express.json());
  app.get('*', (req, res) => handle(req, res));

  const httpServer = createServer(app);
  apolloApp.installSubscriptionHandlers(httpServer);

  httpServer.listen(PORT, ():void => {
    console.log(`> 🚀 Playground ready at ${ORIGIN}${apolloApp.graphqlPath}`)
    console.log(`> 🚀 Websocket ready at ${ORIGIN}${apolloApp.subscriptionsPath}`);
  });

})();