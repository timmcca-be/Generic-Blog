'use strict';

module.exports = function(postsService, dbService, validationService) {
    async function GET(req, res, next) {
        try {
            const posts = await postsService.getSummariesPaginated(dbService, req.query.start, req.query.limit)
            validationService.validate(posts, res);
            res.send(posts);
        } catch(e) {
            next(e);
        }
    }

    async function POST(req, res, next) {
        try {
            const body = await postsService.createPost(dbService, req.body.title, req.body.content, req.auth.userId);
            validationService.validate(body, res);
            res.send(body);
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
          - name: post
            in: body
            description: The post to create
            required: true
            schema:
              $ref: "#/definitions/UploadPost"
        responses:
          "200":
            description: Success
            schema:
              required:
                - id
              properties:
                id:
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
