import { HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateRolDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Like, Repository } from 'typeorm';
import { raw } from 'express';
import { SearchUserDto } from 'src/users/dto/search-user.dto';
import { SearchURoleDto } from './dto/search-role.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) { }
  async create(createRoleDto: CreateRolDto) {
    try {
      const rol = this.roleRepository.create(createRoleDto)
      if(!rol){
        throw new NotFoundException(`No se pudo cear ningun rol`);
      }
      await this.roleRepository.save(rol)
      return{ok:true, rol}
    } catch (error) {
      throw new NotFoundException('No se pudo crear el rol')
    }
  }

   async findAll( { name, limit, page}: SearchURoleDto) {
    try {
      const [roles, total] = await this.roleRepository.findAndCount({
        where: {
          name: Like(`%${name}%`),
          isActive: true
        },
        order: { id: 'DESC' },
        skip: (page - 1) * limit,
        take: limit,
      });
      console.log(roles)
      if (roles.length > 0) {
        let totalPag: number = total / limit;
        if (totalPag % 1 != 0) {
          totalPag = Math.trunc(totalPag) + 1;
        }
        let nextPag: number = page >= totalPag ? page : Number(page) + 1;
        let prevPag: number = page <= 1 ? page : page - 1;
        return {
          ok: true,
          roles,
          total,
          totalPag,
          currentPage: Number(page),
          nextPag,
          prevPag,
          status: HttpStatus.OK,
        };
      }
      return {
        ok: false, message: "Roles not found", status: HttpStatus.NOT_FOUND
      }
    } catch (error) {
      throw new InternalServerErrorException('Ocurrió un error al obtener los roles.', error);
    }
  }

  async findOne(id: number) {
    try {
      const role = await this.roleRepository.findOne({where:{id}})
      if (!role) {
        throw new NotFoundException(`No se encontró ningún rol con el ID ${id}`);
      }
      return {ok: true, role}
    } catch (error) {
      return {ok:false, error}
    }
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    try {
      const role = await this.roleRepository.findOne({ where: { id } })
      role.name = updateRoleDto.name
   
      await this.roleRepository.save(role)
      return{ ok: true, role}
     } catch (error) {
      return{ok: false, error: "Ocurrio un error"}
     }
  }

  async remove(id: number) {
    try {
      const rol = await this.roleRepository.findOne({where: {id}})
      if(!rol){
        throw new NotFoundException(`No existe ningún registro con el id ${id}`)
      }
      rol.isActive = false
      const rolDelete = await this.roleRepository.save(rol)
      /*const result = await this.roleRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException(`No se encontró ningún rol con el ID ${id}`);
      }*/
      return {ok:true, result: rolDelete}
    } catch (error) {
      throw new InternalServerErrorException(`Ocurrió un error, ${error.message}`);
    }
  }
}
