import { Injectable , HttpException, HttpStatus} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm'
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateProfileDto } from './dto/create-profile.dto';
import { Profile } from './profile.entity';


@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(Profile) private profileRepository: Repository<Profile>
    ) { }

    private async validateUserExists(id: number): Promise<User> {
        const userFound = await this.userRepository.findOne({ where: { id } });
        if (!userFound) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
        return userFound;
    }

    async createUser(user: CreateUserDto) {
        const userFound = await this.userRepository.findOne({
            where:{
                username: user.username
            }
        })

        if(userFound){
            throw new HttpException('User already exist' ,HttpStatus.CONFLICT)
        }

        const newUser = this.userRepository.create(user)
        return this.userRepository.save(newUser)
    }

    getUsers() {
        return this.userRepository.find()
    }

    async getUser(id: number) {
        return this.validateUserExists(id);
    }

    async getUserByUsername(username: string): Promise<User> {
        return this.userRepository.findOne({ where: { username } });
      }
      

    async deleteUser(id: number) {
        await this.validateUserExists(id); 
        const result = await this.userRepository.delete({ id });
        if (result.affected === 0) {
            throw new HttpException('User could not be deleted', HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return { message: 'User deleted successfully' };
    }

    async updateUser(id: number, user: UpdateUserDto){
        await this.validateUserExists(id); 
        await this.userRepository.update({ id }, user);
        return this.userRepository.findOne({ where: { id } });
    }

    async createProfile(id: number, profile:CreateProfileDto) {
        const userFound = await this.userRepository.findOne({
            where: {
                id
            }
        })

        if(!userFound){
            throw new HttpException('user no found', HttpStatus.NOT_FOUND)
        }

        const newProfile = this.profileRepository.create(profile)
        const saveProfile = await this.profileRepository.save(newProfile)

        userFound.profile = saveProfile

        return this.userRepository.save(userFound)
    }

    async updateProfile(id: number, profileData: CreateProfileDto) {
        const profile = await this.profileRepository.findOne({ where: { id } });
    
        if (!profile) {
            throw new HttpException('Profile not found', HttpStatus.NOT_FOUND);
        }
    
        await this.profileRepository.update({ id }, profileData);
        return this.profileRepository.findOne({ where: { id } });
    }
    
}

