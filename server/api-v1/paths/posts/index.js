'use strict';

module.exports = function(postsService) {
    async function GET(req, res, next) {
        try {
            res.send(await postsService.getSummariesPaginated(req.query.start, req.query.limit));
        } catch(e) {
            next(e);
        }
    }

    async function POST(req, res, next) {
        try {
            res.send(await postsService.createPost(req.body.title, req.body.content, req.auth.userId));
        } catch(e) {
            next(e);
        }
    }

    GET.apiDoc = `
        description: Get summaries of posts
        operationId: getPostSummaries
        tags:
          - posts
        parameters:
          - name: start
            in: query
            description: The index of the first post to get
            required: false
            type: integer
            minimum: 1
            default: 1
          - name: limit
            in: query
            description: The maximum number of posts to get
            required: false
            type: integer
            minimum: 1
            maximum: 100
            default: 20
        responses:
          "200":
            description: Success
            schema:
              $ref: "#/definitions/Posts"
          "400":
            $ref: "#/responses/InvalidRequest"
          default:
            $ref: "#/responses/Error"
    `;

    POST.apiDoc = `
        description: Create a post and get the ID of the new post
        operationId: createPost
        tags:
          - posts
        security:
          - Bearer: []
        parameters:
          - name: body
            in: body
            description: The post to create
            required: true
            schema:
              $ref: "#/definitions/UploadPost"
        responses:
          "200":
            description: Success
            schema:
              type: integer
              minimum: 1
          "400":
            $ref: "#/responses/InvalidRequest"
          default:
            $ref: "#/responses/Error"
    `;

    return {
        GET,
        POST
    };
}
