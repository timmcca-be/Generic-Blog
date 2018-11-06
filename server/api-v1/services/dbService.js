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

function runQuery(query) {
    // query should be a json-sql query object
    if(!db) {
        throw "initDB must be called and allowed to resolve before the database can be accessed";
    }
    let builtQuery;
    try {
        builtQuery = jsonSql.build(query);
    } catch(e) {
        console.log("Failed query object:\n" + JSON.stringify(query, null, 2));
        throw e;
    }
    // Replace $p{i}, where i is an integer, with the value of p{i} from the query build
    const textQuery = builtQuery.query.replace(/\$p\d/g, match => format.literal(builtQuery.values[match.substring(1)]));
    return db.query(textQuery).catch((e) => {
        console.log("Failing query text:\n" + textQuery);
        throw e;
    });
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
