import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { Address } from './entities/address.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { last } from 'rxjs';
import { Role } from 'src/roles/entities/role.entity';

@Injectable()
export class AddressesService {
  roleRepository: any;
  constructor(
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
  ) { }

  async create(createUserDto: CreateUserDto,createAddressDto: CreateAddressDto,) {
    /*const rol = await this.roleRepository.findOne({ where: { id: createUserDto.rolId } });
  
    const user = new User();
    Object.assign(user, {
      name: createUserDto.name,
      lastName: createUserDto.lastName,
      email: createUserDto.email,
      password: createUserDto.password,
      rol: rol
    });
    const address = new Address();
    Object.assign(user, createAddressDto);

    user.address = address;
    const saveUser = await this.userRepository.save(user);

    if(saveUser)
      {
        address.user = saveUser;
        await this.addressRepository.save(address);
      }

      return{
        ok: true,
        saveUser
      }*/
  }

  async findAll() {
    try {
      const addresses = await this.addressRepository.find({relations: ['user']});
      const includeUser = addresses.map(address => ({
        id: address.id,
        department: address.department,
        municipality: address.municipality,
        complement: address.complement,
        isActive: address.isActive,
        user: {
          name: address.user.name,
          lastName: address.user.lastName,
          email: address.user.email,
        }
      }));

      return {
        ok: true,
        addresses: includeUser
      }
    } catch (error) {
      throw new InternalServerErrorException('Ocurrió un error al obtener los roles.' + error);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} address`;
  }

  update(id: number, updateAddressDto: UpdateAddressDto) {
    return `This action updates a #${id} address`;
  }

  remove(id: number) {
    return `This action removes a #${id} address`;
  }
}
