'use strict';

module.exports = {
    initDB,
    queryOne,
    queryAll
};

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

function runQuery(query) {
    let textQuery;
    try {
        const builtQuery = jsonSql.build(query);
        textQuery = builtQuery.query.replace(/\$p\d/g, match => format.literal(builtQuery.values[match.substring(1)]));
        return getDB().query(textQuery);
    } catch(e) {
        console.log("Failed query:\n" + JSON.stringify(query, null, 2));
        console.log("Failed query as text:\n" + textQuery);
        throw e;
    }
}

function queryOne(query) {
    return runQuery(query).then(results => {
        if(results.rows.length === 0) {
            return null;
        }
        return results.rows[0];
    });
}

function queryAll(query) {
    return runQuery(query).then(results => {
        return { rows: results.rows }
    });
}
