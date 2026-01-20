import { User } from '../models/User.model.js';
import { PasswordUtil } from '../utils/password.util.js';

export class UserService {
  static async createUser(email, username, password) {
    // Validate password
    if (!PasswordUtil.validate(password)) {
      throw new Error('Password must be at least 8 characters with letters and numbers');
    }

    // Check if user exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });
    
    if (existingUser) {
      if (existingUser.email === email) {
        throw new Error('Email already exists');
      }
      throw new Error('Username already exists');
    }

    // Hash password
    const passwordHash = await PasswordUtil.hash(password);

    // Create user
    const user = new User({
      email,
      username,
      passwordHash
    });

    await user.save();
    return user;
  }

  static async findByEmail(email) {
    return await User.findOne({ email });
  }

  static async findById(userId) {
    return await User.findById(userId);
  }

  static async verifyPassword(user, password) {
    return await PasswordUtil.verify(password, user.passwordHash);
  }

  static async updateUser(userId, updates) {
    const user = await User.findByIdAndUpdate(
      userId,
      { ...updates, updatedAt: Date.now() },
      { new: true }
    );
    return user;
  }

  static async deleteUser(userId) {
    await User.findByIdAndDelete(userId);
  }
}