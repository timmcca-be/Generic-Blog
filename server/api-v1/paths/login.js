'use strict';

const { InvalidCredentialsError } = require('../shared/errors');

module.exports = (authService, dbService, responseService) => {
    const POST = responseService.respond(req => authService.login(dbService, req.body.username, req.body.password).catch(err => {
        if(err instanceof InvalidCredentialsError) {
            throw {
                status: 401,
                error: err.message
            };
        }
        throw err;
    }));

    POST.apiDoc = `
        description: Get a login token
        operationId: login
        tags:
          - auth
        parameters:
          - name: user
            in: body
            description: The user to log in as
            required: true
            schema:
              required:
                - username
                - password
              properties:
                username:
                  type: string
                password:
                  type: string
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
