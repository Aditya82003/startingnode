import express, { Request, response, Response, urlencoded } from 'express';
import usersData from '../MOCK_DATA.json'

let users = [...usersData]


const app = express();
const PORT = 3001;

app.use(express.json())                 // Parse request body and put json in your request body
app.use(urlencoded())                  //This is a middleware or we can assume that this is a type of plugin

app.use((res, req, next) => {
  console.log("hello from custom middleware")
  next()
})

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!')
})

app.get('/users', (req: Request, res: Response) => {
  const html = `
  <ul>
  ${users.map((user) => `<li>${user.first_name}</li>`).join("")}
  </ul>
  `
  res.send(html)
})

app.get('/api/users', (req, res) => {
  res.send(users)
})

app.get('/api/user/:id', (req: Request, res: Response) => {
  const id: number = Number(req.params.id)
  const user = users.find((user) => user.id === id)
  res.status(200).send(user)
})
app.delete('/api/user/:id', (req, res) => {
  const user = users.find((user) => user.id === Number(req.params.id))
  if (!user) {
    res.status(404).send({ err: "An error occurs" })
  }
  users = users.filter((user) => user.id !== Number(req.params.id))
  res.send({message:"user deleted succesfully",users})
})

app.post('/api/users', (req, res) => {
  const user = { id: users.length + 1, ...req.body }
  users.push(user)
  res.status(201).json({ id: users.length, status: "Succes" })
})



app.listen(PORT, () => console.log(`Server is started at port ${PORT}`))