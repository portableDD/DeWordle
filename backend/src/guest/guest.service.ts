/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, UseFilters } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { RedisService } from './provider/redis.service';
import { DatabaseExceptionFilter } from 'src/common/filters';

interface GuestSession {
  id: string;
  expiresAt: Date;
}

@Injectable()
@UseFilters(DatabaseExceptionFilter) // ✅ Apply the database filter
export class GuestUserService {
  private readonly EXPIRATION_TIME_MS = 10 * 60 * 1000; // 10 minutes in milliseconds

  constructor(private readonly redisService: RedisService) {}

  async createGuestUser(): Promise<GuestSession> {
    try {
      const id = uuidv4();
      const expiresAt = new Date(Date.now() + this.EXPIRATION_TIME_MS);

      await this.redisService.setGuestSession(id);

      return { id, expiresAt };
    } catch (error) {
      throw new Error('Failed to create guest user session');
    }
  }

  async validateGuestUser(guestId: string): Promise<boolean> {
    try {
      const session = await this.redisService.getGuestSession(guestId);
      return session !== null;
    } catch (error) {
      throw new Error('Failed to validate guest user session');
    }
  }

  async refreshGuestUserSession(guestId: string): Promise<GuestSession | null> {
    try {
      const isValid = await this.validateGuestUser(guestId);

      if (!isValid) {
        return null;
      }

      const expiresAt = new Date(Date.now() + this.EXPIRATION_TIME_MS);
      return { id: guestId, expiresAt };
    } catch (error) {
      throw new Error('Failed to refresh guest user session');
    }
  }

  async deleteGuestUserSession(guestId: string): Promise<void> {
    try {
      await this.redisService.deleteGuestSession(guestId);
    } catch (error) {
      throw new Error('Failed to delete guest user session');
    }
  }
}
