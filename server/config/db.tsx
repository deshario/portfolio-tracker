import mongoose from 'mongoose'
import { MONGO_URL } from './environment'

let config: any = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
}

mongoose.connect(MONGO_URL, config)

export default mongoose
