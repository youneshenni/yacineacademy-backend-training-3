import { createWriteStream } from 'fs';
import morgan from 'morgan';

const accessLogStream = createWriteStream('./logs/access.log', { flags: 'a' })
const morganMiddleware = morgan('combined', { stream: accessLogStream });

export default morganMiddleware;