import dotenv from "dotenv";

dotenv.config();

export const JWT_SECRET = process.env.JWT_SECRET || "change_me_to_a_long_random_secret";
export const JWT_ACCESS_TOKEN_EXPIRES = process.env.JWT_ACCESS_TOKEN_EXPIRES || "15m";
export const JWT_REFRESH_TOKEN_EXPIRES = process.env.JWT_REFRESH_TOKEN_EXPIRES || "30d";
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "";
export const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || "";
export const AI_PROVIDER_ENDPOINT = process.env.AI_PROVIDER_ENDPOINT || "http://127.0.0.1:11434";
export const AI_PROVIDER_MODEL = process.env.AI_PROVIDER_MODEL || "llama-3.3-70b";
