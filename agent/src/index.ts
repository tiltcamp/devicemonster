import { cli } from "./cli";

cli().catch((error) => {
	console.error("An error occurred:", error);
	process.exit(1);
});
