import request from 'supertest';
import bcrypt from 'bcryptjs';
import { usersDataStore } from '../../src/database/nedb';
import server from "../../server";

const mockUser = { id: '1', username: 'testUser', password: 'testPassword', email: 'testUser@test.com'}

jest.mock('../../src/database/nedb', () => ({
    usersDataStore: {
        insert: jest.fn()
    }
}));

jest.mock('bcryptjs', () => ({
    hashSync: jest.fn()
}));

jest.mock('jsonwebtoken', () => ({
    sign: jest.fn().mockReturnValue('testToken')
}));

process.env.JWT_SECRET = process.env.JWT_SECRET || 'testSecret';

describe('/register', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    afterAll((done) => {
        server.close(done);
    });

    it('Should get status = 200 and register a user', async () => {
        const hashedPassword = 'hashedTestPassword';
        (bcrypt.hashSync as jest.Mock).mockReturnValue(hashedPassword);

        const expectedUser = {
            id: expect.any(Number),
            username: 'testUser',
            email: 'testUser@test.com',
            favorites: [],
            accessToken: 'testToken'
        };

        (usersDataStore.insert as jest.Mock).mockImplementation((user, callback) => {
            const { password, ...userWithoutPassword } = user;
            callback(null, { ...userWithoutPassword, id: Date.now() });
        });

        const response = await request(server)
            .post('/register')
            .send(mockUser);

        expect(response.status).toBe(200);
        expect(response.body).toEqual(expectedUser);
    });

    it('Should get status = 500 for internal server error', async () => {
        (usersDataStore.insert as jest.Mock).mockImplementation((user, callback) => {
            callback(new Error("Internal server error"), null);
        });

        const response = await request(server)
            .post('/register')
            .send(mockUser);

        expect(response.status).toBe(500);
        expect(response.body.message).toBe("Internal server error");
    });
});