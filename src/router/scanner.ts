import { readdirSync, statSync } from "node:fs"
import { join } from "node:path"
import type { HTTPMethod } from "../core"

export interface RouteFile {
  path: string
  method: HTTPMethod
  routePath: string
}

const METHODS: readonly HTTPMethod[] = [
  "get",
  "post",
  "put",
  "patch",
  "delete",
  "options",
  "head",
  "all",
] as const

function isGroupFolder(name: string): boolean {
  return name.startsWith("(") && name.endsWith(")")
}

function isDynamicParam(name: string): boolean {
  return name.startsWith("[") && name.endsWith("]")
}

function parseSegment(entry: string): string {
  if (isDynamicParam(entry)) return `:${entry.slice(1, -1)}`
  return entry
}

export function scanRoutes(
  dir: string,
  baseDir = dir,
  prefix = "",
): RouteFile[] {
  const routes: RouteFile[] = []
  const entries = readdirSync(dir)

  for (const entry of entries) {
    const fullPath = join(dir, entry)
    const stat = statSync(fullPath)

    if (stat.isDirectory()) {
      if (isGroupFolder(entry)) {
        routes.push(...scanRoutes(fullPath, baseDir, prefix))
        continue
      }

      const segment = parseSegment(entry)
      routes.push(...scanRoutes(fullPath, baseDir, `${prefix}/${segment}`))
    } else if (stat.isFile() && entry.endsWith(".ts")) {
      const parts = entry.slice(0, -3).split(".")
      const method = parts.pop() as HTTPMethod

      if (!METHODS.includes(method)) continue

      const name = parts.join(".")
      const routePath = name === "index" || name === "route" ? prefix || "/" : `${prefix}/${name}`

      routes.push({
        path: fullPath,
        method,
        routePath: routePath || "/",
      })
    }
  }

  return routes
}
