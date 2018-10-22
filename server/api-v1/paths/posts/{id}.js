'use strict';

module.exports = function(postsService, dbService, validationService) {
    async function GET(req, res, next) {
        try {
            const post = await postsService.getPost(dbService, req.params.id);
            if(!post) {
                throw {
                    status: 404,
                    error: "Post not found"
                };
            }
            validationService.validate(post, res);
            res.send(post);
        } catch(e) {
            next(e);
        }
    }

    GET.apiDoc = `
        description: Get the specified post
        operationId: getPost
        tags:
          - posts
        parameters:
          - name: id
            in: path
            description: The post ID
            required: true
            type: integer
            minimum: 1
        responses:
          "200":
            description: Success
            schema:
              $ref: "#/definitions/Post"
          "400":
            $ref: "#/responses/InvalidRequest"
          default:
            $ref: "#/responses/Error"
    `;

    return { GET };
}
