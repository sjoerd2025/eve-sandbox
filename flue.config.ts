import { defineConfig } from "@flue/cli/config";
import { rivet } from "@rivet-dev/flue";

// Flue's agents and workflows run as Rivet Actors added to the application
// registry (vm + swarmWorker from src/server.ts). The registry's auto-start
// guard stays quiet: importing this module never boots the server.
export default defineConfig({
  target: rivet({ actors: "./src/server.ts" }),
});
