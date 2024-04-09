import { HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Like, Repository } from 'typeorm';
import { Role } from 'src/roles/entities/role.entity';
import { SearchUserDto } from './dto/search-user.dto';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) { }
  async create(createUserDto: CreateUserDto) {
    try {
      const newUser = this.userRepository.create(createUserDto);
      return await this.userRepository.save(newUser);
    } catch (error) {
      throw new InternalServerErrorException('Ocurrió un error al crear el usuario.', error);
    }
  }

  async findAll() {
    try {
      const user = await this.userRepository.find();
      return{ok: true, user}
    } catch (error) {
      throw new InternalServerErrorException('Ocurrió un error al obtener los usuarios.', error);
    }
  }
  

  async findOne(id: number) {
    try {
      const user = await this.userRepository.findOne({where:{id}})
      if (!user) {
        throw new NotFoundException(`No se encontró ningún rol con el ID ${id}`);
      }
      return {ok: true, user}
    } catch (error) {
      return {ok:false, error}
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
   try {
    const user = await this.userRepository.findOne({ where: { id } })
    const rol = await this.roleRepository.findOne({ where: { id: updateUserDto.rolId } })


    user.lastName = updateUserDto.lastName
    user.rol = rol
    user.name = updateUserDto.name
 
    await this.userRepository.save(user)
    return{ ok: true, user}
   } catch (error) {
    return{ok: false, error: "Ocurrio un error"}
   }
  }

  async remove(id: number) {
    try {
      const result = await this.userRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException(`No se encontró ningún usuario con el ID ${id}`);
      }
      return {ok:true, result,}
    } catch (error) {
      throw new Error(`Ocurrió un error al eliminar el usuario con el ID ${id}: ${error.message}`);
    }
  }

  async findPaginate({name,lastName, page, limit}: SearchUserDto) {
    try {
      const [users, total] = await this.userRepository.findAndCount({
        relations: {rol: true},
        where: {
          name: Like(`%${name}%`),
          lastName: Like(`%${lastName}%`)
        },
        order: {id:'DESC'},
        skip: (page -1) * limit,
        take: limit,
      });
console.log(users)
      if(users.length > 0){
        let totalPag: number = total / limit;
        if(totalPag % 1 != 0){
          totalPag = Math.trunc(totalPag) + 1;
        }
        let nextPag: number = page >= totalPag ? page : Number(page) + 1;
        let prevPag: number = page <= 1 ? page : page -1;
        return{
          ok:true,
          users,
          total,
          totalPag,
          currentPage: Number(page),
          nextPag,
          prevPag,
          status: HttpStatus.OK,
        };
      }
      
      return {
        ok: false, message: "User not found", status: HttpStatus.NOT_FOUND
      }

    } catch (error) {
      return HttpStatus.INTERNAL_SERVER_ERROR
    }
  }
}
