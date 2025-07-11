export function daemon(): Promise<void> {
	const exitSignals: NodeJS.Signals[] = [
		"SIGINT",
		"SIGTERM",
		"SIGHUP",
		"SIGQUIT",
	];
	if (process.platform === "win32") exitSignals.push("SIGBREAK");

	exitSignals.forEach((signal) => {
		process.on(signal, () => {
			console.log(`Received ${signal}, shutting down...`);
			process.exit(0);
		});
	});

	return new Promise(() => {
		setInterval(() => {}, 10000);
	});
}
