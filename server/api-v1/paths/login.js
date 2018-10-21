'use strict';

const InvalidCredentialsError = require('../shared/InvalidCredentialsError');

module.exports = function(authService) {
    async function POST(req, res, next) {
        try {
            res.send(await authService.login(req.body.username, req.body.password));
        } catch(e) {
            if(e instanceof InvalidCredentialsError) {
                return next({
                    status: 401,
                    error: e.message
                });
            }
            next(e);
        }
    }

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
