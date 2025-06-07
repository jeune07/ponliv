const swagger = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Pon Liv API',
            version: '1.0.0',
            description: 'API for Pon Liv, a book management system',
        },
        servers: [
            {
                url: 'http://localhost:5001',
                description: 'Development server'
            }
        ]   
    },
    apis: ['./routes/*.js']
};

const swaggerDocs = swagger(options);
module.exports = swaggerDocs;