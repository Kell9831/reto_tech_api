import { Body, Controller, Get, Post, Param, ParseIntPipe, Delete, Patch, HttpException, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateProfileDto } from './dto/create-profile.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { OwnerGuard } from 'src/auth/guards/owner.guard';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {

    constructor(private usersService: UsersService) { }

    @Get()
    getUsers() {
        return this.usersService.getUsers()
    }

    @Get(':id')
    getUser(@Param('id', ParseIntPipe) id: number): Promise<User> | Promise<HttpException>{
        console.log("este es el id " + id)
        return this.usersService.getUser(id)
    }

    @Get(':username')
    async getUserByUsername(@Param('username') username: string) {
    const user = await this.usersService.getUserByUsername(username);
    if (!user) {
      return { message: 'User not found' };
    }
    return user;
  }


    @Post()
    createUser(@Body() newUser: CreateUserDto) {
        return this.usersService.createUser(newUser)
    }

    @UseGuards(OwnerGuard)
    @Delete(':id')
    deleteUser(@Param('id', ParseIntPipe) id: number) {
        return this.usersService.deleteUser(id)
    }

    @UseGuards(OwnerGuard)
    @Patch(':id')
    updateUser(@Param('id', ParseIntPipe) id:number, @Body() user: UpdateUserDto ){
        return this.usersService.updateUser(id, user)
    }

    @Post(':id/profile')
    createProfile(
        @Param('id' , ParseIntPipe) id:number,
        @Body() profile:CreateProfileDto
    ){
        return this.usersService.createProfile(id, profile)
    }


}


