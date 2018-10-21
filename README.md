# Generic Blog

This project is meant to serve as a starting point for a full-stack application
using Express with Swagger/OpenAPI 2.0 and a PostgreSQL database. It will also
be able to serve as a standalone (however generic) blog platform.

## Setup

Open a PostgreSQL shell and run the following commands:

<pre>
CREATE DATABASE <i>database</i>;  
CREATE USER site WITH ENCRYPTED PASSWORD '<i>password</i>';
</pre>

Change the database name and the password, but leave the name of the database
user as `site` - this will make the database import process much easier.

To import the database, open a command shell in the root directory of this
project and run this:  

<pre>
psql -d <i>database</i> -U <i>postgres</i> -f db-schema.sql
</pre>

Replace *`database`* with the name of your database from above. If your database
root user is not named `postgres`, replace it with that username.

Make a copy of `.env.template` named `.env` and update the values of `DB_NAME`,
`DB_PASS`, and `TOKEN_SECRET`.

Next run `npm import` to install all dependencies.

## Usage

Run `npm run dev` to start the development server or `npm start` to start the
production server. By default, it will launch on localhost:8080. All routes are
documented and can be tested at http://localhost:8080/api/v1/docs. If you are
running a production server, be sure to uncomment `NODE_ENV=production` in
`.env`.

The main OpenAPI configuration file is `server/api-v1/api-doc.yml`. Individual
routes are defined in their respective JavaScript files under `server/api-v1`.
See [`express-openapi`](https://www.npmjs.com/package/express-openapi) for more
details on this. A complete JSON specification of this server can be generated
by running `npm run generate-docs`, and is saved as `api-docs/v1.json`. All
tests can be executed by running `npm test`.

## Design

The server is designed to require as little code duplication as possible and to
fit well into an agile development process. The `express-openapi` package
includes automatic request default-setting, coercion, and validation based on
your OpenAPI specification, which eliminates the potential for bugs added by
manually implementing these requirements.

In a waterfall-based approach, it may make more sense to keep one central API
documentation file defining all of the routes, and then implement the routes
matching these specifications separately. This approach, however, is less
effective in an agile development process, as the dynamic requirements would
require modifications in two different locations to make a single change.
Keeping the documentation coupled with the routes means that everything related
to a route is defined in the same location. This has the added benefit of making
the code much easier to read, as the OpenAPI documentation also effective serves
as a comment. Of course, a single specification file independent of the
implementation is vital for users of the API, but this can be easily generated,
rather than sacrificing the clarity of the code.

## Future Goals

- Create and implement a front-end using React and Bootstrap
- Implement a database migration solution so that the database can be changed
without having to be recreated
- Add search functionality and the ability to sort posts based on popularity
- Use [`webpack`](https://www.npmjs.com/package/webpack) to create a build
process for the production server that generates optimized, minified code
- Use [`nodemailer`](https://www.npmjs.com/package/nodemailer) to implement
token-based account activation and password reset using the React front-end
- Add comments to posts, and create user profile pages with more detailed
information about users
