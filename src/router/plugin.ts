import type { Context, Elysia } from "elysia"
import { join } from "node:path"
import type { ElysiaRoutingOptions, RouteDefinition } from "../core"
import { ValidationError } from "../validator/schema"
import { scanRoutes } from "./scanner"

function validateSchema(ctx: Context, definition: RouteDefinition): void {
  if (!definition.schema) return

  const { body, query, params, headers } = definition.schema

  if (body) ctx.body = body.parse(ctx.body) as never
  if (query) ctx.query = query.parse(ctx.query) as never
  if (params) ctx.params = params.parse(ctx.params) as never
  if (headers) ctx.headers = headers.parse(ctx.headers) as never
}

function createHandler(definition: RouteDefinition) {
  return async (ctx: Context) => {
    try {
      validateSchema(ctx, definition)
      return await definition.handler(ctx)
    } catch (error) {
      if (error instanceof ValidationError) {
        ctx.set.status = 400
        return { error: error.message }
      }
      throw error
    }
  }
}

function registerRoute(
  app: Elysia,
  method: string,
  path: string,
  handler: (ctx: Context) => unknown,
): void {
  switch (method) {
    case "all":
      app.all(path, handler)
      break
    case "get":
      app.get(path, handler)
      break
    case "post":
      app.post(path, handler)
      break
    case "put":
      app.put(path, handler)
      break
    case "patch":
      app.patch(path, handler)
      break
    case "delete":
      app.delete(path, handler)
      break
    case "options":
      app.options(path, handler)
      break
    case "head":
      app.head(path, handler)
      break
  }
}

export function elysiaRouting(options: ElysiaRoutingOptions) {
  const { dir, prefix = "" } = options
  const routesDir = join(process.cwd(), dir)

  return (app: Elysia) => {
    const routes = scanRoutes(routesDir)

    for (const route of routes) {
      const module = require(route.path)
      const definition: RouteDefinition = module.default

      if (!definition?.handler) {
        console.warn(`Route ${route.path} has no default export with handler`)
        continue
      }

      const fullPath = prefix + route.routePath
      const handler = createHandler(definition)

      registerRoute(app, route.method, fullPath, handler)
    }

    return app
  }
}
