import { ReigionData } from "./types";

export async function reigionDetector(): Promise<ReigionData | undefined> {
  // Funding UI is disabled for Demo accounts; do not call third-party IP or
  // payment services just to infer a banking region.
  return undefined;
}
