// Step 1: Install these in terminal (if not done yet):
// npm install swagger-jsdoc swagger-ui-express

// Step 2: Create swagger.js in your root
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');



const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Ponliv API',
      version: '1.0.0',
      description: 'Documentation for Ponliv User API',
    },
    servers: [{ url: 'http://localhost:5001/' }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
  Student: {
    type: 'object',
    required: ['name', 'email', 'password', 'address', 'phoneNumber', 'nif', 'role'],
    properties: {
      name: { type: 'string', minLength: 2 },
      email: { type: 'string', format: 'email' },
      password: { type: 'string', minLength: 6 },
      address: { type: 'string', minLength: 3 },
      phoneNumber: { type: 'string', pattern: '^\\d{8,15}$' },
      nif: { type: 'string', pattern: '^\\d{10}$' },
      website: { type: 'string', format: 'uri' },
      role: { type: 'string', enum: ['student'] },
    },
  },
  Parent: {
    type: 'object',
    required: ['name', 'email', 'password', 'address', 'phoneNumber', 'nif', 'role'],
    properties: {
      name: { type: 'string', minLength: 2 },
      email: { type: 'string', format: 'email' },
      password: { type: 'string', minLength: 6 },
      address: { type: 'string', minLength: 3 },
      phoneNumber: { type: 'string', pattern: '^\\d{8,15}$' },
      nif: { type: 'string', pattern: '^\\d{10}$' },
      website: { type: 'string', format: 'uri' },
      role: { type: 'string', enum: ['parent'] },
      children: {
        type: 'array',
        items: { type: 'string' }
      }
    },
  },
  Sponsor: {
    type: 'object',
    required: ['name', 'email', 'password', 'address', 'phoneNumber', 'nif', 'role'],
    properties: {
      name: { type: 'string', minLength: 2 },
      email: { type: 'string', format: 'email' },
      password: { type: 'string', minLength: 6 },
      address: { type: 'string', minLength: 3 },
      phoneNumber: { type: 'string', pattern: '^\\d{8,15}$' },
      nif: { type: 'string', pattern: '^\\d{10}$' },
      website: { type: 'string', format: 'uri' },
      role: { type: 'string', enum: ['sponsor'] },
      company: { type: 'string' }
    },
  },
  School: {
    type: 'object',
    required: ['name', 'email', 'password', 'address', 'phoneNumber', 'nif', 'role', 'director', 'schoolType'],
    properties: {
      name: { type: 'string', minLength: 2 },
      email: { type: 'string', format: 'email' },
      password: { type: 'string', minLength: 6 },
      address: { type: 'string', minLength: 3 },
      phoneNumber: { type: 'string', pattern: '^\\d{8,15}$' },
      nif: { type: 'string', pattern: '^\\d{10}$' },
      website: { type: 'string', format: 'uri' },
      role: { type: 'string', enum: ['school'] },
      director: { type: 'string', minLength: 2 },
      schoolType: {
        type: 'string',
        enum: ['kindergarden', 'primary', 'secondary', 'university']
      }
    },
  },
  Seller: {
    type: 'object',
    required: ['name', 'email', 'password', 'address', 'phoneNumber', 'nif', 'role'],
    properties: {
      name: { type: 'string', minLength: 2 },
      email: { type: 'string', format: 'email' },
      password: { type: 'string', minLength: 6 },
      address: { type: 'string', minLength: 3 },
      phoneNumber: { type: 'string', pattern: '^\\d{8,15}$' },
      nif: { type: 'string', pattern: '^\\d{10}$' },
      website: { type: 'string', format: 'uri' },
      role: { type: 'string', enum: ['seller'] }
    },
  },
  Admin: {
    type: 'object',
    required: ['name', 'email', 'password', 'address', 'phoneNumber', 'nif', 'role'],
    properties: {
      name: { type: 'string', minLength: 2 },
      email: { type: 'string', format: 'email' },
      password: { type: 'string', minLength: 6 },
      address: { type: 'string', minLength: 3 },
      phoneNumber: { type: 'string', pattern: '^\\d{8,15}$' },
      nif: { type: 'string', pattern: '^\\d{10}$' },
      website: { type: 'string', format: 'uri' },
      role: { type: 'string', enum: ['admin'] }
    },
  },
  Login: {
    type: 'object',
    required: ['email', 'password'],
    properties: {
      email: { type: 'string', format: 'email' },
      password: { type: 'string', minLength: 6 }
    }
  }
}
,
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);
module.exports = swaggerSpec;
























