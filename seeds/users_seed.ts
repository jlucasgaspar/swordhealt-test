import { Knex } from 'knex';
import { IUser } from '@/user/dto/user.dto';

export async function seed(knex: Knex): Promise<void> {
  await knex<IUser>('users').insert([
    {
      email: 'master@swordhealth.com',
      password: 'swordhealth_password',
      name: 'SwordHealth Manager',
      role: 'manager',
    },
  ]);
}
