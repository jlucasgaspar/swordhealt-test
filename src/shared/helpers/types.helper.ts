import { ApiProperty } from '@nestjs/swagger';

export class ErrorSwagger {
  @ApiProperty({ type: String })
  message: string;

  @ApiProperty({ type: Number })
  statusCode: number;
}

export type WithoutTimestampsAndId<T> = Omit<
  T,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
>;
