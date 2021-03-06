import { Router, Request, Response, NextFunction } from 'express';
import { IUserInputDTO } from '../../interfaces/IUser';
import middlewares from '../middlewares';
import { celebrate, Joi } from 'celebrate';
import Logger from '../../loaders/logger';
const route = Router();
const authLogic = new middlewares.authLogic();

export default (app: Router) => {
    app.use('/auth', route);

    route.post(
        '/signup',
        celebrate({
            body: Joi.object({
                name: Joi.string().required(),
                email: Joi.string().required(),
                password: Joi.string().required()
            })
        }),
        async (req: Request, res: Response, next: NextFunction) => {
            Logger.debug('Calling Sign-Up endpoint with body: %o', req.body);
            try {
                const { user, token } = await authLogic.userSignUp(req.body as IUserInputDTO);
                return res.json({ user, token }).status(201);
            } catch (e) {
                Logger.error('error: %o', e);
                return next(e);
            }
        }
    );

    route.post(
        '/signin',
        celebrate({
            body: Joi.object({
                email: Joi.string().required(),
                password: Joi.string().required()
            })
        }),
        async (req: Request, res: Response, next: NextFunction) => {
            Logger.debug('Calling Sign-In endpoint with body: %o', req.body);
            try {
                const { email, password } = req.body;
                const { user, token } = await authLogic.userSignIn(email, password);
                return res.json({ user, token }).status(200);
            } catch (e) {
                Logger.error('error: %o', e);
                return next(e);
            }
        }
    );

    /**
     * @TODO Let's leave this as a place holder for now
     * The reason for a logout route could be deleting a 'push notification token'
     * so the device stops receiving push notifications after logout.
     *
     * Another use case for advance/enterprise apps, you can store a record of the jwt token
     * emitted for the session and add it to a black list.
     * It's really annoying to develop that but if you had to, please use Redis as your data store
     */
    route.post('/logout', middlewares.isUserAuthorized, (req: Request, res: Response, next: NextFunction) => {
        Logger.debug('Calling Sign-Out endpoint with body: %o', req.body);
        try {
            return res.status(200).end();
        } catch (e) {
            Logger.error('error %o', e);
            return next(e);
        }
    });
};
