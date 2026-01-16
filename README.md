<p align="center">
 <img src="https://github.com/ofabiodev/elysia-routing/blob/main/.github/assets/logo.svg" align="center" width="200" alt="Elysia Routing Logo">
 <h1 align="center">Elysia Routing</h1>
 <p align="center">
  File-based routing for Elysia with built-in type-safe validation.
 </p>
</p>
<br/>

<p align="center">
 <a href="https://github.com/ofabiodev/elysia-routing/actions?query=branch%3Amain" rel="nofollow"><img alt="GitHub Actions Workflow Status" src="https://img.shields.io/github/actions/workflow/status/ofabiodev/elysia-routing/ci_test.yml?branch=main&event=push"></a>
 <a href="https://opensource.org/licenses/MIT" rel="nofollow"><img alt="License" src="https://img.shields.io/badge/license-MIT-brightgreen"></a>
 <a href="https://www.npmjs.com/package/elysia-routing" rel="nofollow"><img alt="NPM Downloads" src="https://img.shields.io/npm/dw/elysia-routing"></a>
</p>

## Why Elysia Routing?

Stop manually registering routes. **elysia-routing** scans your file structure and automatically creates routes based on filenames. Add type-safe validation with zero dependencies, keep your codebase organized, and scale without the boilerplate.

## Installation

<table>
<tr>
<td width="300">

```bash
# Using Bun
bun add elysia-routing
```

</td>
<td width="300">

```bash
# Using NPM
npm install elysia-routing
```

</td>
<td width="300">

```bash
# Using Yarn
yarn add elysia-routing
```

</td>
</tr>
</table>

## Supported Conventions

<table>
  <tr>
    <th>Convention</th>
    <th>Example</th>
    <th>Result</th>
  </tr>
  <tr>
    <td><code>(group)</code></td>
    <td><code>(admin)/dashboard.get.ts</code></td>
    <td><code>GET /dashboard</code></td>
  </tr>
  <tr>
    <td><code>[param]</code></td>
    <td><code>users/[id]/index.get.ts</code></td>
    <td><code>GET /users/:id</code></td>
  </tr>
  <tr>
    <td><code>index</code></td>
    <td><code>users/index.post.ts</code></td>
    <td><code>POST /users</code></td>
  </tr>
  <tr>
    <td><code>name.method</code></td>
    <td><code>users/profile.get.ts</code></td>
    <td><code>GET /users/profile</code></td>
  </tr>
  <tr>
    <td><code>.all</code></td>
    <td><code>health.all.ts</code></td>
    <td>All HTTP methods</td>
  </tr>
</table>

## Examples

<table>
<tr>
<td>
<blockquote>routes/index.get.ts</blockquote>
</td>
</tr>
<tr>
<td width="1200">

```ts
import { defineRoute } from "elysia-routing"

export default defineRoute({
  handler: () => ({ message: "Hello World" })
})
```

</td>
</tr>
</table>

<table>
<tr>
<td>
<blockquote>routes/users/[id]/index.get.ts</blockquote>
</td>
</tr>
<tr>
<td width="1200">

```ts
import { defineRoute, v } from "elysia-routing"

export default defineRoute({
  schema: {
    params: v.object({
      id: v.string()
    })
  },
  handler: ({ params }) => ({
    user: { id: params.id }
  })
})
```

</td>
</tr>
</table>

<table>
<tr>
<td>
<blockquote>routes/users/index.post.ts</blockquote>
</td>
</tr>
<tr>
<td width="1200">

```ts
import { defineRoute, v } from "elysia-routing"

export default defineRoute({
  schema: {
    body: v.object({
      name: v.string().min(3),
      email: v.string().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
      age: v.number().min(18)
    })
  },
  handler: ({ body }) => ({
    created: body
  })
})
```

</td>
</tr>
</table>

## License

[MIT](LICENSE) © [ofabiodev](https://github.com/ofabiodev)