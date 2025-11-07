// generate_hash.js
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const password = process.env.SITE_PASSWORD;
if (!password) {
  console.error("ERROR: SITE_PASSWORD environment variable is required.");
  process.exit(1);
}

const templatePath = path.join(__dirname, "protect.template.js");
const outPath = path.join(__dirname, "protect.js");

const iterations = 200000; // PBKDF2 iterations (tune as desired)
const dkLen = 32; // 32 bytes = 256 bits
const saltBytes = crypto.randomBytes(16);
const saltBase64 = saltBytes.toString("base64");

const derivedKey = crypto.pbkdf2Sync(password, saltBytes, iterations, dkLen, "sha256");

const derivedKeyBase64 = derivedKey.toString("base64");

let template = fs.readFileSync(templatePath, "utf8");

template = template.replace("VGAAPJ/Fv0uCUTPzha7/6A==", saltBase64).replace("200000", String(iterations)).replace("fMh834ll0h8X6Fb0EWhuGTAywNTQL7kjYZSW1cr+gI4=", derivedKeyBase64);

fs.writeFileSync(outPath, template, { encoding: "utf8", mode: 0o600 });

console.log("protect.js generated (not committed). Salt and derived key injected for deployment.");
