import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserService } from '../../users/services/user.service';
import { LoginDto } from '../dtos/login.dto';
import { RefreshTokenDto } from '../dtos/refresh-token.dto';
import { RefreshToken } from '../entities/refresh-token.entity';
import { comparePassword } from '../../common/utils/hash-password.util';
import { ConfigService } from '@nestjs/config';
import { UserType } from 'src/enums/user-type/user-type.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectModel(RefreshToken.name)
    private refreshTokenModel: Model<RefreshToken>,
  ) {}

  /**
   * Handle user login, authenticate credentials, generate and save tokens.
   * @param loginDto - The login credentials (email and password)
   * @returns Access and refresh tokens for the authenticated user
   * @throws UnauthorizedException - If the credentials are invalid
   */
  async login(loginDto: LoginDto) {
    const user = await this.userService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await comparePassword(
      loginDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.generateTokens(
      user._id,
      user.email,
      user.userType,
    );
    await this.saveRefreshToken(user._id, tokens.refreshToken);

    return tokens;
  }

  /**
   * Refresh user tokens using a valid refresh token.
   * @param refreshTokenDto - The refresh token provided by the user
   * @returns New access and refresh tokens
   * @throws UnauthorizedException - If the refresh token is invalid or expired
   */
  async refreshTokens(refreshTokenDto: RefreshTokenDto) {
    const refreshToken = await this.refreshTokenModel.findOne({
      token: refreshTokenDto.refreshToken,
      revoked: false,
    });

    if (!refreshToken || refreshToken.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.userService.findById(refreshToken.userId as any);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    await this.refreshTokenModel.findByIdAndUpdate(refreshToken._id, {
      revoked: true,
    });

    const tokens = await this.generateTokens(
      user._id,
      user.email,
      user.userType,
    );
    await this.saveRefreshToken(user._id, tokens.refreshToken);

    return tokens;
  }

  /**
   * Log the user out by revoking all their active refresh tokens.
   * @param userId - The user ID whose tokens are being revoked
   * @returns A success message indicating logout
   */
  async logout(userId: string) {
    await this.refreshTokenModel.updateMany(
      { userId, revoked: false },
      { revoked: true },
    );
    return { message: 'Logged out successfully' };
  }

  /**
   * Generate new access and refresh tokens for the given user.
   * @param userId - The user ID
   * @param email - The email of the user
   * @returns The generated access and refresh tokens
   */
  private async generateTokens(
    userId: string,
    email: string,
    userType: UserType,
  ) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId, email, type: userType },
        {
          secret: this.configService.get<string>('JWT_SECRET'),
          expiresIn: '7d',
        },
      ),
      this.jwtService.signAsync(
        { sub: userId, email, type: userType },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: '30d',
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  /**
   * Save the generated refresh token to the database with an expiration date.
   * @param userId - The user ID
   * @param token - The generated refresh token
   */
  private async saveRefreshToken(userId: string, token: string) {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const refreshToken = new this.refreshTokenModel({
      token,
      userId,
      expiresAt,
    });

    await refreshToken.save();
  }
}
