import express, { Request, Response, urlencoded } from 'express';
import mongoose from 'mongoose';
import usersData from '../MOCK_DATA.json'

let users = [...usersData]


const app = express();
const PORT = 3001;

app.use(express.json())                 // Parse request body and put json in your request body
app.use(urlencoded({ extended: true }))                   //This is a middleware or we can assume that this is a type of plugin

mongoose.connect("mongodb://127.0.0.1:27017/practice_users_db")
  .then(() => console.log("MongoDB successfully connected"))
  .catch((err) => console.log("Mongo error", err))


const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  jobTitle: {
    type: String,
  },
  gender: {
    type: String
  }
},{timestamps:true})

const User = mongoose.model("user", userSchema)

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!')
})

app.get('/users', async (req: Request, res: Response) => {
  const allUsers =await User.find({})
  const html = `
  <ul>
  ${allUsers.map((user) => `<li>${user.firstName}</li>`).join("")}
  </ul>
  `
  res.send(html)
})

app.get('/api/users', async(_, res) => {
  const allUsers =await User.find({})
  res.status(200).send(allUsers)
})

app.get('/api/user/:id', (req: Request, res: Response) => {
  const id: number = Number(req.params.id)
  const user = users.find((user) => user.id === id)
  if (!user) {
    res.status(404).send({ message: "Please enter valid id" })
  }
  res.status(200).send(user)
})
app.delete('/api/user/:id', (req, res) => {
  const user = users.find((user) => user.id === Number(req.params.id))
  if (!user) {
    res.status(404).send({ err: "An error occurs" })
  }
  users = users.filter((user) => user.id !== Number(req.params.id))
  res.send({ message: "user deleted succesfully", users })
})
app.patch('/api/user/:id', (req, res) => {
  console.log(req.body)
  const id = Number(req.params.id)
  users[id - 1] = { ...users[id - 1], ...req.body }
  res.send(users[id - 1])
})

app.post('/api/users', async (req: Request, res: Response) => {
  try {
    const { first_name, last_name, email, gender, job_title } = req.body;

    if (!first_name || !last_name || !email || !gender || !job_title) {
      res.status(400).json({ message: "Please enter all the details" });
      return
    }

    const result = await User.create({
      firstName: first_name,
      lastName: last_name,
      email: email,
      gender: gender,
      jobTitle: job_title
    });

    console.log(result);

    res.status(201).json({ message: "Successfully Created", user: result._id });
    return
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
    return
  }
});




app.listen(PORT, () => console.log(`Server is started at port ${PORT}`))