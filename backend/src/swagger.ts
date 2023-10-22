import swaggerJsDoc from "swagger-jsdoc";
import dotenv from "dotenv";
dotenv.config();

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
        url: `${process.env.DEPLOY_SERVER}/api/`,
      },
    ],
  },
  apis: ["./src/routes/*.router.ts"], // Point to the files where you have the endpoint definitions
};

export const swaggerDocs = swaggerJsDoc(swaggerOptions);
