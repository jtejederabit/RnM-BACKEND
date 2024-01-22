import request from 'supertest';
import server from '../../server';
import {token} from "../utils/authentication";
import { filtersDataStore } from "../../src/database/nedb";
import { mockFilters } from "../utils/fixtures";

jest.mock("../../src/database/nedb", () => ({
    filtersDataStore: {
        find: jest.fn()
    }
}));

describe('/filters', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterAll((done) => {
        server.close(done);
    });

    it('Should get status = 200 an return filters', async () => {
        (filtersDataStore.find as jest.Mock).mockImplementation((query, callback) => {
            callback(null, mockFilters);
        });

        const response = await request(server)
            .get('/filters')
            .set('authorization', token);

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockFilters);
    });

    it('Should get status = 500 on internal server error', async () => {
        (filtersDataStore.find as jest.Mock).mockImplementation((query, callback) => {
            callback(new Error("Internal server error"), null);
        });

        const response = await request(server)
            .get('/filters')
            .set('authorization', token);

        expect(response.status).toBe(500);
        expect(response.body.message).toBe("Internal server error");
    });
});