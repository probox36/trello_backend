import * as bcrypt from 'bcrypt';

export class Encrypter {
  private static readonly COST_FACTOR = 10;

  static async hash(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(Encrypter.COST_FACTOR);
    return bcrypt.hash(password, salt);
  }

  static async comparePassword(
    password: string,
    hash: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
