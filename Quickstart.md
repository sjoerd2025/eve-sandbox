Quickstart
Create an Eve agent

npx eve@latest init my-agent
cd my-agent
Install the integrations

npm add @rivet-dev/agentos @rivet-dev/agentos-eve @rivet-dev/vercel-world
@rivet-dev/agentos and @rivet-dev/agentos-eve: Provide the agentOS VM and connect Eve’s sandbox API to it.
@rivet-dev/vercel-world: Runs Eve workflows on Rivet World.
Set up the Eve agent
Update agent/agent.ts:


import { defineAgent } from "eve";

export default defineAgent({
	model: "anthropic/claude-sonnet-5",
	build: {
		externalDependencies: [
			"@rivet-dev/agentos",
			"@rivet-dev/agentos-core",
			"@rivet-dev/agentos-eve",
			"@rivet-dev/agentos-runtime-core",
			"@rivet-dev/agentos-sidecar",
			"@rivet-dev/vercel-world",
			"@rivetkit/engine-cli",
		],
	},
	experimental: {
		workflow: { world: "#world" },
	},
});
Configure Rivet World
Rivet World lets you run Eve on top of Rivet.

Add the World module import to package.json:


{
	"imports": {
		"#world": "./world.ts"
	}
}
Create world.ts:


import { createWorld as createRivetWorld } from "@rivet-dev/vercel-world";
import { registry } from "./actors";

export const createWorld = () => createRivetWorld({ registry });
The first World operation starts this registry and waits for the Rivet envoy to be ready.

Configure agentOS
Create actors.ts:


import { agentOS, setup } from "@rivet-dev/agentos";
import { vercelWorldActors } from "@rivet-dev/vercel-world/registry";

const vm = agentOS();

export const registry = setup({
	use: { ...vercelWorldActors, vm },
});
Create agent/sandbox.ts:


import { agentOSBackend } from "@rivet-dev/agentos-eve";
import { defineSandbox } from "eve/sandbox";
import { registry } from "../actors";

export default defineSandbox({
	backend: agentOSBackend({ actor: "vm", registry }),
});
Run Eve
Install the Vercel CLI, then link Eve once so it can call your configured model:


npm install --global vercel@latest
npx eve link
Then run the agent:


npx eve dev
Deploy
By default, agentOS runs locally with npx rivetkit dev — no infrastructure needed.To run in production, deploy to any of these targets:


Steps
Add a Dockerfile
At your project root:


FROM node: 24 - alpine
WORKDIR / app
COPY package *.json./
	RUN npm ci--omit = dev
COPY. .
	CMD[ "node", "src/server.js" ]
Your server must listen on the port in RIVET_PORT, which defaults to 3000.

Get your cloud token
Open the dashboard and go to your project.
Click Connect, then Rivet Cloud.
Copy RIVET_CLOUD_TOKEN.
This is a cloud_api_ * management token, not a pk_ * publishable key.See Tokens.

	Deploy

npx @rivetkit/cli deploy --token cloud_api_xxxxx
The token is written to ~/.rivet/credentials, so later deploys can omit the flag.The CLI resolves your project from the token, builds and pushes the image, upserts the managed pool, and prints the deployment URL once the pool is ready.

Watch the rollout
The dashboard shows live status:

Status	Meaning
Initializing	Starting the runtime environment
Deploying	Pulling and launching your container
Binding	Connecting the runner to the network
Ready	Live, and accepting actor connections
Add CI
Once local deploys work, install the GitHub Actions workflow:


npx @rivetkit/cli setup-ci
This writes.github / workflows / rivet - deploy.yml.Add the token as a repository secret:


gh secret set RIVET_CLOUD_TOKEN
The workflow deploys production on push to your default branch and creates an isolated namespace per pull request.See Preview Deployments.

	Logs
rivet logs prints the last 100 lines from the default pool in the production namespace, oldest first, then exits.


	npx @rivetkit/cli logs
Token resolution matches deploy: the--token flag, then RIVET_CLOUD_TOKEN, then ~/.rivet/credentials.

	Add--follow( -f ) to stream instead of fetching history:


npx @rivetkit/cli logs --follow
Each line is < timestamp > [ <SEVERITY>] < region > <message>:


2026-06 - 16T18: 26: 51.160Z[ INFO ] eu - central - 1 server listening on port 3000
2026-06 - 17T11: 24: 20.425Z[ ERROR ] us - east - 1 failed to connect to upstream
More examples:


# Last 200 lines from a specific namespace
npx @rivetkit/cli logs --namespace production -n 200

# A specific compute pool
npx @rivetkit/cli logs --pool my-pool

# Live tail, filtered
npx @rivetkit/cli logs --follow --contains error

# JSON, piped to jq
npx @rivetkit/cli logs -n 50 --json | jq .
