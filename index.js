import express from "express"
import prisma from "./src/utils/prisma.js"
import bodyParser from 'body-parser';


const app = express()
const port = process.env.PORT || 8080
app.use(bodyParser.json());

app.get('/users', async (req, res) => {
  const allUsers = await prisma.user.findMany()
  res.json(allUsers)
})

app.post('/users', async (req, res) => {
  try {
    const user = await prisma.user.create({
      data: req.body // Assuming req.body contains the user data
    });
    res.send(user);// once created, the data is sent back as response in insomnia
  } catch (error) {
    res.status(500).send('Error creating user');
  }
});


app.listen(port, () => {
  console.log(`App started; listening on port ${port}`)
})
