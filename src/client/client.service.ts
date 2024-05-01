import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import { Like, Repository } from 'typeorm';
import { SearchClientDto } from './dto/search-client.dto';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) { }

  async create({ dui, name, points }: CreateClientDto) {
    try {
      const client = await this.clientRepository.create({
        name: name,
        dui: dui,
        points: points
      });
      if (!client) {
        throw new NotFoundException("No se pudo crear el Client");
      }
      await this.clientRepository.save(client)
      return {
        ok: true,
        client
      }

    } catch (error) {
      throw new NotFoundException("no se pudo crear el Client")
    }
  }

  async findAll( { name, dui, limit, page}: SearchClientDto) {
    try {
      const [clients, total] = await this.clientRepository.findAndCount({
        where: {
          name: Like(`%${name}%`),
          dui: Like(`%${dui}%`),
          isActive: true
        },
        order: { id: 'DESC' },
        skip: (page - 1) * limit,
        take: limit,
      });
      console.log(clients)
      if (clients.length > 0) {
        let totalPag: number = total / limit;
        if (totalPag % 1 != 0) {
          totalPag = Math.trunc(totalPag) + 1;
        }
        let nextPag: number = page >= totalPag ? page : Number(page) + 1;
        let prevPag: number = page <= 1 ? page : page - 1;
        return {
          ok: true,
          clients,
          total,
          totalPag,
          currentPage: Number(page),
          nextPag,
          prevPag,
          status: HttpStatus.OK,
        };
      }
      return {
        ok: false, message: "client not found", status: HttpStatus.NOT_FOUND
      }
    } catch (error) {
      return{
        ok: false,
        message: "Ocurrió un error" + error.message,
        status: HttpStatus.INTERNAL_SERVER_ERROR
      }
    }
  }

  async findOne(id: number) {
    try {
      const client = await this.clientRepository.findOne({ where: { id } })
      if (!client) {
        throw new NotFoundException("No se encontró el Client")
      }
      return {
        ok: true,
        client
      }
    } catch (error) {
      throw new NotFoundException("No se encontró el Client" + error)
    }
  }

  async update(id: number, { dui, name, points }: UpdateClientDto) {
    try {
      const client = await this.clientRepository.findOne({ where: { id } })

      client.dui = dui,
        client.name = name,
        client.points = points

      await this.clientRepository.save(client);
      return {
        ok: true,
        client
      }
    } catch (error) {
      throw new NotFoundException("No se pudo actualizar")
    }
  }

  async remove(id: number) {
   try {
    const client = await this.clientRepository.delete(id);
    if (client.affected === 0) {
      throw new NotFoundException(`No se encontró ningún Cliente con el Id ${id}`)
    }
    return {
      ok: true,
      client
    }
   } catch (error) {
    throw new NotFoundException(`Ocurrió un error al eliminar el cliente con ID ${id}: ${error.message}`);
   }
  }
}
