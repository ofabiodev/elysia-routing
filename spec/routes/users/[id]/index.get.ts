import { defineRoute, v } from "../../../../src"

export default defineRoute({
  schema: {
    params: v.object({
      id: v.string(),
    }),
  },
  handler: ({ params }) => ({ id: params.id }),
})
