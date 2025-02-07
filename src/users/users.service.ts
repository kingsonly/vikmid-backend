import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    findOneByEmail(email: string): Promise<User | undefined> {
        return this.usersRepository.findOne({ where: { email } });
    }

    findOneById(id: string): Promise<User | undefined> {
        return this.usersRepository.findOne({
            where: { id }
        })
    }

    async create(user: Partial<User>) {
        const newUser = this.usersRepository.create(user);
        return this.usersRepository.save(newUser);
    }
}
