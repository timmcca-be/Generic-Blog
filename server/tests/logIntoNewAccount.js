module.exports = {
    name: 'Log into the new account created at the start of this test sequence',
    auth: true,
    run: async (client, username, password, email) => {
        const response = await client.apis.auth.login({
            user: {
                username,
                password
            }
        });
    }
};
