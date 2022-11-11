import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ITask {
  @ApiProperty({ type: Number })
  id: number;

  @ApiProperty({ type: Number })
  userId: number;

  @ApiProperty({ type: String })
  summary: string;

  @ApiPropertyOptional({ type: Date })
  finishedAt?: Date | null;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiPropertyOptional({ type: Date })
  updatedAt?: Date | null;

  @ApiPropertyOptional({ type: Date })
  deletedAt?: Date | null;
}
