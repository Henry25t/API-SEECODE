import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, SaveUsers } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { get } from 'http';
import { SearchUserDto } from './dto/search-user.dto';
import { jwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateAddressDto } from 'src/addresses/dto/create-address.dto';

@UseGuards(jwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body()createUserDto: SaveUsers) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get('/paginate')
  findPaginate(@Query() searchUsersDto: SearchUserDto){
    return this.usersService.findPaginate(searchUsersDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
