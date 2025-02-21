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
}, { timestamps: true })

const User = mongoose.model("user", userSchema)


app.get('/users', async (_, res) => {
  const allUsers = await User.find({})
  const html = `
  <ul>
  ${allUsers.map((user) => `<li>${user.firstName}</li>`).join("")}
  </ul>
  `
  res.send(html)
})

app.get('/api/users', async (_, res) => {
  const allUsers = await User.find({})
  res.status(200).send(allUsers)
})

app.get('/api/user/:id', async (req, res) => {
  const id = req.params.id
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ message: "Please enter a valid user ID" });
    return
  }
  const user = await User.findById(id)
  if (!user) {
    res.status(400).send({ message: "User not found" })
    return
  }
  res.status(200).send(user)
})

app.delete('/api/user/:id', async (req, res) => {
  try {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: "Please enter a valid user ID" });
      return
    }
    const result = await User.findByIdAndDelete(id)
    if (!result) {
      res.status(404).json({ message: "User not found" })
      return
    }
    res.status(200).send({ message: "successfully deleted", UserName: result?.firstName })
  }
  catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
})

app.patch('/api/user/:id', async (req, res) => {
  const id = req.params.id
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ message: "Please enter a valid user ID" });
    return
  }
  try{
  const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true })
  if(!updatedUser){
    res.status(400).send({message:"User not found"})
    return
  }
  console.log(updatedUser)
  res.status(200).json({ message: "User successfully updated", Time: updatedUser?.updatedAt })
  }
  catch(error){
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
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