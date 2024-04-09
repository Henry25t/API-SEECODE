import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateRolDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Repository } from 'typeorm';
import { raw } from 'express';

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

   async findAll() {
    try {
      const rol = await this.roleRepository.find({where: {isActive : true}});
      return{ok: true, rol}
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
      const result = await this.roleRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException(`No se encontró ningún rol con el ID ${id}`);
      }
      return {ok:true, result}
    } catch (error) {
      throw new InternalServerErrorException(`Ocurrió un error al eliminar el rol con el ID ${id}: ${error.message}`);
    }
  }
}
