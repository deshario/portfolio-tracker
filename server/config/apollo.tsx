import { makeExecutableSchema } from 'apollo-server-express'
import typeDefs from '../schemas'
import resolvers from '../resolvers'

export const schema = makeExecutableSchema({ typeDefs, resolvers })