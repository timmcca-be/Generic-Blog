'use strict';

let host = 'localhost:' + process.env.PORT;
if(process.env.NODE_ENV === 'production') {
    host = process.env.PRODUCTION_HOSTNAME;
    if(process.env.PRODUCTION_HOSTNAME_APPEND_PORT === 'true') {
        host += ':' + process.env.PORT;
    }
}

module.exports = {
  "swagger": "2.0",
  "info": {
    "version": "0.1.0",
    "title": "Generic Blog Server"
  },
  "host": host,
  "basePath": "/api/v1",
  "schemes": [
    "http",
    "https"
  ],
  "consumes": [
    "application/json"
  ],
  "produces": [
    "application/json"
  ],
  "tags": [
    {
      "name": "posts",
      "description": "View and create posts"
    },
    {
      "name": "auth",
      "description": "Create and log into accounts"
    }
  ],
  "securityDefinitions": {
    "Bearer": {
      "type": "apiKey",
      "name": "Authorization",
      "in": "header"
    }
  },
  "paths": {},
  "responses": {
    "InvalidRequest": {
      "description": "Invalid request",
      "schema": {
        "required": [
          "errors"
        ],
        "properties": {
          "errors": {
            "type": "array",
            "items": {
              "required": [
                "path",
                "errorCode",
                "message",
                "location"
              ],
              "properties": {
                "path": {
                  "type": "string"
                },
                "errorCode": {
                  "type": "string"
                },
                "message": {
                  "type": "string"
                },
                "location": {
                  "type": "string"
                }
              }
            }
          }
        }
      }
    },
    "Error": {
      "description": "Unexpected error",
      "schema": {
        "required": [
          "error"
        ],
        "properties": {
          "error": {
            "type": "string"
          }
        }
      }
    }
  },
  "definitions": {
    "Username": {
      "type": "string",
      "pattern": "^[a-zA-Z0-9]([._](?![._])|[a-zA-Z0-9]){1,18}[a-zA-Z0-9]$",
      "description": "The username of a user"
    },
    "User": {
      "required": [
        "username",
        "password",
        "email"
      ],
      "properties": {
        "username": {
          "$ref": "#/definitions/Username"
        },
        "password": {
          "type": "string",
          "minLength": 8,
          "description": "The password of the user"
        },
        "email": {
          "type": "string",
          "pattern": "^(([^<>()\\[\\]\\\\.,;:\\s@\"]+(\\.[^<>()\\[\\]\\\\.,;:\\s@\"]+)*)|(\".+\"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$",
          "description": "The email address of the user"
        }
      }
    },
    "UploadPost": {
      "required": [
        "title",
        "content"
      ],
      "properties": {
        "title": {
          "type": "string",
          "minLength": 1,
          "maxLength": 100
        },
        "content": {
          "type": "string",
          "minLength": 1
        }
      }
    },
    "Post": {
      "allOf": [
        {
          "$ref": "#/definitions/UploadPost"
        },
        {
          "required": [
            "user_id",
            "author"
          ],
          "properties": {
            "user_id": {
              "type": "integer",
              "minimum": 1
            },
            "author": {
              "$ref": "#/definitions/Username"
            }
          }
        }
      ]
    },
    "Posts": {
      "required": [
        "rows"
      ],
      "properties": {
        "rows": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/Post"
          }
        }
      }
    }
  }
}
