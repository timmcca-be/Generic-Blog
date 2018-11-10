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
            'posts.*',
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
    const query = {
        type: 'select',
        table: 'posts',
        join: { users: { on: { 'users.id': 'posts.user_id' } } },
        fields: [
            'posts.title',
            'posts.id',
            'posts.user_id',
            {
                table: 'users',
                name: 'username',
                alias: 'author'
            }, {
                expression: {
                    pattern: 'left({column}, {charLimit})',
                    values: {
                        column: {
                            field: 'posts.content'
                        },
                        charLimit
                    }
                },
                alias: 'content'
            }
        ],
        sort: {
            id: -1
        },
        offset: start,
        limit
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
