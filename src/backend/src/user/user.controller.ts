import { Controller, Get, Post, Body, Param, Delete, Patch, Put} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './shema/user.shema';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';


@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Obtener todos los usuarios
  @Get('getUsers')
  async getAllUsers(): Promise<User[]> {
    return this.userService.findAll();
  }

  // Obtener un usuario por ID
  @Get('users/:id')  // Corregido: se debe usar `:id`
  async getUserById(@Param('id') id: string): Promise<User> {
    return this.userService.findOneById(id);
  }

  
  // Crear un nuevo usuario
  @Post('postUsers')
  async createUser(@Body() userData: CreateUserDto): Promise<User> {
    return this.userService.create(userData);
  }
  
  
  // Actualizar un usuario
  @Put('updateUsers/:id')  // Corregido: agregar `:id` para actualizar un usuario específico
  async updateUser(@Param('id') id: string, @Body() updateData: UpdateUserDto): Promise<User> {
    const{user_name,name,lastname,email}=updateData
    return this.userService.update(id, user_name,name,lastname,email);
  }

  // Eliminar un usuario
  @Delete('deleteUsers/:id')  // Corregido: agregar `:id` para eliminar un usuario específico
  async deleteUser(@Param('id') id: string): Promise<{ message: string }> {
    await this.userService.delete(id);
    return { message: 'User deleted successfully' };
  }
}
