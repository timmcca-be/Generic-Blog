'use strict';

const format = require('pg-format');
const { queryOne, queryAll } = require('../shared/db');

module.exports = {
    getPost(id) {
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
        return queryOne(query);
    },
    getSummariesPaginated(start, limit) {
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
                                column: 'id'
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
                'PaginatedPosts.content',
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
        return queryAll(query);
    },
    createPost(title, content, user_id) {
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
        return queryOne(query);
    }
};
