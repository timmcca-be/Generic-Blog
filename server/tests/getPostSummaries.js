'use strict';

module.exports = {
    name: 'Get some post summaries',
    auth: true,
    run: async (client, username, password, email) => {
        const response = await client.apis.posts.getPostSummaries({
            start: 1,
            limit: 10
        });
        if(response.body.rows.length > 10) {
            throw new Error('Too many summaries returned');
        }
    }
};
