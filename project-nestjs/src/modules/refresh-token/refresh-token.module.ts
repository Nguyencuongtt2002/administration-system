import { Module } from '@nestjs/common';
import { RefreshTokenService } from './refresh-token.service';
import { RefreshTokenController } from './refresh-token.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshTokenEntity } from './entities/refresh-token.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RefreshTokenEntity])],
  controllers: [RefreshTokenController],
  providers: [RefreshTokenService],
  exports: [RefreshTokenService],
})
export class RefreshTokenModule {}
