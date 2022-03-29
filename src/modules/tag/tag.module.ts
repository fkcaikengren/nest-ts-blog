import { Tag } from './tag.entity';
import { TagController } from './tag.controller';
import { Module } from '@nestjs/common';
import { TagService } from './tag.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Tag])],
  exports: [TagService],
  providers: [TagService],
  controllers: [TagController],
})
export class TagModule {}
