import swaggerJsDoc from "swagger-jsdoc";

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "SportifyMe API",
      version: "1.0.0",
      description: "SportifyMe API Documentation",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "apiKey",
          name: "x-auth-token",
          scheme: "bearer",
          in: "header",
        },
      },
    },
    servers: [
      {
        url: "http://localhost:3000/api/",
      },
    ],
  },
  apis: ["./src/routes/*.router.ts"], // Point to the files where you have the endpoint definitions
};

export const swaggerDocs = swaggerJsDoc(swaggerOptions);
