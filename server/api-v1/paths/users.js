'use strict';

module.exports = function(authService) {
    async function POST(req, res, next) {
        try {
            res.send(await authService.createUser(req.body.username, req.body.password, req.body.email));
        } catch(e) {
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
