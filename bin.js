#!/usr/bin/env node

import { copyFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sourcePath = path.join(__dirname, "dist", "drop-in.css");
const destinationPath = path.join(process.cwd(), "src", "drop-in.css");

try {
  await mkdir(path.dirname(destinationPath), { recursive: true });
  await copyFile(sourcePath, destinationPath);
  console.log(`Successfully copied drop-in.css to ${destinationPath}`);
} catch (error) {
  console.error("Error occurred while copying drop-in.css:", error);
  process.exitCode = 1;
}
