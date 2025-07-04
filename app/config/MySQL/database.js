import mysql from 'mysql2/promise';
import config from './config.js';

const pool = await mysql.createConnection(config);
pool.connect();

export default pool;