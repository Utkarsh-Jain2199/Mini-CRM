import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { getUserByEmail, addUser } from './database.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

export const verifyPassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

export const generateToken = (user) => {
  return jwt.sign(
    { 
      userId: user.id, 
      email: user.email, 
      role: user.role 
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

export const authenticateUser = async (email, password, role) => {
  const user = getUserByEmail(email);
  if (!user) {
    return null;
  }

  if (user.role !== role) {
    return null;
  }

  const isValid = await verifyPassword(password, user.password);
  if (!isValid) {
    return null;
  }

  return user;
};

export const registerUser = async (userData) => {
  const existingUser = getUserByEmail(userData.email);
  if (existingUser) {
    throw new Error('User already exists');
  }

  const hashedPassword = await hashPassword(userData.password);
  const newUser = addUser({
    ...userData,
    password: hashedPassword
  });

  return newUser;
};
