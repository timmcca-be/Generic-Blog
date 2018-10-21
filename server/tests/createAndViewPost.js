const crypto = require('crypto');

module.exports = {
    name: 'Create and view post',
    auth: true,
    run: async (client, username, password, email) => {
        const title = crypto.randomBytes(16).toString('base64');
        const content = crypto.randomBytes(64).toString('base64');
        const response = await client.apis.posts.createPost({
            post: {
                title,
                content
            }
        });
        const post = await client.apis.posts.getPost(response.body);
        if(post.body.title !== title) {
            throw new Error('Uploaded title "' + title + '" did not match returned title "' + post.body.title + '"');
        }
        if(post.body.content !== content) {
            throw new Error('Uploaded content "' + content + '" did not match returned content "' + post.body.content + '"');
        }
    }
};
