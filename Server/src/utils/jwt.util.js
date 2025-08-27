const jwt = require("jsonwebtoken");
const { config: configDotenv } = require("dotenv");
const fs = require("fs");
const path = require("path");

configDotenv();

const PRIVATE_KEY_PATH =
  process.env.PRIVATE_KEY_PATH || path.join(__dirname, "private.pem");
const PUBLIC_KEY_PATH =
  process.env.PUBLIC_KEY_PATH || path.join(__dirname, "public.pem");

if (!fs.existsSync(PRIVATE_KEY_PATH)) {
  console.error("Private key not found at", PRIVATE_KEY_PATH);
  process.exit(1);
}

if (!fs.existsSync(PUBLIC_KEY_PATH)) {
  console.error("Public key not found at", PUBLIC_KEY_PATH);
  process.exit(1);
}

const privateKeyPem = fs.readFileSync(PRIVATE_KEY_PATH, "utf8");
const publicKeyPem = fs.readFileSync(PUBLIC_KEY_PATH, "utf8");

const createTokenPair = async (payload) => {
  try {
    const accessToken = jwt.sign(payload, privateKeyPem, {
      algorithm: "RS256",
      expiresIn: "2 days",
    });

    const refreshToken = jwt.sign(payload, privateKeyPem, {
      algorithm: "RS256",
      expiresIn: "7 days",
    });

    return { accessToken, refreshToken };
  } catch (error) {
    console.error("Error creating token pair:", error);
    throw error;
  }
};

export { createTokenPair, publicKeyPem };
