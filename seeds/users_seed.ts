import { Knex } from 'knex';
import { IUser } from '@/user/dto/user.dto';
import { EncryptProvider } from '../src/shared/providers/encrypt.provider';

export async function seed(knex: Knex): Promise<void> {
  const encryptProvider = new EncryptProvider();

  const password = await encryptProvider.hash('swordhealth_password');

  await knex<IUser>('users').insert([
    {
      email: 'master@swordhealth.com',
      password,
      name: 'SwordHealth Manager',
      role: 'manager',
    },
  ]);
}
