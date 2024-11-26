import { Body, Controller, Delete, Get, Param, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { PostsService } from './posts.service';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';


@UseGuards(JwtAuthGuard)
@Controller('posts')
export class PostsController {

    constructor (
        private postsService: PostsService
    ){}

    @Post()
    createPost(@Body() post: CreatePostDto, @Request() req) {
    const userId = req.user.id; 
    return this.postsService.createPost(post, userId);
  }

    @Get()
    getPosts(){
        return this.postsService.getPosts()
    }

    @Get('me')
    getMyPosts(@Request() req) {
    const userId = req.user.id;
    return this.postsService.getPostsByUser(userId);
    }


    @Get(':id')
    getPost(@Param('id') id: number) {
      return this.postsService.getPost(Number(id));
    }
  
    @Patch(':id')
    updatePost(@Param('id') id: number, @Body() post: UpdatePostDto) {
      return this.postsService.updatePost(Number(id), post);
    }

    @Delete(':id')
    deletePost(@Param('id') id: number) {
    return this.postsService.deletePost(Number(id));
  }
  
}
