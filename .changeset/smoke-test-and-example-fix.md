---
"@e2b/eve-sandbox": minor
---

Add `pnpm smoke` (`scripts/smoke.ts`): a post-deploy smoke test that verifies the
agentOS `vm` actor is live — `/health`, session creation on a dedicated
`smoke-agent` key, and one trivial pi prompt — failing fast (exit 1) on bad
rollouts. Also rewrite `examples/agentos-client/client.ts` to the rivetkit
2.3.10 agentOS action surface (`openSession`/`prompt`/`readFile`, client-supplied
sessionId, VM home `/home/agentos`); the previous example called a
`createSession`/`sendPrompt` surface that does not exist on the pinned rivetkit.
