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



import prisma from "./src/utils/prisma.js";

async function main() {
  prisma.user
    .delete({
      where: {
        email: "123123@aslfd.com",
      },
    })
    .then((user) => {
      console.log(user);
    })
    .catch((e) => {
      console.log(e.message);
    });
}

main();
