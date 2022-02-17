import { Body, Controller, Delete, Get, HttpException, Param, Post } from '@nestjs/common';
import { JwtBody } from 'server/decorators/jwt_body.decorator';
import { JwtBodyDto } from 'server/dto/jwt_body.dto';
import { Task } from 'server/entities/task.entity';
import { TasksService } from 'server/providers/services/tasks.service';

class TaskPostBody {
  parentProject: number;
  completionStatus: boolean;
  title: string;
  description: string;
  timeEstimate: number;
}

@Controller()
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get('/tasks')
  public async index(@JwtBody() jwtBody: JwtBodyDto) {
    const tasks = await this.tasksService.findAllForUser(jwtBody.userId);
    return { tasks };
  }

  @Post('/tasks')
  public async create(@JwtBody() jwtBody: JwtBodyDto, @Body() body: TaskPostBody) {
    let task = new Task();
    task.userId = jwtBody.userId;
    task.parentProject = body.parentProject;
    task.completionStatus = body.completionStatus;
    task.title = body.title;
    task.description = body.description;
    task.timeEstimate = body.timeEstimate;
    task = await this.tasksService.createTask(task);
    return { task };
  }

  @Get('/tasks/:id')
  public async idIndex(@Param('id') id: string, @JwtBody() jwtBody: JwtBodyDto) {
    const task = await this.tasksService.findTaskById(parseInt(id, 10), jwtBody.userId);
    return { task };
  }
}