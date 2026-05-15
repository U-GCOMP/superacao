/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PasswordResetRequest } from './entities/reset-password-request.entity';
import { Users } from './entities/user.entity';

@Injectable()
export class PasswordRepository {
  constructor(
    @InjectRepository(PasswordResetRequest)
    private readonly typeormRepo: Repository<PasswordResetRequest>,
  ) {}

  async createRequest(
    user: Users,
    code: string,
    expiresAt: Date,
  ): Promise<PasswordResetRequest> {
    const request = this.typeormRepo.create({
      user,
      code,
      used_at: null,
      expires_at: expiresAt,
    });
    return this.typeormRepo.save(request);
  }

  async findByCode(code: string): Promise<PasswordResetRequest | null> {
    return this.typeormRepo.findOne({ where: { code }, relations: ['user'] });
  }

  async updateRequest(
    request: PasswordResetRequest,
  ): Promise<PasswordResetRequest> {
    return this.typeormRepo.save(request);
  }
}
