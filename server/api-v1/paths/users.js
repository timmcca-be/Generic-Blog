const { NotUniqueError } = require('../shared/errors');

module.exports = (authService, dbService, responseService) => {
    const POST = responseService.respond(req => authService.createUser(dbService, req.body.username, req.body.password, req.body.email).catch(err => {
        if(err instanceof NotUniqueError) {
            throw {
                status: 409,
                error: e.message
            };
        }
        throw err;
    }));

    POST.apiDoc = `
        description: Create an account and get a login token for the new account
        operationId: createAccount
        tags:
          - auth
        parameters:
          - name: user
            in: body
            description: The user to create
            required: true
            schema:
              $ref: "#/definitions/User"
        responses:
          "200":
            description: Success
            schema:
              required:
                - token
              properties:
                token:
                  type: string
          "400":
            $ref: "#/responses/InvalidRequest"
          default:
            $ref: "#/responses/Error"
    `;

    return { POST };
}
