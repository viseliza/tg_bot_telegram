import { Module } from '@nestjs/common';
import { DatabaseService } from '../services/database.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
	providers: [DatabaseService, PrismaService],
})
export class DatabaseModule { }