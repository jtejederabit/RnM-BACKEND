import { Router } from 'express';
import { usersDataStore, IUser } from '../database/nedb';

const router: Router = Router();

router.get('/user-info', async (req, res) => {
    const { user } = req.body;
    usersDataStore.findOne({ id: user.id },{password: -1}, (err: Error | null, user: IUser) => {
        if (err) {
            return res.status(500).json({ message: "Internal server error" });
        }
        if (!user) {
            return res.status(401).json({ message: "No user was found" });
        }

        res.status(200).json({
            ...user,
        });
    });
});

router.post('/manage-favorites', async (req, res) => {
    const { user, characterId } = req.body;

    usersDataStore.findOne({ id: user.id }, (err: Error | null, user: IUser) => {
        if (err) {
            return res.status(500).json({ message: "Internal server error" });
        }
        if (!user) {
            return res.status(401).json({ message: "No user was found" });
        }

        const favorites = user.favorites;
        const index = favorites.indexOf(characterId);

        if (index > -1) {
            favorites.splice(index, 1);
        } else {
            favorites.push(characterId);
        }

        usersDataStore.update({ id: user.id }, { $set: { favorites: favorites } }, {}, (err: Error | null, numReplaced: number) => {
            if (err) {
                return res.status(500).json({ message: "Internal server error" });
            }
            res.status(200).json({ message: "Favorites updated successfully" });
        });
    });
});

export default router;
