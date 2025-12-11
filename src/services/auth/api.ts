import express from 'express';
import { validateSchema, UserConfig } from '../../utils/validator';
import { hashPassword } from './action';
import { UserModel } from '../../db/schema/user';
import { SuccessMessage } from '../../utils/enum-types';

const AuthRouter = express.Router();

AuthRouter.post('/create', async (req, res) => {
    try {
        const validation = validateSchema(req.body, UserConfig);
        if ('error' in validation) return res.status(400).send(validation);

        if ('data' in validation) {

            let userData: typeof UserConfig.type | undefined = validation.data;
            userData!.passwordHash = await hashPassword(userData!.passwordHash);

            await UserModel.create(userData)
            
            return res.status(200).send({ success: SuccessMessage.LINK_ADDED });
        }
    } catch(err) {

        console.error(err);
        let message = err instanceof Error ? err.message : 'unexpected error'

        return res.status(500).send({ error: message });
    }
})

AuthRouter.post('/login', async (req, res) => {});

AuthRouter.post('/verify-token', async (req, res, next) => {})

AuthRouter.post('/refresh-token', async (req, res) => {})

AuthRouter.post('/logout', async (req, res) => {})


export default AuthRouter;