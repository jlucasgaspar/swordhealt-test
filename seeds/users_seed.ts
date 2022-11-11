import { Knex } from 'knex';
import { IUser } from '@/user/dto/user.dto';
import { EncryptProvider } from '../src/shared/providers/encrypt.provider';

export async function seed(knex: Knex): Promise<void> {
  const encryptProvider = new EncryptProvider();

  const password = await encryptProvider.hash('123456');

  await knex<IUser>('users').insert({
    email: 'manager@swordhealth.com',
    password,
    name: 'SwordHealth Manager',
    role: 'manager',
  });

  await knex<IUser>('users').insert({
    email: 'technician.1@swordhealth.com',
    password,
    name: 'Technician One',
    role: 'technician',
  });

  await knex<IUser>('users').insert({
    email: 'technician.2@swordhealth.com',
    password,
    name: 'Technician Two',
    role: 'technician',
  });

  await knex<IUser>('users').insert({
    email: 'technician.3@swordhealth.com',
    password,
    name: 'Technician Three',
    role: 'technician',
  });
}
