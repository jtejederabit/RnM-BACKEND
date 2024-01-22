import request from 'supertest';
import server from '../../server';
import { rnmService } from "../../src/utils/axiosInstance";
import {token} from "../utils/authentication";
import {mockCharacters} from "../utils/fixtures";

jest.mock("../../src/utils/axiosInstance");

describe('/characters', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterAll((done) => {
        server.close(done);
    });

    it('Should get status = 200 and return characters', async () => {
        (rnmService as jest.Mock).mockResolvedValue(mockCharacters);

        const response = await request(server)
            .get('/characters')
            .set('authorization', token)
            .query({ page: '1', status: 'alive' });

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockCharacters);
    });

    it('Should get status = 404 not found from rnm service', async () => {
        (rnmService as jest.Mock).mockRejectedValue({
            response: {
                status: 404,
                data: { error: "There is nothing here" }
            }
        });

        const response = await request(server)
            .get('/characters')
            .set('authorization', token);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ message: "There is nothing here", results: [] });
    });
});
