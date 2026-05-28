export function startTestServer(app) {
  const server = app.listen(0)
  const { port } = server.address()

  return {
    server,
    baseUrl: `http://127.0.0.1:${port}`
  }
}

export async function closeTestServer(server) {
  await new Promise((resolve, reject) => {
    server.close((error) => {
      if (error) {
        reject(error)
        return
      }

      resolve()
    })
  })
}
