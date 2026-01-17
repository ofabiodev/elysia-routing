import type { Context } from "elysia"
import type { Schema } from "../validator/schema"

export interface RouteSchema {
  body?: Schema<unknown>
  query?: Schema<unknown>
  params?: Schema<unknown>
  headers?: Schema<unknown>
}

export interface RouteDefinition<
  TSchema extends RouteSchema = RouteSchema,
  TMeta = unknown
> {
  handler: (
    ctx: Context & {
      body: TSchema["body"] extends Schema<infer U> ? U : unknown
      query: TSchema["query"] extends Schema<infer U> ? U : unknown
      params: TSchema["params"] extends Schema<infer U> ? U : unknown
      headers: TSchema["headers"] extends Schema<infer U> ? U : unknown
    }
  ) => unknown
  schema?: TSchema
  meta?: TMeta
}

export interface ElysiaRoutingOptions {
  dir: string
  prefix?: string
}

export type HTTPMethod =
  | "get"
  | "post"
  | "put"
  | "patch"
  | "delete"
  | "options"
  | "head"
  | "all"

export function defineRoute<
  TSchema extends RouteSchema = RouteSchema,
  TMeta = unknown
>(
  definition: RouteDefinition<TSchema, TMeta>
): RouteDefinition<TSchema, TMeta> {
  return definition
}