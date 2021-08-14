import { makeExecutableSchema } from 'apollo-server-express'
import typeDefs from '../schemas'
import resolvers from '../resolvers'
import db from "./db"

export const schema = makeExecutableSchema({ typeDefs, resolvers })
export const mongoose = db