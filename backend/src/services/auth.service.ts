import bcrypt from "bcrypt";
import jwt, { SignOptions } from "jsonwebtoken";
import { query } from "../config/database.js";
import { JWT_ACCESS_TOKEN_EXPIRES, JWT_REFRESH_TOKEN_EXPIRES, JWT_SECRET } from "../config/auth.js";

const SALT_ROUNDS = 12;

export class AuthService {
  static async signup({ email, password, fullName }: { email: string; password: string; fullName: string }) {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const insert = await query(
      `INSERT INTO users (email, full_name, password_hash, created_at) VALUES ($1, $2, $3, NOW()) RETURNING id, email, full_name, created_at`,
      [email, fullName, hashedPassword]
    );
    const user = insert.rows[0];
    const tokens = AuthService.createTokens(user.id);
    return { data: user, tokens };
  }

  static async login({ email, password }: { email: string; password: string }) {
    const result = await query(`SELECT id, email, full_name, password_hash FROM users WHERE email = $1 LIMIT 1`, [email]);
    const user = result.rows[0];
    if (!user) {
      throw new Error("Invalid email or password.");
    }
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      throw new Error("Invalid email or password.");
    }
    const tokens = AuthService.createTokens(user.id);
    return { data: { id: user.id, email: user.email, fullName: user.full_name }, tokens };
  }

  static createTokens(userId: string) {
    const options = { expiresIn: JWT_ACCESS_TOKEN_EXPIRES } as SignOptions;
    const accessToken = jwt.sign({ sub: userId }, JWT_SECRET, options);
    const refreshToken = jwt.sign({ sub: userId, type: "refresh" }, JWT_SECRET, { expiresIn: JWT_REFRESH_TOKEN_EXPIRES } as SignOptions);
    return { accessToken, refreshToken };
  }

  static async getUserById(userId: string) {
    const result = await query(`SELECT id, email, full_name FROM users WHERE id = $1 LIMIT 1`, [userId]);
    return result.rows[0] || null;
  }
}
