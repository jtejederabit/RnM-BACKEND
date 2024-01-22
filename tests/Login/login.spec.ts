import request from 'supertest';
import bcrypt from 'bcryptjs';
import { usersDataStore } from '../../src/database/nedb';
import server from "../../server";

const mockUser = { id: '1', username: 'testUser', password: 'testPassword', email: 'testUser@test.com'}

jest.mock('../../src/database/nedb', () => ({
    usersDataStore: {
        findOne: jest.fn()
    }
}));

jest.mock('bcryptjs', () => ({
    compareSync: jest.fn()
}));

jest.mock('jsonwebtoken', () => ({
    sign: jest.fn().mockReturnValue('testToken')
}));

process.env.JWT_SECRET = process.env.JWT_SECRET || 'testSecret';

describe('/login', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    })
    afterAll((done) => {
        server.close(done);
    })

    it('Should get status = 200 and authenticate user', async () => {
        (usersDataStore.findOne as jest.Mock).mockImplementation((query, callback) => {
            callback(null, mockUser);
        });

        (bcrypt.compareSync as jest.Mock).mockReturnValue(true);

        const response = await request(server)
            .post('/login')
            .send({ username: 'testUser', password: 'testPassword' });

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            id: '1',
            username: 'testUser',
            email: 'testUser@test.com',
            accessToken: 'testToken'
        });
    });

    it('Should get status = 401 for invalid username', async () => {
        (usersDataStore.findOne as jest.Mock).mockImplementation((query, callback) => {
            callback(null, null);
        });

        const response = await request(server)
            .post('/login')
            .send({ username: 'fakeUser', password: 'testPassword' });

        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Authentication failed');
    });

    it('Should get status = 401 for invalid password', async () => {
        (usersDataStore.findOne as jest.Mock).mockImplementation((query, callback) => {
            callback(null, mockUser);
        });

        (bcrypt.compareSync as jest.Mock).mockReturnValue(false);

        const response = await request(server)
            .post('/login')
            .send({ username: 'testUser', password: 'fakePassword' });

        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Invalid Password!');
    });
});
