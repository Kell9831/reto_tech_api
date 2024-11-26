import { forwardRef, Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
    imports:[TypeOrmModule.forFeature([Post]), forwardRef(() => UsersModule)],
    providers: [PostsService],
    controllers: [PostsController],
    exports: [PostsService]
})
export class PostsModule {}
