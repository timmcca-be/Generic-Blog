'use strict';

const crypto = require('crypto');

module.exports = {
    name: 'Fail to post without authentication',
    auth: false,
    run: async (client, username, password, email) => {
        const title = crypto.randomBytes(16).toString('base64');
        const content = crypto.randomBytes(64).toString('base64');
        let threw401 = false;
        try {
            const response = await client.apis.posts.createPost({
                post: {
                    title,
                    content
                }
            });
        } catch(e) {
            if(e.status !== 401) {
                throw e;
            }
            threw401 = true;
        }
        if(!threw401) {
            throw new Error('Successfully posted without authentication');
        }
    }
};
