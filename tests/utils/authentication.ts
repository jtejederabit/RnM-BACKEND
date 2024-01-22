import jwt from 'jsonwebtoken';

const userPayload = { id: 'testUser', role: 'user' };
const testSecret = process.env.JWT_SECRET || 'testSecret';

export const token = jwt.sign(userPayload, testSecret, { expiresIn: '1h' });

