import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { Post } from './post.entity';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private postsRepository: Repository<Post>,
    private usersService: UsersService
  ) {}

  async createPost(post: CreatePostDto, userId: number) {
    const userFound = await this.usersService.getUser(userId);

    if (!userFound) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const newPost = this.postsRepository.create({
      ...post,
      author: userFound, 
    });

    return this.postsRepository.save(newPost);
  }

  getPosts() {
    return this.postsRepository.find({
      relations: ['author'],
    });
  }

  async getPost(id: number) {
    const post = await this.postsRepository.findOne({
      where: { id },
      relations: ['author'],
    });

    if (!post) {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }

    return post;
  }

  async updatePost(id: number, post: UpdatePostDto) {
    const postToUpdate = await this.getPost(id);

    Object.assign(postToUpdate, post);

    return this.postsRepository.save(postToUpdate);
  }

  async deletePost(id: number) {
    const postToDelete = await this.getPost(id);

    const result = await this.postsRepository.delete(postToDelete.id);

    if (result.affected === 0) {
      throw new HttpException(
        'Post could not be deleted',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return { message: 'Post deleted successfully' };
  }
}
