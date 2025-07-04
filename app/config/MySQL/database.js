import sql from 'mysql';
import config from './config.js';

const pool = new sql.createConnection(config);
pool.connect();

export default pool;