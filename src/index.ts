import express, { Request, Response, urlencoded } from 'express';

const app=express();
const PORT=3001;


app.use(urlencoded())                  //This is a middleware or we can assume that this is a type of plugin

app.get('/', (req:Request, res:Response) => {
    res.send('Hello World!')
  })

app.post('/users',(req:Request,res:Response)=>{
    console.log(req.body)
    res.send(`this is your response from post req ${JSON.stringify(req.body)}`)
})


app.listen(PORT,()=>console.log(`Server is started at port ${PORT}`))