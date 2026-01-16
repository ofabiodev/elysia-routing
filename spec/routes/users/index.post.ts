import { defineRoute, v } from "../../../src"

export default defineRoute({
  schema: {
    body: v.object({
      name: v.string().min(3),
      email: v.string().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
      age: v.number().min(18),
    }),
  },
  handler: ({ body }) => ({ created: body }),
})
