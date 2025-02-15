import express, { Request, response, Response, urlencoded } from 'express';
import users from '../MOCK_DATA.json'


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

app.get('/api/users',(req,res)=>{
  res.send(users)
})

app.get('/api/user/:id',(req:Request,res:Response)=>{
  const id:number = Number(req.params.id)
  const user =users.find((user)=>user.id===id)
  res.send(user)
})

app.post('/api/users',(req,res)=>{
  const user= {id:users.length+1,...req.body}
  users.push(user)
  
  res.send(users)
})




app.post('/users', (req: Request, res: Response) => {
  console.log(req.body)
  res.send(`this is your response from post req ${JSON.stringify(req.body)}`)
})


app.listen(PORT, () => console.log(`Server is started at port ${PORT}`))