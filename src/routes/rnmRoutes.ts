import { Router } from 'express';
import {rnmService} from "../utils/axiosInstance";
import {filtersDataStore, IFilters} from "../database/nedb";

const router: Router = Router();
interface IParams {
    page?: string;
    status?: string;
    specie?: string;
    type?: string;
    name?: string;
}

interface ICharacter {
    id: number;
    name: string;
    status: string;
    species: string;
    type: string;
    gender: string;
    origin: {
        name: string;
        url: string;
    };
    location: {
        name: string;
        url: string;
    };
    image: string;
    episode: [];
    url: string;
    created: string;
}

interface IResponse {
    info: {
        count: number;
        pages: number;
        next: string;
        prev: string;
    };
    results: ICharacter[];
}

router.get('/characters', async (req, res) => {
    try {
        const {
            page,
            status,
            specie,
            type,
            name,
        } = req.query as IParams;

        const data: IResponse = await rnmService<any>({
            url: `/character/?page=${page || 1}&status=${status || ''}&species=${specie || ''}&type=${type || ''}&name=${name || ''}`,
            method: 'GET',
        });

        res.status(200).json(data);
    } catch (error: Error | any) {
        if(error.response.status === 404){
            if(error.response.data.error === "There is nothing here"){
                return res.status(200).json({ message: "There is nothing here", results: [] });
            }
        }
        res.status(error.response.status).json({ message: "Internal server error" });
    }
});

router.get('/filters', async (req, res) => {
    try {
        filtersDataStore.find({}, (err: Error | null, data: IFilters) => {
            if (err) {
                return res.status(500).json({ message: "Internal server error" });
            }
            res.status(200).json(data);
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
});
export default router;
