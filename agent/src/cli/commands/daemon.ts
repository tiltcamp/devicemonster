import { daemon } from "../../daemon";

export async function daemonCommand(): Promise<void> {
	await daemon();
}
