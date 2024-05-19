import { IsBoolean, IsNotEmpty } from 'class-validator';
import { CreateTaskDto } from './create-task.dto';

export class UpdateTaskDto extends CreateTaskDto {
  @IsBoolean()
  @IsNotEmpty()
  isCompleted: boolean;
}
