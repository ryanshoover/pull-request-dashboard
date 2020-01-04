# Pull Request Dashboard

Shows the status of pull requests from a collection of repositories.

This project is designed to be deployed to a Heroku instance using the [mars/heroku-cra-node](https://github.com/mars/heroku-cra-node) buildpack.

## Running Locally

1. Add local environment values to a `.env` file in this project's root directory

    ``` shell
    NODE_ENV=development
    GITHUB_TOKEN=your-github-token-with-read-access
    GITHUB_TEAM=your-github-team-id-number
    SERVER_PORT=3000
    DEBUG=pull-request-backend:server
    SITE_TITLE="DX Team Pull Requests"
    ```

2. Install root dependencies:

    ``` shell
    yarn install
    ```

3. Build the React frontend

    ``` shell
    yarn build
    ```

4. Start the server:

    ``` shell
    yarn start
    ```

5. Access the app at [localhost:5000](http://localhost:5000)
