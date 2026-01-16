import { Elysia } from "elysia"
import { elysiaRouting } from "../src"

const app = new Elysia()
  .use(
    elysiaRouting({
      dir: "spec/routes",
      prefix: "/api",
    }),
  )
  .listen(3000)

console.log(`🦊 Server running at http://localhost:${app.server?.port}`)
console.log("\nAvailable routes:")
console.log("  GET    /api/")
console.log("  POST   /api/users")
console.log("  GET    /api/users/:id")
console.log("  DELETE /api/users/:id")
console.log("  GET    /api/dashboard")
console.log("  ALL    /api/health")
