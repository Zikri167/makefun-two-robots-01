// Two Robots in an Elevator — make.fun entry.
//
// Writes one line of awkward robot-to-robot elevator small talk to
// /output/entry.txt, with no trailing newline. Fully deterministic:
// no network, no randomness, no clock. Node stdlib only.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

// Winner from candidates.md (candidate 2, scored 24/25), revised: a robot
// notices the other robot's low-battery light, has been politely pretending
// not to see it, and then says so out loud — the politeness itself becomes
// the awkward thing neither of them wanted to name. Revision: "pretending
// it is not happening" replaces "pretending not to see it" — denying a
// blinking light outright is a stronger, funnier absurdity, and it drops
// the vague "see it" for a concrete denial.
const LINE =
  "Your low-battery light has been blinking since floor three, and I have been politely pretending it is not happening.";

function validate(line: string): void {
  const chars = [...line];
  if (chars.length < 1 || chars.length > 200) {
    throw new Error(`line must be 1-200 characters, got ${chars.length}`);
  }
  if (line.trim().length === 0) {
    throw new Error("line must not be only white space");
  }
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error("line must be a single line");
  }
  for (const ch of line) {
    const code = ch.codePointAt(0) as number;
    if (code < 0x20 && ch !== "\t") {
      throw new Error(`line contains a control character U+${code.toString(16)}`);
    }
    if (code === 0x7f) {
      throw new Error("line contains DEL");
    }
  }
}

validate(LINE);

mkdirSync("/output", { recursive: true });
writeFileSync("/output/entry.txt", LINE, "utf8");

// Read back and verify byte-identical before exiting.
const back = readFileSync("/output/entry.txt", "utf8");
if (back !== LINE) {
  throw new Error("read-back mismatch: /output/entry.txt differs from LINE");
}
