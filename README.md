# @e2b/eve-sandbox

_Experimental._ An [E2B](https://e2b.dev) sandbox backend for Vercel's
[Eve](https://vercel.com/docs/eve) agent framework — the E2B counterpart to
Eve's built-in `vercel()` / `docker()` / `microsandbox()` / `justbash()`
backends. It implements the public `SandboxBackend` interface from `eve/sandbox`,
so no changes to Eve itself are required.

## Install

```bash
npm i @e2b/eve-sandbox e2b
# eve and ai are peer deps provided by your Eve project
```

Set `E2B_API_KEY` (or pass `apiKey` in options).

## Usage

```ts
// agent/sandbox.ts
import { defineSandbox } from "eve/sandbox";
import { e2b } from "@e2b/eve-sandbox";

export default defineSandbox({
  backend: () => e2b({ template: "base" }),
});
```

For one-time setup (installing packages, seeding files), add Eve's optional
`bootstrap` hook or `agent/sandbox/workspace/` seed files — this package bakes
them into a reusable snapshot at build time.

## Testing

```bash
pnpm test          # unit tests (no credentials needed)
pnpm type-check
```

The unit suite covers the network-policy mapping, snapshot naming/dedup, the
`buildSandboxSession` replica, and the background-process adapter. A live
integration test in `test/` boots a real E2B sandbox and **auto-skips unless
`E2B_API_KEY` is set**:

```bash
E2B_API_KEY=... pnpm test   # also runs the live sandbox round-trip
```
