import { cp, mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";

const packageDir = path.dirname(fileURLToPath(import.meta.url));
const workspaceRoot = path.resolve(packageDir, "../..");
const schoolDist = path.join(
  workspaceRoot,
  "artifacts",
  "saraswati-school",
  "dist",
  "public",
);
const productionDist = path.join(packageDir, "dist");

const pnpmCommand = process.platform === "win32" ? "pnpm.cmd" : "pnpm";
const schoolBuild = spawn(
  pnpmCommand,
  ["--filter", "@workspace/saraswati-school", "run", "build"],
  {
    cwd: workspaceRoot,
    env: {
      ...process.env,
      BASE_PATH: "/",
      NODE_ENV: "production",
      PORT: "5173",
    },
    stdio: "inherit",
  },
);

const exitCode = await new Promise((resolve, reject) => {
  schoolBuild.once("error", reject);
  schoolBuild.once("exit", (code, signal) => {
    if (signal) {
      reject(new Error(`School build stopped by ${signal}.`));
      return;
    }
    resolve(code ?? 1);
  });
});

if (exitCode !== 0) {
  process.exitCode = exitCode;
  throw new Error(`School production build failed with exit code ${exitCode}.`);
}

await mkdir(productionDist, { recursive: true });
await cp(schoolDist, productionDist, { recursive: true, force: true });

const entryPoint = await readFile(path.join(productionDist, "index.html"), "utf8");
if (!entryPoint.includes("Saraswati Primary English Medium School")) {
  throw new Error(
    "Production output does not contain the Saraswati school entry point.",
  );
}

console.log(
  `Copied the Saraswati school production site to ${path.relative(
    workspaceRoot,
    productionDist,
  )}.`,
);