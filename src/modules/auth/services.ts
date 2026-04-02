import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config, JwtSignOptions } from "../../config/env";
import { AppError } from "../../shared/errors";
import { LoginDto, RegisterDto } from "./dto";
import { AuthRepository } from "./repositories";
import { logger } from "../../config/logger";

const SALT_ROUNDS = 10;

export class AuthService {
  private readonly authRepository = new AuthRepository();

  async register(payload: RegisterDto): Promise<{ id: string; email: string; token: string }> {
    const normalizedEmail = payload.email.toLowerCase();
    const existingUser = await this.authRepository.findByEmail(normalizedEmail);

    if (existingUser) {
      throw new AppError("Email already registered", 409);
    }

    const passwordHash = await bcrypt.hash(payload.password, SALT_ROUNDS);
    const user = await this.authRepository.createUser(normalizedEmail, passwordHash);

    const token = jwt.sign({ userId: user.id, email: user.email }, config.app.jwtSecret, {
      expiresIn: "1d",
      ...JwtSignOptions
    });

    logger.info("AuthService: User registered successfully", { userId: user.id });

    return {
      id: user.id,
      email: user.email,
      token
    };
  }

  async login(payload: LoginDto): Promise<{ id: string; email: string; token: string }> {
    const normalizedEmail = payload.email.toLowerCase();
    const user = await this.authRepository.findByEmail(normalizedEmail);

    if (!user) {
      throw new AppError("Invalid credentials", 401);
    }

    const isMatch = await bcrypt.compare(payload.password, user.password_hash);

    if (!isMatch) {
      throw new AppError("Invalid credentials", 401);
    }

    const token = jwt.sign({ userId: user.id, email: user.email }, config.app.jwtSecret, {
      expiresIn: "1d",
      ...JwtSignOptions
    });

    logger.info("AuthService: User logged in successfully", { userId: user.id });

    return {
      id: user.id,
      email: user.email,
      token
    };
  }
}
