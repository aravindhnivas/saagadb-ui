const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    apps: [{
        name: 'saagadb-ui',
        script: 'build/index.js',
        interpreter: 'node',
        interpreter_args: '-r dotenv/config',
        env: {
            PORT: process.env.PORT,
            ORIGIN: "http://herzberg.mit.edu",
            PROTOCOL_HEADER: "x-forwarded-proto",
            HOST_HEADER: "x-forwarded-host"
        },
        env_
    }],
};