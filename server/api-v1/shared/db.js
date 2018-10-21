'use strict';

const pg = require('pg');
const format = require('pg-format');
const jsonSql = require('json-sql')();

jsonSql.setDialect('postgresql');

let db;

// Make DB connection
function initDB() {
    const config = {
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME
    };
    const pool = new pg.Pool(config)
    return new Promise((resolve, reject) => {
        pool.connect(function (err, client, done) {
            if(err) {
                reject(err);
            }
            db = client;
            resolve(client);
        });
    });
}

function getDB() {
    if(!db) {
        throw "initDB must be called and allowed to resolve before the database can be accessed";
    }
    return db;
}

// TODO: disallow text queries once all routes use json-sql objects

async function runQuery(query) {
    let textQuery;
    try {
        if(typeof query === 'string') {
            textQuery = query;
        } else {
            const builtQuery = jsonSql.build(query);
            // add strings to the query using pg-format
            // pg-format uses %% as the % character, since % is reserved
            let rawTextQuery = builtQuery.query.replace('%', '%%');
            const values = Object.keys(builtQuery.values).sort().map((key) => {
                rawTextQuery = rawTextQuery.replace('$' + key, "'%s'");
                return builtQuery.values[key];
            });
            textQuery = format(...[rawTextQuery].concat(values));
        }
        return await getDB().query(textQuery);
    } catch(e) {
        console.log("Failed query:\n" + JSON.stringify(query, null, 2));
        console.log("Failed query as text:\n" + textQuery);
        throw e;
    }
}

async function queryOne(query) {
    const results = await runQuery(query);
    if(results.rows.length === 0) {
        return null;
    }
    return results.rows[0];
}

async function queryAll(query) {
    const results = await runQuery(query);
    return {
        rows: results.rows
    }
}

module.exports = {initDB, queryOne, queryAll};
