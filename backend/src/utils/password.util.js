import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

export class PasswordUtil {
  static async hash(password) {
    return await bcrypt.hash(password, SALT_ROUNDS);
  }

  static async verify(password, hash) {
    return await bcrypt.compare(password, hash);
  }

  static validate(password) {
    // Minimum 8 characters, at least one letter and one number
    const minLength = password.length >= 8;
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    
    return minLength && hasLetter && hasNumber;
  }
}