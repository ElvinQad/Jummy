import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import {  UserDataService  } from '../../users/services/user-data.service';
import { GoogleAuthService } from './google-auth.service';
import { RegisterDto } from '../dto/register.dto';
import { TokenBlacklistService } from './token-blacklist.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private userDataService: UserDataService,
    private jwtService: JwtService,
    private googleAuthService: GoogleAuthService,
    private tokenBlacklistService: TokenBlacklistService,
  ) {}

  async register(dto: RegisterDto): Promise<any> {
    try {
      const [firstName, ...lastNameParts] = dto.name.trim().split(' ');
      const lastName = lastNameParts.join(' ') || ''; // Ensure lastName is never undefined

      const userDto = {
        email: dto.email,
        phone: dto.phone,
        password: dto.password,
        isChef: false,
        profile: {
          firstName: firstName || dto.name, // Fallback if split fails
          lastName,
        },
      };

      const user = await this.userDataService.create(userDto);
      if (!user) {
        throw new Error('Failed to create user');
      }
      return user;
    } catch (error) {
      if ((error as any).code === 'P2002') {
        throw new UnauthorizedException('Email or phone number already exists');
      }
      throw error;
    }
  }

  async googleRegister(token: string): Promise<any> {
    const userDto = await this.googleAuthService.validateGoogleToken(token);
    const existingUser = await this.userDataService.findByEmail(userDto.email);

    if (existingUser) {
      throw new UnauthorizedException('User already exists');
    }

    const newUser = await this.userDataService.create(userDto);
    return this.login(newUser);
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userDataService.findByEmail(email);
    if (!user) {
      this.logger.warn(`User not found: ${email}`);
      throw new UnauthorizedException('Belə istifadəçi yoxdu');
    }
    
    console.log('User found:', JSON.stringify(user, (_, value) =>
      typeof value === 'bigint' ? value.toString() : value
    ), null, 2);


    if (!user.password) {
      this.logger.warn(`User ${email} has no password (might be Google user)`);
      throw new UnauthorizedException(
        'Please use Google sign-in for this account',
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      this.logger.warn(`Invalid password for user: ${email}`);
      throw new UnauthorizedException('Invalid email or password');
    }

    this.logger.debug(`User ${email} validated successfully`);
    return user;
  }

  login(user: any): { access_token: string; refresh_token: string; user: any } {
    const payload = { email: user.email, sub: user.id };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        isChef: user.isChef,
        profile: user.profile
          ? {
              firstName: user.profile.firstName,
              lastName: user.profile.lastName,
              avatar: user.profile.avatar,
              address: user.profile.addresses?.[0]?.addressLine1 || '',
            }
          : null,
      },
    };
  }

  async validateToken(token: string): Promise<any> {
    try {
      if (this.tokenBlacklistService.isBlacklisted(token)) {
        throw new UnauthorizedException('Token has been invalidated');
      }
      const payload = await this.jwtService.verify(token);
      return this.userDataService.findOne(payload.sub);
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }

  async refreshToken(refreshToken: string): Promise<any> {
    try {
      const payload = await this.jwtService.verify(refreshToken);
      const user = await this.userDataService.findOne(payload.sub);
      return this.login(user);
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async googleLogin(token: string): Promise<{ 
    access_token: string; 
    refresh_token: string; 
    user: { 
      id: number; 
      email: string; 
      phone: string | null; 
      isChef: boolean; 
      profile: { 
        firstName: string; 
        lastName: string; 
        avatar: string | null; 
        address: string; 
      } | null; 
    }; 
  }> {
    const userDto = await this.googleAuthService.validateGoogleToken(token);
    let user = await this.userDataService.findByEmail(userDto.email);

    if (!user) {
      throw new UnauthorizedException('User not found. Please register first.');
    }

    // Update existing user's Google ID if not set
    if (!user.googleId) {
      await this.userDataService.update(user.id, {
        googleId: userDto.googleId,
      });
      // Fetch the complete user with profile after update
      user = await this.userDataService.findOne(user.id);
    }
    return this.login(user);
  }

  logout( token: string): { success: boolean; message: string } {
    this.tokenBlacklistService.addToBlacklist(token);
    return { success: true, message: 'Logged out successfully' };
  }
}
