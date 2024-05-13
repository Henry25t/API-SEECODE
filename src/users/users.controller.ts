import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { SaveUsers } from './dto/create-user.dto';
import { SearchUserDto } from './dto/search-user.dto';
import { jwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(jwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body()saveUsers: SaveUsers) {
    return this.usersService.create(saveUsers);
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
  update(@Param('id') id: string, @Body() saveUsers: SaveUsers) {
    return this.usersService.update(+id, saveUsers);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
