export class IUser {
  id: number;
  name: string;
  role: IUserRole;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt?: Date | null;
  deletedAt?: Date | null;
}

export type IUserRole = 'manager' | 'technician';
