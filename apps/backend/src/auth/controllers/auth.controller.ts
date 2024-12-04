import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  UnauthorizedException,
  Headers,
  Logger,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';
import type { Request } from 'express';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { ThrottlerGuard, SkipThrottle } from '@nestjs/throttler';
import { LoginThrottlerGuard } from '../guards/throttler.guard';

@ApiTags('Authentication')
@Controller('auth')
@UseGuards(ThrottlerGuard)
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Post('google/register')
  @ApiOperation({ summary: 'Register user with Google credentials' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Successfully registered',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid credentials',
  })
  public async googleRegister(@Body('credential') credential: string): Promise<any> {
    try {
      this.logger.log('Google registration attempt');
      return await this.authService.googleRegister(credential);
    } catch (error) {
      this.logger.error(`Google registration failed: ${(error as any).message}`);
      throw error;
    }
  }

  @Post('register')
  @ApiOperation({ summary: 'Register new user' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User successfully registered',
  })
  @HttpCode(HttpStatus.CREATED)
  public async register(@Body() registerDto: RegisterDto): Promise<any> {
    try {
      this.logger.log(`Registration attempt for email: ${registerDto.email}`);
      const user = await this.authService.register(registerDto);
      const loginResponse = await this.authService.login(user);
      this.logger.log(`Successfully registered user: ${registerDto.email}`);
      return loginResponse;
    } catch (error) {
      this.logger.error(`Registration failed: ${(error as any).message}`, (error as any).stack);
      throw error;
    }
  }

  @UseGuards(LocalAuthGuard, LoginThrottlerGuard)
  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Successfully logged in' })
  public async login(@Body() loginDto: LoginDto, @Req() req: Request & { user?: any }): Promise<any> {
    try {
      this.logger.log(`Login attempt for email: ${loginDto.email}`);

      if (!req.user) {
        this.logger.error(
          'Login failed: No user in request after LocalAuthGuard',
        );
        throw new UnauthorizedException('Authentication failed');
      }

      const result = await this.authService.login(req.user);
      this.logger.log(`Login successful for user: ${loginDto.email}`);
      return result;
    } catch (error) {
      this.logger.error(`Login failed for ${loginDto.email}: ${(error as any).message}`);
      throw error;
    }
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Token refreshed successfully',
  })
  @HttpCode(HttpStatus.OK)
  public async refreshToken(@Body('refresh_token') refreshToken: string): Promise<any> {
    try {
      if (!refreshToken?.trim()) {
        throw new UnauthorizedException('No refresh token provided');
      }
      return await this.authService.refreshToken(refreshToken);
    } catch (error) {
      this.logger.error(`Token refresh failed: ${(error as any).message}`);
      throw error;
    }
  }

  @UseGuards(LoginThrottlerGuard)
  @Post('google/token')
  @ApiOperation({ summary: 'Authenticate with Google token' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully authenticated',
  })
  public async googleAuth(@Body('token') token: string): Promise<any> {
    try {
      this.logger.log('Google authentication attempt');
      return await this.authService.googleLogin(token);
    } catch (error) {
      this.logger.error(`Google authentication failed: ${(error as any).message}`);
      throw error;
    }
  }

  @UseGuards(LoginThrottlerGuard)
  @Post('google/callback')
  @ApiOperation({ summary: 'Handle Google OAuth callback' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully authenticated',
  })
  public async googleCallback(@Body('credential') credential: string): Promise<any> {
    try {
      this.logger.log('Google callback authentication attempt');
      return await this.authService.googleLogin(credential);
    } catch (error) {
      this.logger.error(`Google callback failed: ${(error as any).message}`);
      throw error;
    }
  }

  @SkipThrottle()
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @ApiOperation({ summary: 'Logout user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully logged out',
  })
  @HttpCode(HttpStatus.OK)
  public async logout(@Req() req: Request, @Headers('authorization') auth: string): Promise<any> {
    try {
      const token = auth?.split(' ')[1];
      if (!token) {
        throw new UnauthorizedException('No token provided');
      }
      if (!req.user) {
        throw new UnauthorizedException('User not found in request');
      }
      return await this.authService.logout(token);
    } catch (error) {
      this.logger.error(`Logout failed: ${(error as any).message}`);
      throw error;
    }
  }
}
