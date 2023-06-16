import app from "./app.js"
//used to start a web server and listen for incoming HTTP requests on a specific port
const port = process.env.PORT || 8080

app.listen(port, () => {
  console.log(`App started; listening on port ${port}`)
})