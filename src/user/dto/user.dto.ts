import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class IUser {
  @ApiProperty({ type: Number })
  id: number;

  @ApiProperty({ type: String })
  name: string;

  @ApiProperty({ enum: ['manager', 'technician'] })
  role: IUserRole;

  @ApiProperty({ type: String })
  email: string;

  @ApiProperty({ type: String })
  password: string;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiPropertyOptional({ type: Date })
  updatedAt?: Date | null;

  @ApiPropertyOptional({ type: Date })
  deletedAt?: Date | null;
}

export type IUserRole = 'manager' | 'technician';
