import { ReigionData } from "./types";

export async function reigionDetector(): Promise<ReigionData | undefined> {
  try {
    const response = await fetch("http://ip-api.com/json");
    const result: Promise<ReigionData> = await response.json();
    return result;
  } catch (error) {
    console.error(error);
  }
}