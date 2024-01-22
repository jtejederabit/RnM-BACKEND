import request from 'supertest';
import server from '../../server';
import {token} from "../utils/authentication";
import { mockUser } from "../utils/fixtures";
import { usersDataStore } from '../../src/database/nedb';

jest.mock('../../src/database/nedb', () => ({
    usersDataStore: {
        findOne: jest.fn(),
        update: jest.fn()
    }
}));
describe('/manage-favorites', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterAll((done) => {
        server.close(done);
    });

    it('Should get status = 500 on user find', async () => {
        (usersDataStore.findOne as jest.Mock).mockImplementation((query, callback) => {
            callback(new Error("Internal server error"), null);
        });

        const response = await request(server)
            .post('/manage-favorites')
            .set('authorization', token)
            .send({ user: { id: mockUser._id }, characterId: 5 });

        expect(response.status).toBe(500);
        expect(response.body.message).toBe("Internal server error");
    });

    it('Should get status = 401 if user not found', async () => {
        (usersDataStore.findOne as jest.Mock).mockImplementation((query, callback) => {
            callback(null, null);
        });

        const response = await request(server)
            .post('/manage-favorites')
            .set('authorization', token)
            .send({ user: { id: mockUser._id }, characterId: 5 });

        expect(response.status).toBe(401);
        expect(response.body.message).toBe("No user was found");
    });

    it('Should get status = 200 and add favorite to user array ', async () => {
        (usersDataStore.findOne as jest.Mock).mockImplementation((query, callback) => {
            callback(null, mockUser);
        });
        (usersDataStore.update as jest.Mock).mockImplementation((query, updateQuery, options, callback) => {
            callback(null, 1);
        });

        const response = await request(server)
            .post('/manage-favorites')
            .set('authorization', token)
            .send({ user: { id: mockUser._id }, characterId: 5 });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Favorites updated successfully");
    });

    it('Should get status = 200 and remove favorite from user array', async () => {
        const mockUserWithChar2 = { ...mockUser, favorites: [5, 18] };
        (usersDataStore.findOne as jest.Mock).mockImplementation((query, callback) => {
            callback(null, mockUserWithChar2);
        });
        (usersDataStore.update as jest.Mock).mockImplementation((query, updateQuery, options, callback) => {
            callback(null, 1);
        });

        const response = await request(server)
            .post('/manage-favorites')
            .set('authorization', token)
            .send({ user: { id: mockUserWithChar2._id }, characterId: 5 });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Favorites updated successfully");
    });

    it('Should get status = 500 on update', async () => {
        (usersDataStore.findOne as jest.Mock).mockImplementation((query, callback) => {
            callback(null, mockUser);
        });
        (usersDataStore.update as jest.Mock).mockImplementation((query, updateQuery, options, callback) => {
            callback(new Error("Internal server error"), null);
        });

        const response = await request(server)
            .post('/manage-favorites')
            .set('authorization', token)
            .send({ user: { id: mockUser._id }, characterId: 5 });

        expect(response.status).toBe(500);
        expect(response.body.message).toBe("Internal server error");
    });
});
