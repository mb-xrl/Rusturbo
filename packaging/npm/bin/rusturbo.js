#!/usr/bin/env node
// Thin shim so `npx rusturbo` / `npm exec rusturbo` executes the native binary.
const { spawnSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const exe = path.join(__dirname, process.platform === "win32" ? "rusturbo.exe" : "rusturbo");

if (!fs.existsSync(exe)) {
  console.error(
    "rusturbo: native binary not found.\n" +
      "Install it directly with:\n" +
      "  cargo install --git https://github.com/the-golden-army/Rusturbo\n" +
      "or reinstall this package so its postinstall step can fetch the binary."
  );
  process.exit(1);
}

const result = spawnSync(exe, process.argv.slice(2), { stdio: "inherit" });
if (result.error) {
  console.error("rusturbo:", result.error.message);
  process.exit(1);
}
process.exit(result.status === null ? 1 : result.status);
