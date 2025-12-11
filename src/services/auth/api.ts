import express from 'express';


const AuthRouter = express.Router();

AuthRouter.post('/create', async (req, res) => {})

AuthRouter.post('/login', async (req, res) => {});

AuthRouter.post('/verify-token', async (req, res, next) => {})

AuthRouter.post('/refresh-token', async (req, res) => {})

AuthRouter.post('/logout', async (req, res) => {})


export default AuthRouter;