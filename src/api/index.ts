import { Router } from 'express';
import auth from './routes/auth';
import user from './routes/user';
import mediaLocation from './routes/mediaLocation';
import media from './routes/media';

// guaranteed to get dependencies
export default () => {
    const app = Router();
    auth(app);
    user(app);
    media(app);
    mediaLocation(app);
    
    return app;
};
