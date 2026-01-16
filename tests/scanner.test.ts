import { describe, it, beforeEach, afterEach } from "poku"
import { strict as assert } from "node:assert"
import { mkdirSync, writeFileSync, rmSync, existsSync } from "node:fs"
import { join } from "node:path"
import { scanRoutes } from "../src/router/scanner"

const TEST_DIR = join(process.cwd(), "tests", ".tmp")

beforeEach(() => {
  if (existsSync(TEST_DIR)) {
    rmSync(TEST_DIR, { recursive: true, force: true })
  }
  mkdirSync(TEST_DIR, { recursive: true })
})

afterEach(() => {
  if (existsSync(TEST_DIR)) {
    rmSync(TEST_DIR, { recursive: true, force: true })
  }
})

describe("Scanner - Route detection", () => {
  it("scans basic route files", () => {
    writeFileSync(join(TEST_DIR, "index.get.ts"), "")
    const routes = scanRoutes(TEST_DIR)
    assert.equal(routes.length, 1)
    assert.equal(routes[0]?.routePath, "/")
    assert.equal(routes[0]?.method, "get")
  })

  it("scans nested routes", () => {
    mkdirSync(join(TEST_DIR, "users"), { recursive: true })
    writeFileSync(join(TEST_DIR, "users", "index.post.ts"), "")
    const routes = scanRoutes(TEST_DIR)
    assert.equal(routes.length, 1)
    assert.equal(routes[0]?.routePath, "/users")
    assert.equal(routes[0]?.method, "post")
  })

  it("handles dynamic params [id]", () => {
    mkdirSync(join(TEST_DIR, "users", "[id]"), { recursive: true })
    writeFileSync(join(TEST_DIR, "users", "[id]", "index.get.ts"), "")
    const routes = scanRoutes(TEST_DIR)
    assert.equal(routes.length, 1)
    assert.equal(routes[0]?.routePath, "/users/:id")
  })

  it("ignores group folders (admin)", () => {
    mkdirSync(join(TEST_DIR, "(admin)"), { recursive: true })
    writeFileSync(join(TEST_DIR, "(admin)", "dashboard.get.ts"), "")
    const routes = scanRoutes(TEST_DIR)
    assert.equal(routes.length, 1)
    assert.equal(routes[0]?.routePath, "/dashboard")
  })

  it("handles named routes", () => {
    mkdirSync(join(TEST_DIR, "users"), { recursive: true })
    writeFileSync(join(TEST_DIR, "users", "profile.get.ts"), "")
    const routes = scanRoutes(TEST_DIR)
    assert.equal(routes.length, 1)
    assert.equal(routes[0]?.routePath, "/users/profile")
  })

  it("supports all HTTP methods", () => {
    const methods = [
      "get",
      "post",
      "put",
      "patch",
      "delete",
      "options",
      "head",
      "all",
    ]
    for (const method of methods) {
      writeFileSync(join(TEST_DIR, `test.${method}.ts`), "")
    }
    const routes = scanRoutes(TEST_DIR)
    assert.equal(routes.length, methods.length)
  })

  it("ignores non-method files", () => {
    writeFileSync(join(TEST_DIR, "utils.ts"), "")
    writeFileSync(join(TEST_DIR, "types.ts"), "")
    const routes = scanRoutes(TEST_DIR)
    assert.equal(routes.length, 0)
  })
})
