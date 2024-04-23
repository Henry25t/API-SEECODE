import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import { Repository } from 'typeorm';

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

  async findAll() {
    try {
      const client = await this.clientRepository.find()
      if (client.length > 0) {
        return {
          ok: true,
          client
        }
      }
      throw new NotFoundException("Ocurrió un error al obtener el usuario")
    } catch (error) {
      throw new NotFoundException("Error en el servidor")
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
