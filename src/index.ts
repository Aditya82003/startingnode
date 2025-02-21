import express, { urlencoded } from 'express';
import userRouter from './routes'
import { mongoDbConnection } from './connection'


const app = express();
const PORT = 3001;

app.use(express.json())                 // Parse request body and put json in your request body
app.use(urlencoded({ extended: true }))                   //This is a middleware or we can assume that this is a type of plugin

mongoDbConnection("mongodb://127.0.0.1:27017/practice_users_db")
  .then(() => console.log("MongoDB connected successfully"))
  .catch(() => console.log("An error occur during connection"))


app.use('/user', userRouter)

app.listen(PORT, () => console.log(`Server is started at port ${PORT}`))