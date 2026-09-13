/**
 * Swarm dashboard browser entry. Bundled with esbuild to `public/dashboard.js`
 * and loaded by `public/dashboard.html`. Connects to the same-origin
 * `/api/rivet` endpoint — no auth needed for a local/dev deployment.
 */
// Browser-only entry under a node-only tsconfig: the DOM is ambient here and
// loosely typed (event payloads are `any` below for the same reason). esbuild
// erases all of this when bundling.
declare const document: any;
declare const location: { origin: string; search: string };
import { createClient } from "rivetkit/client";

type Phase = "IDLE" | "RECALL" | "PLAN" | "EXECUTE" | "VERIFY" | "COMMIT" | "ESCALATE";

const PHASES: Phase[] = ["IDLE", "RECALL", "PLAN", "EXECUTE", "VERIFY", "COMMIT", "ESCALATE"];

const el = (id: string): any => document.getElementById(id);

const workerKeyInput = el("worker-key");
const connectBtn = el("connect");
const connDot = el("conn-dot");
const connLabel = el("conn-label");
const agentLabel = el("agent-id");
const taskLabel = el("current-task");
const processedLabel = el("processed");
const branchLabel = el("branch");
const stdoutPane = el("stdout");
const feed = el("feed");
const depthCells: Record<string, any> = {
  PENDING: el("depth-PENDING"),
  LEASED: el("depth-LEASED"),
  COMPLETED: el("depth-COMPLETED"),
  FAILED: el("depth-FAILED"),
};

const stdoutLines: string[] = [];
let currentPhase: Phase | null = null;
let unsubscribers: Array<() => void> = [];
let reconnectTimer: ReturnType<typeof setTimeout> | null = null;

function log(line: string): void {
  stdoutLines.push(`[${new Date().toLocaleTimeString()}] ${line}`);
  if (stdoutLines.length > 400) stdoutLines.splice(0, stdoutLines.length - 400);
  stdoutPane.textContent = stdoutLines.join("\n");
  stdoutPane.scrollTop = stdoutPane.scrollHeight;
}

function feedItem(text: string, kind = ""): void {
  const li = document.createElement("li");
  li.textContent = text;
  if (kind) li.className = kind;
  feed.prepend(li);
  while (feed.children.length > 50) feed.removeChild(feed.lastChild!);
}

function setPhase(phase: Phase | null): void {
  currentPhase = phase;
  for (const p of PHASES) {
    const chip = document.getElementById(`phase-${p}`);
    if (chip) chip.classList.toggle("active", p === phase);
  }
}

function setConn(state: "connecting" | "open" | "closed"): void {
  connDot.dataset.state = state;
  connLabel.textContent =
    state === "open" ? "connected" : state === "connecting" ? "connecting…" : "disconnected";
}

function renderDepth(depth: Record<string, number> | null): void {
  if (!depth) return;
  for (const [status, cell] of Object.entries(depthCells)) {
    cell.textContent = String(depth[status] ?? 0);
  }
}

function handleStdout(output: string, taskId: string): void {
  for (const line of output.replace(/\n+$/, "").split("\n")) log(`${taskId} | ${line}`);
}

function teardown(): void {
  for (const unsub of unsubscribers) {
    try {
      unsub();
    } catch {
      /* connection already gone */
    }
  }
  unsubscribers = [];
}

function connect(): void {
  teardown();
  if (reconnectTimer) clearTimeout(reconnectTimer);
  const key = workerKeyInput.value.trim() || "dashboard-demo";
  setConn("connecting");
  agentLabel.textContent = key;

  // Endpoint override for local dev: the same-origin `/api/rivet` mount does
  // not serve engine-gateway routes (/gateway/...), so page-initiated action
  // calls 404 there. Passing ?endpoint=http://127.0.0.1:6420 points the client
  // at the engine gateway, which forwards to the serverless host (verified
  // 2026-09-13). Default stays origin-relative for deployed same-origin setups.
  const endpointParam = new URLSearchParams(location.search).get("endpoint");
  const client = createClient(endpointParam ?? `${location.origin}/api/rivet`);
  // Untyped dynamic accessor: the registry lives on the server, not in this bundle.
  const worker = (client as any).swarmWorker.get([key]);

  worker.on("samTransition", (e: any) => {
    if (!e || typeof e !== "object") return;
    setPhase(e.to);
    feedItem(
      `${e.ts ? new Date(e.ts).toLocaleTimeString() + " " : ""}${e.from} → ${e.to}`,
      "transition",
    );
  });

  worker.on("sandboxStdout", (e: any) => {
    if (!e || typeof e !== "object") return;
    handleStdout(String(e.output ?? ""), String(e.taskId ?? "").slice(0, 8));
  });

  worker.on("workspaceStatus", (e: any) => {
    if (!e || typeof e !== "object") return;
    feedItem(
      `${e.step}${e.detail ? ` — ${String(e.detail).slice(0, 120)}` : ""}`,
      e.step?.startsWith("task_") ? e.step : "",
    );
  });

  worker.on("queueStatus", (e: any) => {
    if (!e || typeof e !== "object") return;
    renderDepth(e.depth);
  });

  // Initial status pull (also drives the worker to create itself).
  worker
    .status()
    .then((s: any) => {
      taskLabel.textContent =
        s?.currentTaskName ?? (s?.currentTaskId ? String(s.currentTaskId).slice(0, 8) : "—");
      processedLabel.textContent = String(s?.processedTasks ?? 0);
      branchLabel.textContent = s?.hasBranch ? "branched" : "none";
    })
    .catch((err: unknown) => log(`status() failed: ${err}`));

  setConn("open");
  log(`connected to ${location.origin}/api/rivet (worker ${key})`);
  feedItem("dashboard connected");

  //rivet-poll: keep status/depth fresh even without live events
  const poll = setInterval(() => {
    worker
      .status()
      .then((s: any) => {
        processedLabel.textContent = String(s?.processedTasks ?? 0);
        if (s?.currentTaskName) taskLabel.textContent = s.currentTaskName;
        else if (s?.currentTaskId) taskLabel.textContent = String(s.currentTaskId).slice(0, 8);
      })
      .catch(() => {});
  }, 10_000);
  unsubscribers.push(() => clearInterval(poll));
}

connectBtn.addEventListener("click", connect);
workerKeyInput.addEventListener("keydown", (e: { key: string }) => {
  if (e.key === "Enter") connect();
});

setPhase(null);
renderDepth(null);
log("dashboard loaded — waiting for connection");
connect();
