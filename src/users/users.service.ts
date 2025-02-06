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

    findOneById(id: number): Promise<User | undefined> {
        return this.usersRepository.findOne({ where: { id } });
    }

    async update(id: number, user: Partial<User>) {
        let updatedUser = await this.usersRepository.update(id, user);
        console.log("updated", user);
        if (updatedUser.affected > 0) {
            return this.findOneById(id);
        }

        return false;
    }

    async create(user: Partial<User>) {
        const newUser = this.usersRepository.create(user);
        return this.usersRepository.save(newUser);
    }
}
