import { createWorld as createRivetWorld } from "@rivet-dev/vercel-world";
import { registry } from "./actors";

/**
 * Rivet World runs Eve workflows on Rivet Actors, so runs resume instead of
 * restarting. The first World operation starts the registry and waits for the
 * Rivet envoy to be ready.
 */
export const createWorld = () => createRivetWorld({ registry });
