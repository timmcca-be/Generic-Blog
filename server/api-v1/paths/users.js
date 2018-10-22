'use strict';

const { NotUniqueError } = require('../shared/errors');

module.exports = function(authService, dbService, validationService) {
    async function POST(req, res, next) {
        try {
            const body = await authService.createUser(dbService, req.body.username, req.body.password, req.body.email);
            validationService.validate(body, res);
            res.send(body);
        } catch(e) {
            if(e instanceof NotUniqueError) {
                return next({
                    status: 409,
                    error: e.message
                });
            }
            next(e);
        }
    }

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
