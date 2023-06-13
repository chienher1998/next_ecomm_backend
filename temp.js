
async function createUser() {
    const resp = await fetch('http://localhost:8080/users', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({
            name: 'test',
            email: 'something2@example.com',
            password: 'secure'
        })
    })

    const res = await resp.json()

    console.log({ res })
}


