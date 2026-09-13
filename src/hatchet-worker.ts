import { hatchet, dispatchNextTask, samCycle, samLoop, hasPendingTasks } from "./swarm/hatchet";

async function main() {
  const worker = await hatchet.worker("swarm-worker", {
    workflows: [dispatchNextTask, samCycle, samLoop],
  });

  // Tick the dispatcher every 5s, but only spawn a Hatchet run when the Turso
  // queue actually has PENDING work — otherwise the tick is a cheap local
  // SELECT and Hatchet never sees empty-queue runs.
  setInterval(() => {
    hasPendingTasks()
      .then((pending: boolean) => {
        if (pending) return dispatchNextTask.runNoWait({});
      })
      .catch(() => {});
  }, 5_000);

  await worker.start();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
