import { getOsConfig } from "./os";

export async function isExecutablePathCorrect(): Promise<boolean> {
	const osConfig = getOsConfig();
	const agentExecutablePath = await osConfig.agentExecutablePath();

	return process.execPath === agentExecutablePath;
}
