import { describe, it } from "poku"
import { strict as assert } from "node:assert"
import { v, ValidationError } from "../src"

describe("Validator - Primitives", () => {
  it("v.string() validates strings", () => {
    const schema = v.string()
    assert.equal(schema.parse("test"), "test")
    assert.throws(() => schema.parse(123), ValidationError)
  })

  it("v.number() validates numbers", () => {
    const schema = v.number()
    assert.equal(schema.parse(42), 42)
    assert.throws(() => schema.parse("42"), ValidationError)
  })

  it("v.boolean() validates booleans", () => {
    const schema = v.boolean()
    assert.equal(schema.parse(true), true)
    assert.throws(() => schema.parse("true"), ValidationError)
  })
})

describe("Validator - String methods", () => {
  it("v.string().min() validates minimum length", () => {
    const schema = v.string().min(3)
    assert.equal(schema.parse("abc"), "abc")
    assert.throws(() => schema.parse("ab"), ValidationError)
  })

  it("v.string().max() validates maximum length", () => {
    const schema = v.string().max(5)
    assert.equal(schema.parse("hello"), "hello")
    assert.throws(() => schema.parse("toolong"), ValidationError)
  })

  it("v.string().regex() validates email format", () => {
    const schema = v.string().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
    assert.equal(schema.parse("test@example.com"), "test@example.com")
    assert.throws(() => schema.parse("invalid"), ValidationError)
  })

  it("v.string().regex() validates custom patterns", () => {
    const schema = v.string().regex(/^[A-Z]{3}$/)
    assert.equal(schema.parse("ABC"), "ABC")
    assert.throws(() => schema.parse("abc"), ValidationError)
    assert.throws(() => schema.parse("ABCD"), ValidationError)
  })
})

describe("Validator - Number methods", () => {
  it("v.number().min() validates minimum value", () => {
    const schema = v.number().min(10)
    assert.equal(schema.parse(15), 15)
    assert.throws(() => schema.parse(5), ValidationError)
  })

  it("v.number().max() validates maximum value", () => {
    const schema = v.number().max(100)
    assert.equal(schema.parse(50), 50)
    assert.throws(() => schema.parse(150), ValidationError)
  })
})

describe("Validator - Complex types", () => {
  it("v.array() validates arrays", () => {
    const schema = v.array(v.string())
    assert.deepEqual(schema.parse(["a", "b"]), ["a", "b"])
    assert.throws(() => schema.parse([1, 2]), ValidationError)
  })

  it("v.object() validates objects", () => {
    const schema = v.object({
      name: v.string(),
      age: v.number(),
    })
    const result = schema.parse({ name: "John", age: 30 })
    assert.deepEqual(result, { name: "John", age: 30 })
    assert.throws(() => schema.parse({ name: "John" }), ValidationError)
  })

  it("v.enum() validates enum values", () => {
    const schema = v.enum(["a", "b", "c"])
    assert.equal(schema.parse("a"), "a")
    assert.throws(() => schema.parse("d"), ValidationError)
  })

  it("v.literal() validates literal values", () => {
    const schema = v.literal("admin")
    assert.equal(schema.parse("admin"), "admin")
    assert.throws(() => schema.parse("user"), ValidationError)
  })
})

describe("Validator - Modifiers", () => {
  it(".optional() allows undefined", () => {
    const schema = v.string().optional()
    assert.equal(schema.parse("test"), "test")
    assert.equal(schema.parse(undefined), undefined)
  })

  it(".nullable() allows null", () => {
    const schema = v.string().nullable()
    assert.equal(schema.parse("test"), "test")
    assert.equal(schema.parse(null), null)
  })

  it(".default() provides default value", () => {
    const schema = v.string().default("default")
    assert.equal(schema.parse("test"), "test")
    assert.equal(schema.parse(undefined), "default")
  })
})
