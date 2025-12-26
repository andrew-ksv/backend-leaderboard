const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Leaderboard API',
      version: '1.0.0',
      description: 'Leaderboard for the Snake game 🎮'
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Local'
      },
      {
        url: process.env.SERVER_URL,
        description: 'Production'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: ['./routes/*.js'],
};

module.exports = swaggerJSDoc(options);
