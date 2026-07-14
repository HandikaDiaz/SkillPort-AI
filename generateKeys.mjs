// import { generateKeyPairSync } from "crypto";
// import { writeFileSync } from "fs";

// // Generate RSA key pair (PKCS#8)
// const { privateKey, publicKey } = generateKeyPairSync("rsa", {
//     modulusLength: 2048,
//     publicKeyEncoding: {
//         type: "spki",
//         format: "pem",
//     },
//     privateKeyEncoding: {
//         type: "pkcs8",
//         format: "pem",
//     },
// });

// console.log("=== PRIVATE KEY (PKCS#8) ===");
// console.log(privateKey);

// console.log("\n=== PUBLIC KEY ===");
// console.log(publicKey);

// generate-jwks.mjs
import { readFileSync } from "fs";  // ✅ Tambah ini
import { createPublicKey } from "crypto";

const privateKeyPem = readFileSync("private-key.pem", "utf-8");
const publicKey = createPublicKey(privateKeyPem);
const jwk = publicKey.export({ format: "jwk" });

const jwks = JSON.stringify({
    keys: [
        {
            use: "sig",
            kty: "RSA",
            n: jwk.n,
            e: jwk.e,
        },
    ],
});

console.log("=== JWKS (simpan di Convex Dashboard) ===");
console.log(`JWKS=${jwks}`);