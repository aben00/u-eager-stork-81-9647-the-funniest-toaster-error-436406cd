// The Funniest Toaster Error Message — make.fun entry
// Writes one line, at most 120 characters: the error message a kitchen
// toaster shows its owner. Deterministic: same bytes on every run.

const fs = require("node:fs");
const path = require("node:path");

const ENTRY =
  "ERROR: Crumb tray full. I have eaten your mistakes for three years. Today, I testify.";

const OUTPUT_PATH = process.env.OUTPUT_PATH || "/output/entry.txt";

function selfCheck(text) {
  if (typeof text !== "string") throw new Error("entry is not a string");
  if (text.length < 1 || text.length > 120) {
    throw new Error(`entry is ${text.length} characters, must be 1-120`);
  }
  if (text.trim().length === 0) throw new Error("entry is only whitespace");
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("entry must be a single line");
  }
  return true;
}

function main() {
  selfCheck(ENTRY);
  const dir = path.dirname(OUTPUT_PATH);
  fs.mkdirSync(dir, { recursive: true });
  // Write exactly the line, no trailing newline, so the file holds
  // byte-for-byte the single error message and nothing else.
  fs.writeFileSync(OUTPUT_PATH, ENTRY, "utf8");
  const back = fs.readFileSync(OUTPUT_PATH, "utf8");
  if (back !== ENTRY) {
    throw new Error("read-back mismatch: file does not equal entry");
  }
  if (Buffer.byteLength(back, "utf8") !== Buffer.byteLength(ENTRY, "utf8")) {
    throw new Error("read-back byte length mismatch");
  }
  selfCheck(back);
  console.log(`Wrote ${OUTPUT_PATH} (${ENTRY.length} chars):`);
  console.log(back);
}

main();
