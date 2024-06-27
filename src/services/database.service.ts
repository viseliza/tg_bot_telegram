import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Telegram_user, Prisma, Log } from '@prisma/client';
import { CreateUserDto } from '../dto/create.user.dto';
import { CreateLogDto } from '../dto/create.log.dto';
import { GetUserDto } from 'src/dto/get.user.dto';

@Injectable()
export class DatabaseService {
    constructor(private prisma: PrismaService) { }

    async findTgUser(where: GetUserDto): Promise<Telegram_user> {
        return await this.prisma.telegram_user.findUnique({ where });
    }

    async createTgUser(data: CreateUserDto): Promise<Telegram_user> {
        return await this.prisma.telegram_user.create({ data });
    }

    async createLog(data: CreateLogDto): Promise<Log> {
        return await this.prisma.log.create({ data });
    }
}

