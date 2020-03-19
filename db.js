import { createConnection } from 'mongoose';

global.db = (global.db ? global.db : createConnection('mongodb://localhost:27017/restapi', {useNewUrlParser: true, poolSize: 100}));

export default db;