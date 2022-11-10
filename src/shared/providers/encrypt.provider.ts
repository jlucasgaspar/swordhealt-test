import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EncryptProvider {
  private salt = 10;

  async hash(stringParam: string) {
    return await bcrypt.hash(stringParam, this.salt);
  }

  async compare(params: { encryptedString: string; regularString: string }) {
    return await bcrypt.compare(params.regularString, params.encryptedString);
  }
}
