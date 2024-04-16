import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginAuthDto } from './dto/auth-login.dto';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private jwtService: JwtService,
    ) { }
      
    async login({ email, password }: LoginAuthDto){
        const user = await this.userRepository.findOne({
            relations: { rol: true},
            where: {
                email,
                isActive: true,
            },
        });
        if(!user || !user.checkPassword(password)){
           return {
            message: "No se encontro el usuario",
            ok: false,
            status: HttpStatus.NOT_FOUND,
           }
        }
        
        user.password = undefined;
        const payload = {
            _sub: user.id,
            _name: user.name,
            _rol: user.rol.name,
        };

        const token = this.jwtService.sign(payload);

        return{ ok: true, token, user, status: HttpStatus.OK};
    }
}
