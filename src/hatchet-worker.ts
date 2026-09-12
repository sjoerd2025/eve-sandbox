import { hatchet, dispatchNextTask, samCycle, samLoop } from "./swarm/hatchet";

async function main() {
  const worker = await hatchet.worker("swarm-worker", {
    workflows: [dispatchNextTask, samCycle, samLoop],
  });

  // Tick the dispatcher every 5s: claims PENDING tasks from Turso and runs a
  // durable SAM loop per task. Stickers to the default concurrency pool.
  setInterval(() => {
    dispatchNextTask.runNoWait({}).catch(() => {});
  }, 5_000);

  await worker.start();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
