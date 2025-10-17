import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function buildCssModule(inputFile, outputFile) {
	try {
		const css = await fs.readFile(path.join(__dirname, inputFile), "utf8");
		const js = `const css = ${JSON.stringify(css)};\nexport default css;`;
		await fs.writeFile(path.join(__dirname, outputFile), js);
		console.log(`Successfully built ${outputFile}`);
	} catch (error) {
		console.error(`Error building ${outputFile}:`, error);
	}
}

async function buildAll() {
	await buildCssModule("drop-in.css", "raw.js");
	await buildCssModule("decks.css", "decks-raw.js");
}

buildAll();
