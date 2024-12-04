import { Injectable, UnauthorizedException } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleAuthService {
  private google: OAuth2Client;

  constructor(private configService: ConfigService) {
    this.google = new OAuth2Client(
      configService.get('GOOGLE_CLIENT_ID'),
      configService.get('GOOGLE_CLIENT_SECRET'),
      configService.get('GOOGLE_REDIRECT_URI'),
    );
  }

  public async validateGoogleToken(token: string): Promise<any> {
    try {
      const ticket = await this.google.verifyIdToken({
        idToken: token,
        audience: this.configService.get('GOOGLE_CLIENT_ID'),
      });
      const payload = ticket.getPayload();

      return {
        email: payload?.email,
        googleId: payload?.sub,
        isChef: false,
        profile: {
          firstName: payload?.given_name || '',
          lastName: payload?.family_name || '',
          avatar: payload?.picture || '',
        },
      };
    } catch (error) {
      throw new UnauthorizedException(`Invalid Google token: ${(error as any).message}`);
    }
  }
}
