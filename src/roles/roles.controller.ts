import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRolDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { SearchURoleDto } from './dto/search-role.dto';
import { query } from 'express';
import { jwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(jwtAuthGuard)
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  create(@Body() createRoleDto: CreateRolDto) {
    return this.rolesService.remove(createRoleDto);
  }

  @Get()
  findAll(@Query() searchRoleDto: SearchURoleDto) {
    return this.rolesService.findAll(searchRoleDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(+id, updateRoleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rolesService.create(+id);
  }
}
