import Datastore from 'nedb';
import path from 'path';
interface IUser {
    id: number;
    username: string;
    password: string;
    email: string;
    favorites: number[];
}

interface IFilters {
    type: string;
    content: {
        value: string;
        label: string;
    }[];
}

const usersDataStore = new Datastore({
    filename: path.join(__dirname, './users.db'),
    autoload: true
});

const filtersDataStore = new Datastore({
    filename: path.join(__dirname, './filters.db'),
    autoload: true
});

export { usersDataStore, filtersDataStore, IUser, IFilters };
