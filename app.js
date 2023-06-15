// these are the backend server code
import express from "express";
import prisma from "./src/utils/prisma.js";
import cors from "cors";
import { Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";
import { signAccessToken } from "./src/utils/jwt.js";

const app = express();
// const port = process.env.PORT || 8080;

//app.use function process or modify incoming requests before they reach the actual route handlers.
app.use(express.json());
//bodyParser translate the json to another format from the client request body to talk to the backend
app.use(cors());

function filter(obj, ...keys) {
  return keys.reduce((a, c) => ({ ...a, [c]: obj[c] }), {});
}

// ----------------------Read--------------------------//
app.get("/users", async (req, res) => {
  try {
    const allUsers = await prisma.user.findMany();
    res.send(allUsers);
  } catch (error) {
    res.status(500).send("Error getting user");
  }
});

// -------------------CreateUser-----------------------------//
function validateUser(input) {
  const validationErrors = {};

  if (!("username" in input) || input["username"].length == 0) {
    validationErrors["username"] = "cannot be blank";
  }

  if (!("email" in input) || input["email"].length == 0) {
    validationErrors["email"] = "cannot be blank";
  }

  if (!("password" in input) || input["password"].length == 0) {
    validationErrors["password"] = "cannot be blank";
  }

  if ("password" in input && input["password"].length < 8) {
    validationErrors["password"] = "should be at least 8 characters";
  }

  if (
    "email" in input &&
    !input["email"].match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)
  ) {
    validationErrors["email"] = "is invalid";
  }

  return validationErrors;
}

app.post("/users", async (req, res) => {
  const data = req.body;

  const validationErrors = validateUser(data);

  if (Object.keys(validationErrors).length != 0)
    return res.status(400).send({
      error: validationErrors,
    });

  data.password = bcrypt.hashSync(data.password, 8);

  prisma.user
    .create({
      data,
    })
    .then((user) => {
      return res.json(filter(user, "id", "username", "email"));
    })
    .catch((err) => {
      // we have unique index on user's email field in our schema, Postgres throws an error when we try to create 2 users with the same email. here's how we catch the error and gracefully return a friendly message to the user.
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === "P2002"
      ) {
        const formattedError = {};
        formattedError[`${err.meta.target[0]}`] = "already taken";
        return res.status(500).send({
          error: formattedError,
        });
      }
      throw err;
    });
});

// -------------------LoginUser-----------------------------//
function validateLogin(input) {
  const validationErrors = {};

  if (!("email" in input) || input["email"].length == 0) {
    validationErrors["email"] = "cannot be blank";
  }

  if (!("password" in input) || input["password"].length == 0) {
    validationErrors["password"] = "cannot be blank";
  }

  if (
    "email" in input &&
    !input["email"].match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)
  ) {
    validationErrors["email"] = "is invalid";
  }

  return validationErrors;
}

app.post("/sign-in", async (req, res) => {
  const data = req.body;

  const validationErrors = validateLogin(data);

  if (Object.keys(validationErrors).length != 0)
    return res.status(400).send({
      error: validationErrors,
    });

  const user = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (!user)
    return res.status(401).send({
      error: "Email address or password not valid",
    });

  const checkPassword = bcrypt.compareSync(data.password, user.password);
  if (!checkPassword)
    return res.status(401).send({
      error: "Email address or password not valid",
    });

  const accessToken = await signAccessToken(user);
  return res.json({ accessToken });
});




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

//used to start a web server and listen for incoming HTTP requests on a specific port
// app.listen(port, () => {
//   console.log(`App started; listening on port ${port}`);
// });

export default app