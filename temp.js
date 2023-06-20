// async function createUser() {
//     const resp = await fetch('http://localhost:8080/users', {
//         method: 'POST',
//         headers: {
//             'Content-type': 'application/json'
//         },
//         body: JSON.stringify({
//             name: 'test',
//             email: 'something2@example.com',
//             password: 'secure'
//         })
//     })

//     const res = await resp.json()

//     console.log({ res })
// }

// import prisma from "./src/utils/prisma.js";

// async function main() {
//   prisma.nFT
//     .delete({
//       where: {
//         id: 4,
//       },
//     })
//     .then((nFT) => {
//       console.log(nFT);
//     })
//     .catch((e) => {
//       console.log(e.message);
//     });
// }

// main();

import jwt from "jsonwebtoken";

const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7ImlkIjo1NywibmFtZSI6ImNoaWVuaGVyIiwiZW1haWwiOiJjaGllbmhlckBob3RtYWlsLmNvbSJ9LCJpYXQiOjE2ODcyMzUyMDN9.HFUqy4btYsex25_f5WXIemF-BSqcrhUzu6_PGpAhalM";
const secret = "x6ZaCwC7Pjehg.hHXzu";
// in a token consists of header, payload and signature
try {
  const decoded = jwt.verify(token, secret); //verifying token would return the decoded payload
  //checks if the signature of the token matches the secret key
  console.log(decoded);
  const userId = decoded.payload.email; // Extracting the user ID from the "id" property
  console.log("User ID:", userId);
} catch (error) {
  console.error("Invalid token:", error);
}

