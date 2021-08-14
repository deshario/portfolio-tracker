import mongoose from "mongoose"

let config: any = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
}

mongoose.connect('mongodb://localhost:27017/portfolio-tracker', config)

export default mongoose