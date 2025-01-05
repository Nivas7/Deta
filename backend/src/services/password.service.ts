import bcrypt from "bcryptjs";

export class Password {
  static async genPasswordHash(password: string) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  static async validatePassword(password: string, hash: string) {
    return bcrypt.compare(password, hash);
  }
}
