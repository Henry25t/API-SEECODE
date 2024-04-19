import { HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { SaveUsers } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Like, Repository } from 'typeorm';
import { Role } from 'src/roles/entities/role.entity';
import { SearchUserDto } from './dto/search-user.dto';
import { Address } from 'src/addresses/entities/address.entity';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
  ) { }
  async create({ complement, email, department, lastName, municipality, name, password, rolId }: SaveUsers) {
    try {
      const direction = new Address()
      direction.complement = complement,
      direction.department = department,
      direction.municipality = municipality

      const dataDirection = await this.addressRepository.save(direction)

      const rol = await this.roleRepository.findOne({ where: { id: rolId } });
      
      const newUser = this.userRepository.create({
        name: name,
        lastName: lastName,
        email: email, password: password,
        address: dataDirection,
        rol: rol, 
      });
      newUser.hashPassword()

      await this.userRepository.save(newUser);
     
      return {
        ok: true,
        newUser
      };
      
    } catch (error) {
      throw new InternalServerErrorException('Ocurrió un error al crear el usuario.' + error);
    }
  }


  async findAll() {
    try {
      const user = await this.userRepository.find({ relations: ['rol', 'address'] });
      if (user.length > 0) {
        for (const users of user) { users.password = undefined }
        return {
          ok: true,
          user
        }
      }
      throw new InternalServerErrorException('Ocurrió un error al obtener los usuarios.');
    } catch (error) {
      throw new InternalServerErrorException('Ocurrió un error al obtener los usuarios.' + error);
    }
  }


  async findOne(id: number) {
    try {
      const user = await this.userRepository.findOne({ where: { id }, relations: ['rol'] })
      if (!user) {
        throw new NotFoundException(`No se encontró ningún rol con el ID ${id}`);
      }

      const User = {
        id: user.id,
        name: user.name,
        lastName: user.lastName,
        email: user.email,
        isActive: user.isActive,
        rol: user.rol ? user.rol.name : null,
      }

      return { ok: true, User }
    } catch (error) {
      return { ok: false, error }
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.userRepository.findOne({ where: { id } })
      const rol = await this.roleRepository.findOne({ where: { id: updateUserDto.rolId } })


      user.name = updateUserDto.name
      user.lastName = updateUserDto.lastName
      user.email = updateUserDto.email,
        user.password = updateUserDto.password,
        user.rol = rol


      await this.userRepository.save(user)
      return { ok: true, user }
    } catch (error) {
      return { ok: false, error: "Ocurrio un error" }
    }
  }

  async remove(id: number) {
    try {
      const result = await this.userRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException(`No se encontró ningún usuario con el ID ${id}`);
      }
      return { ok: true, result, }
    } catch (error) {
      throw new Error(`Ocurrió un error al eliminar el usuario con el ID ${id}: ${error.message}`);
    }
  }

  async findPaginate({ name, lastName, page, limit }: SearchUserDto) {
    try {
      const [users, total] = await this.userRepository.findAndCount({
        relations: { rol: true },
        where: {
          name: Like(`%${name}%`),
          lastName: Like(`%${lastName}%`)
        },
        order: { id: 'DESC' },
        skip: (page - 1) * limit,
        take: limit,
      });
      console.log(users)
      if (users.length > 0) {
        let totalPag: number = total / limit;
        if (totalPag % 1 != 0) {
          totalPag = Math.trunc(totalPag) + 1;
        }
        let nextPag: number = page >= totalPag ? page : Number(page) + 1;
        let prevPag: number = page <= 1 ? page : page - 1;
        return {
          ok: true,
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
