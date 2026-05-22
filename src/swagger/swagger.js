import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "HireFlow API",
      version: "1.0.0",
      description: "Dokumentimi i API-ve për sistemin HireFlow",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Serveri Lokal",
      },
    ],
    paths: {
      // === APPLICATION STATUSES ===
      "/application-statuses": {
        "get": {
          "summary": "Merr listën e të gjitha statuseve",
          "tags": ["Application Statuses"],
          "responses": {
            "200": { "description": "Sukses" }
          }
        }
      },

      // === SAVED JOBS (Tani të dyja kanë /api saktësisht si te app.js) ===
      "/api/saved-jobs": {
        "post": {
          "summary": "Ruaj një pozitë pune",
          "tags": ["Saved Jobs"],
          "responses": {
            "201": { "description": "U ruajt me sukses" }
          }
        }
      },
      "/api/saved-jobs/user/{userId}": {
        "get": {
          "summary": "Merr punët e ruajtura për një përdorues",
          "tags": ["Saved Jobs"],
          "parameters": [
            {
              "name": "userId",
              "in": "path",
              "required": true,
              "schema": { "type": "integer" }
            }
          ],
          "responses": {
            "200": { "description": "Sukses" }
          }
        }
      },

      // === CANDIDATE PROFILES ===
      "/candidate-profiles": {
        "post": {
          "summary": "Krijo ose përditëso profilin e kandidatit",
          "tags": ["Candidate Profiles"],
          "responses": {
            "201": { "description": "Profili u ruajt me sukses" }
          }
        }
      },
      "/candidate-profiles/{id}": {
        "get": {
          "summary": "Merr profilin e një kandidati sipas ID-së",
          "tags": ["Candidate Profiles"],
          "parameters": [
            {
              "name": "id",
              "in": "path",
              "required": true,
              "schema": { "type": "integer" }
            }
          ],
          "responses": {
            "200": { "description": "Sukses" }
          }
        }
      },

      // === CANDIDATE SKILLS ===
      "/candidate-skills": {
        "post": {
          "summary": "Shto një aftësi (skill) të re për kandidatin",
          "tags": ["Candidate Skills"],
          "responses": {
            "201": { "description": "Aftësia u shtua me sukses" }
          }
        }
      },
      "/candidate-skills/candidate/{candidateId}": {
        "get": {
          "summary": "Merr të gjitha aftësitë e një kandidati specifik",
          "tags": ["Candidate Skills"],
          "parameters": [
            {
              "name": "candidateId",
              "in": "path",
              "required": true,
              "schema": { "type": "integer" }
            }
          ],
          "responses": {
            "200": { "description": "Sukses" }
          }
        }
      },

      // === APPLICATIONS ===
      "/applications": {
        "get": {
          "summary": "Merr listën e të gjitha aplikimeve",
          "tags": ["Applications"],
          "responses": {
            "200": { "description": "Sukses" }
          }
        }
      }
    }
  },
  apis: [], // Lihet e zbrazët për të shmangur gabimet e skenimit të fajllave
};

const swaggerSpec = swaggerJSDoc(options);

export const setupSwagger = (app) => {
  // Krijojmë rrugën për JSON-in e specifikimit që UI të furnizohet pa gabime cache-i
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};