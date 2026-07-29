# @e2b/eve-sandbox

## 0.1.0

### Minor Changes

- Initial release: E2B sandbox backend for Vercel's Eve agent framework.

- Update to `e2b@^2.35.0` and `eve@^0.27.0`.

  - Adopt E2B's set-once integration attribution (`ConnectionConfig.setIntegration`), tagging every E2B request's `User-Agent` as `eve-sandbox/<version>` so E2B can attribute traffic from this backend.
  - Resolve snapshots via E2B's server-side `name` filter (`Sandbox.listSnapshots({ name })`) instead of scanning up to 100 pages client-side, removing the bounded false-miss risk on large fleets.
  - Rename the sandbox handle's `dispose()` to `shutdown()` to match Eve's updated `SandboxBackendHandle` contract. The Eve peer dependency is now `^0.27.0`.
