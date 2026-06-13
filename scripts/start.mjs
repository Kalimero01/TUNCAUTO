import { execSync } from "node:child_process";

const port = process.env.PORT ?? "3000";
const isProduction = process.env.NODE_ENV === "production";
const pushArgs = ["--skip-generate"];
if (isProduction) {
  pushArgs.push("--accept-data-loss");
}

console.log("[start] Preparing database for migration...");
try {
  execSync("node scripts/pre-migrate.mjs", { stdio: "inherit", timeout: 60_000 });
} catch (error) {
  console.error("[start] Pre-migration failed.", error?.message);
  if (isProduction) {
    process.exit(1);
  }
}

console.log("[start] Running database migrations...");
try {
  execSync(`npx prisma db push ${pushArgs.join(" ")}`, { stdio: "inherit", timeout: 120_000 });
} catch (error) {
  console.error("[start] Database migration failed.", error?.message);
  if (isProduction) {
    process.exit(1);
  }
}

console.log("[start] Seeding default admin if needed...");
try {
  execSync("node scripts/seed.mjs", { stdio: "inherit", timeout: 60_000 });
} catch {
  console.error("[start] Seed failed — admin may already exist.");
}

console.log(`[start] Starting Next.js on port ${port}...`);
execSync(`npx next start -p ${port}`, { stdio: "inherit" });
