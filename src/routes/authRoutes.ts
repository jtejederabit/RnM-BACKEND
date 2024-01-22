import { Router } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { usersDataStore, IUser } from '../database/nedb';

const router: Router = Router();

router.post('/login', async (req, res) => {
    const { username, password: loginPassword } = req.body;

    usersDataStore.findOne({ username: username }, (err: Error | null, user: IUser) => {
        if (err) {
            return res.status(500).json({ message: "Internal server error" });
        }
        if (!user) {
            return res.status(401).json({ message: "Authentication failed" });
        }

        const passwordIsValid: boolean = bcrypt.compareSync(loginPassword, user.password);

        if (!passwordIsValid) {
            return res.status(401).json({
                accessToken: null,
                message: "Invalid Password!"
            });
        }

        const token: string = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, {
            expiresIn: '24h'
        });

        const { password, ...userWithoutPassword } = user;

        res.status(200).json({
            ...userWithoutPassword,
            accessToken: token
        });
    });
});

router.post('/register', async (req, res) => {
    const { username, password: registerPassword, email } = req.body;

    const hashedPassword: string = bcrypt.hashSync(registerPassword, 8);

    const user: IUser = {
        id: Date.now(),
        username: username,
        password: hashedPassword,
        email: email,
        favorites: []
    };

    usersDataStore.insert(user, (err: Error | null, user: IUser) => {
        if (err) {
            return res.status(500).json({ message: "Internal server error" });
        }

        const token: string = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, {
            expiresIn: '24h'
        });

        const { password, ...userWithoutPassword } = user;

        res.status(200).json({
            ...userWithoutPassword,
            accessToken: token
        });
    });
});

export default router;
