import request from 'supertest';
import server from '../../server';
import {token} from "../utils/authentication";
import { mockUser } from "../utils/fixtures";
import { usersDataStore } from '../../src/database/nedb';

jest.mock('../../src/database/nedb', () => ({
    usersDataStore: {
        findOne: jest.fn(),
    }
}));

describe('/user-info', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    })
    afterAll((done) => {
        server.close(done);
    })

    it('Should get status = 200 and return user information', async () => {
        (usersDataStore.findOne as jest.Mock).mockImplementation((query, projection ,callback) => {
            callback(null, mockUser);
        });

        const response = await request(server)
            .get('/user-info')
            .set('authorization', token);

        expect(response.status).toBe(200);
        expect(response.body).toStrictEqual(mockUser);
    });
});