export class ValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "ValidationError"
  }
}

export interface Schema<T> {
  parse(input: unknown): T
  optional(): Schema<T | undefined>
  nullable(): Schema<T | null>
  default(value: T): Schema<T>
}

class BaseSchema<T> implements Schema<T> {
  constructor(private validator: (input: unknown) => T) {}

  parse(input: unknown): T {
    return this.validator(input)
  }

  optional(): Schema<T | undefined> {
    return new BaseSchema((input) =>
      input === undefined ? undefined : this.validator(input),
    )
  }

  nullable(): Schema<T | null> {
    return new BaseSchema((input) =>
      input === null ? null : this.validator(input),
    )
  }

  default(value: T): Schema<T> {
    return new BaseSchema((input) =>
      input === undefined ? value : this.validator(input),
    )
  }
}

class StringSchema extends BaseSchema<string> {
  constructor(validator?: (input: unknown) => string) {
    super(
      validator ||
        ((input) => {
          if (typeof input !== "string")
            throw new ValidationError("Expected string")
          return input
        }),
    )
  }

  min(n: number): StringSchema {
    const prev = this.parse.bind(this)
    return new StringSchema((input) => {
      const val = prev(input)
      if (val.length < n)
        throw new ValidationError(`String too short (min: ${n})`)
      return val
    })
  }

  max(n: number): StringSchema {
    const prev = this.parse.bind(this)
    return new StringSchema((input) => {
      const val = prev(input)
      if (val.length > n)
        throw new ValidationError(`String too long (max: ${n})`)
      return val
    })
  }

  length(n: number): StringSchema {
    const prev = this.parse.bind(this)
    return new StringSchema((input) => {
      const val = prev(input)
      if (val.length !== n)
        throw new ValidationError(`String length must be ${n}`)
      return val
    })
  }

  regex(pattern: RegExp): StringSchema {
    const prev = this.parse.bind(this)
    return new StringSchema((input) => {
      const val = prev(input)
      if (!pattern.test(val))
        throw new ValidationError("String does not match pattern")
      return val
    })
  }

  startsWith(prefix: string): StringSchema {
    const prev = this.parse.bind(this)
    return new StringSchema((input) => {
      const val = prev(input)
      if (!val.startsWith(prefix))
        throw new ValidationError(`String must start with "${prefix}"`)
      return val
    })
  }

  endsWith(suffix: string): StringSchema {
    const prev = this.parse.bind(this)
    return new StringSchema((input) => {
      const val = prev(input)
      if (!val.endsWith(suffix))
        throw new ValidationError(`String must end with "${suffix}"`)
      return val
    })
  }
}

class NumberSchema extends BaseSchema<number> {
  constructor(validator?: (input: unknown) => number) {
    super(
      validator ||
        ((input) => {
          if (typeof input !== "number")
            throw new ValidationError("Expected number")
          if (Number.isNaN(input))
            throw new ValidationError("Expected valid number")
          return input
        }),
    )
  }

  min(n: number): NumberSchema {
    const prev = this.parse.bind(this)
    return new NumberSchema((input) => {
      const val = prev(input)
      if (val < n) throw new ValidationError(`Number too small (min: ${n})`)
      return val
    })
  }

  max(n: number): NumberSchema {
    const prev = this.parse.bind(this)
    return new NumberSchema((input) => {
      const val = prev(input)
      if (val > n) throw new ValidationError(`Number too large (max: ${n})`)
      return val
    })
  }
}

export const v = {
  string: () => new StringSchema(),
  number: () => new NumberSchema(),
  boolean: () =>
    new BaseSchema<boolean>((input) => {
      if (typeof input !== "boolean")
        throw new ValidationError("Expected boolean")
      return input
    }),
  literal: <T extends string | number | boolean>(value: T) =>
    new BaseSchema<T>((input) => {
      if (input !== value)
        throw new ValidationError(`Expected literal ${value}`)
      return value
    }),
  enum: <T extends readonly [string, ...string[]]>(values: T) =>
    new BaseSchema<T[number]>((input) => {
      if (!values.includes(input as string))
        throw new ValidationError(`Expected one of: ${values.join(", ")}`)
      return input as T[number]
    }),
  array: <T>(schema: Schema<T>) =>
    new BaseSchema<T[]>((input) => {
      if (!Array.isArray(input)) throw new ValidationError("Expected array")
      return input.map((item, i) => {
        try {
          return schema.parse(item)
        } catch (e) {
          throw new ValidationError(`Array item ${i}: ${(e as Error).message}`)
        }
      })
    }),
  object: <T extends Record<string, Schema<unknown>>>(shape: T) =>
    new BaseSchema<{
      [K in keyof T]: T[K] extends Schema<infer U> ? U : never
    }>((input) => {
      if (typeof input !== "object" || input === null)
        throw new ValidationError("Expected object")
      const result = {} as {
        [K in keyof T]: T[K] extends Schema<infer U> ? U : never
      }
      for (const key in shape) {
        try {
          const schema = shape[key]
          if (schema) {
            result[key] = schema.parse(
              (input as Record<string, unknown>)[key],
            ) as never
          }
        } catch (e) {
          throw new ValidationError(`Field "${key}": ${(e as Error).message}`)
        }
      }
      return result
    }),
  any: () => new BaseSchema<unknown>((input) => input),
  unknown: () => new BaseSchema<unknown>((input) => input),
}

export type Infer<T> = T extends Schema<infer U> ? U : never
