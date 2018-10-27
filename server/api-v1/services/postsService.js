'use strict';

module.exports = {
    getPost,
    getSummariesPaginated,
    createPost
};

const format = require('pg-format');

function getPost(dbService, id) {
    const query = {
        type: 'select',
        table: 'posts',
        join: { users: { on: { 'users.id': 'posts.user_id' } } },
        fields: [
            'posts.title',
            'posts.content',
            'posts.user_id',
            {
                table: 'users',
                name: 'username',
                alias: 'author'
            }
        ],
        condition: {
            'posts.id': id
        }
    }
    return dbService.queryOne(query);
}

function getSummariesPaginated(dbService, start, limit, charLimit) {
    const subQuery = {
        select: {
            table: 'posts',
            fields: [
                '*',
                {
                    expression: {
                        pattern: '{operation} OVER (ORDER BY {column} DESC)',
                        values: {
                            operation: { func: { name: 'ROW_NUMBER' } },
                            column: {
                                field: 'id'
                            }
                        }
                    },
                    alias: 'RowNum'
                }
            ]
        }
    };
    const query = {
        type: 'select',
        with: {
            PaginatedPosts: subQuery
        },
        table: 'PaginatedPosts',
        join: { users: { on: { 'users.id': 'PaginatedPosts.user_id' } } },
        fields: [
            'PaginatedPosts.title',
            {
                expression: {
                    pattern: 'left({column}, {charLimit})',
                    values: {
                        column: {
                            field: 'PaginatedPosts.content'
                        },
                        charLimit
                    }
                },
                alias: 'content'
            },
            'PaginatedPosts.user_id',
            {
                table: 'users',
                name: 'username',
                alias: 'author'
            }
        ],
        condition: {
            'PaginatedPosts.RowNum': {
                $gte: start,
                $lt: start + limit
            }
        },
        sort: 'PaginatedPosts.RowNum'
    };
    return dbService.queryAll(query);
}

function createPost(dbService, title, content, user_id) {
    const query = {
        type: 'insert',
        table: 'posts',
        values: {
            title,
            content,
            user_id
        },
        returning: ['id']
    };
    return dbService.queryOne(query);
}
