import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshTokenEntity } from './entities/refresh-token.entity';
import { Repository } from 'typeorm';
import ms from 'ms';

@Injectable()
export class RefreshTokenService {
  constructor(
    @InjectRepository(RefreshTokenEntity)
    private readonly refreshTokenRepo: Repository<RefreshTokenEntity>,
  ) {}

  async findOneByToken(token: string) {
    return this.refreshTokenRepo.findOne({
      where: { token },
      relations: ['user'],
    });
  }

  async deleteById(id: number) {
    await this.refreshTokenRepo.delete({ id });
  }

  async saveToken({
    token,
    userId,
    expiresIn,
  }: {
    token: string;
    userId: number;
    expiresIn: string;
  }) {
    const expiresInMs = ms(expiresIn); // convert '7d' → milliseconds
    const expiresAt = new Date(Date.now() + expiresInMs);

    const newToken = this.refreshTokenRepo.create({
      token,
      MaNguoiDung: userId,
      expiresAt,
    });

    return this.refreshTokenRepo.save(newToken);
  }
}
