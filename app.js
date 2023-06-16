// these are the backend server code and this file is the index
import express from "express"
import userRouter from "./src/controllers/users.controllers.js"
import authRouter from "./src/controllers/auth.controllers.js"
const app = express()
app.use(express.json())

app.use('/users', userRouter)
app.use('/auth', authRouter)


export default app;


// app.delete("/users", async (req, res) => {
//   const data = req.body;
//     prisma.user.delete({
//       where: {
//         data,
//       },
//     })
//     .then(()=>{
//       return res.json("User deleted");
//     })
//     .catch((err) => {
//     return res
//       .status(500)
//       .json({ error: "An error occurred while deleting the user" });
//   })
// });


