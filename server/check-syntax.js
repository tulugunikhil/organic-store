const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const collectJavaScriptFiles = (directory) =>
  fs.readdirSync(directory, { withFileTypes: true })
    .sort((left, right) => left.name.localeCompare(right.name))
    .flatMap((entry) => {
      if (entry.isDirectory()) {
        return entry.name === "node_modules"
          ? []
          : collectJavaScriptFiles(path.join(directory, entry.name));
      }

      return entry.isFile() && entry.name.endsWith(".js")
        ? [path.join(directory, entry.name)]
        : [];
    });

for (const file of collectJavaScriptFiles(__dirname)) {
  const result = spawnSync(process.execPath, ["--check", file], { stdio: "inherit" });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status || 1);
}
