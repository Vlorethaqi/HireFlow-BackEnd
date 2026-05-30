import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const bearer = [{ bearerAuth: [] }];
const jsonBody = (schema) => ({
  required: true,
  content: {
    "application/json": { schema },
  },
});
const ok = (description = "Sukses") => ({ description });
const idParam = (name = "id") => ({
  name,
  in: "path",
  required: true,
  schema: { type: "integer" },
});

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "HireFlow API",
      version: "1.0.0",
      description: "Dokumentimi dhe testimi i API-ve per sistemin HireFlow",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Serveri lokal",
      },
    ],
    tags: [
      { name: "Auth" },
      { name: "Users" },
      { name: "Companies" },
      { name: "Departments" },
      { name: "Jobs" },
      { name: "Skills" },
      { name: "Candidate Profiles" },
      { name: "Candidate Skills" },
      { name: "Applications" },
      { name: "Application Statuses" },
      { name: "Application Documents" },
      { name: "Application Reviews" },
      { name: "Application Responses" },
      { name: "Saved Jobs" },
      { name: "Notifications" },
      { name: "Audit Logs" },
      { name: "AI" },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            id: { type: "integer" },
            name: { type: "string" },
            email: { type: "string", format: "email" },
            role: { type: "string", enum: ["ADMIN", "CANDIDATE", "HR", "WORKER"] },
            roleId: { type: "integer", nullable: true },
            companyId: { type: "integer", nullable: true },
            isActive: { type: "boolean" },
          },
        },
        Company: {
          type: "object",
          properties: {
            id: { type: "integer" },
            name: { type: "string" },
            description: { type: "string", nullable: true },
            email: { type: "string", format: "email" },
            phone: { type: "string", nullable: true },
            location: { type: "string", nullable: true },
            isActive: { type: "boolean" },
          },
        },
        Department: {
          type: "object",
          properties: {
            id: { type: "integer" },
            name: { type: "string" },
            companyId: { type: "integer" },
          },
        },
        Job: {
          type: "object",
          properties: {
            id: { type: "integer" },
            title: { type: "string" },
            description: { type: "string" },
            location: { type: "string" },
            salaryMin: { type: "number", nullable: true },
            salaryMax: { type: "number", nullable: true },
            employmentType: { type: "string", enum: ["FULL_TIME", "PART_TIME", "INTERNSHIP", "CONTRACT"] },
            status: { type: "string", enum: ["OPEN", "CLOSED"] },
            deadline: { type: "string", format: "date-time", nullable: true },
            companyId: { type: "integer" },
            departmentId: { type: "integer", nullable: true },
          },
        },
        JobRequirement: {
          type: "object",
          properties: {
            id: { type: "integer" },
            requirementText: { type: "string" },
            requirementType: { type: "string", enum: ["EDUCATION", "EXPERIENCE", "SKILL", "CERTIFICATION", "OTHER"] },
            isRequired: { type: "boolean" },
            jobId: { type: "integer" },
          },
        },
        Skill: {
          type: "object",
          properties: {
            id: { type: "integer" },
            name: { type: "string" },
            category: { type: "string", enum: ["TECHNICAL", "SOFT", "LANGUAGE", "TOOL"] },
            description: { type: "string", nullable: true },
          },
        },
        JobSkill: {
          type: "object",
          properties: {
            jobId: { type: "integer" },
            skillId: { type: "integer" },
            importanceLevel: { type: "string", enum: ["REQUIRED", "PREFERRED"] },
          },
        },
        CandidateProfile: {
          type: "object",
          properties: {
            id: { type: "integer" },
            bio: { type: "string", nullable: true },
            phone: { type: "string" },
            location: { type: "string", nullable: true },
            experienceYears: { type: "integer" },
            education: { type: "string", nullable: true },
            cvUrl: { type: "string", nullable: true },
            linkedinUrl: { type: "string", nullable: true },
            githubUrl: { type: "string", nullable: true },
            userId: { type: "integer" },
          },
        },
        CandidateSkill: {
          type: "object",
          properties: {
            id: { type: "integer" },
            candidateProfileId: { type: "integer" },
            skillId: { type: "integer" },
          },
        },
        Application: {
          type: "object",
          properties: {
            id: { type: "integer" },
            userId: { type: "integer" },
            jobId: { type: "integer" },
            statusId: { type: "integer" },
            companyId: { type: "integer" },
            candidateProfileId: { type: "integer" },
            coverLetter: { type: "string", nullable: true },
            appliedAt: { type: "string", format: "date-time" },
          },
        },
        ApplicationStatus: {
          type: "object",
          properties: {
            id: { type: "integer" },
            name: { type: "string" },
            description: { type: "string", nullable: true },
          },
        },
        ApplicationDocument: {
          type: "object",
          properties: {
            id: { type: "integer" },
            applicationId: { type: "integer" },
            documentType: { type: "string", enum: ["CV", "COVER_LETTER", "CERTIFICATE", "OTHER"] },
            fileName: { type: "string" },
            fileUrl: { type: "string" },
            companyId: { type: "integer" },
          },
        },
        ApplicationReview: {
          type: "object",
          properties: {
            id: { type: "integer" },
            applicationId: { type: "integer" },
            reviewerId: { type: "integer" },
            rating: { type: "integer" },
            comment: { type: "string", nullable: true },
            recommendation: { type: "string", enum: ["RECOMMENDED", "NOT_RECOMMENDED", "NEUTRAL"] },
            companyId: { type: "integer" },
          },
        },
        ApplicationResponse: {
          type: "object",
          properties: {
            id: { type: "integer" },
            applicationId: { type: "integer" },
            senderId: { type: "integer" },
            message: { type: "string" },
            status: { type: "string", enum: ["ACCEPTED", "REJECTED", "INTERVIEW", "PENDING"] },
            companyId: { type: "integer" },
          },
        },
        SavedJob: {
          type: "object",
          properties: {
            id: { type: "integer" },
            userId: { type: "integer" },
            jobId: { type: "integer" },
          },
        },
        Notification: {
          type: "object",
          properties: {
            id: { type: "integer" },
            userId: { type: "integer" },
            title: { type: "string" },
            message: { type: "string" },
            type: { type: "string", enum: ["APPLICATION", "RESPONSE", "SYSTEM"] },
            isRead: { type: "boolean" },
            companyId: { type: "integer" },
          },
        },
        AuditLog: {
          type: "object",
          properties: {
            id: { type: "integer" },
            userId: { type: "integer", nullable: true },
            action: { type: "string" },
            entity: { type: "string" },
            entityId: { type: "integer", nullable: true },
            description: { type: "string", nullable: true },
            companyId: { type: "integer" },
          },
        },
        LoginRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", example: "bejicrinesa@gmail.com" },
            password: { type: "string", example: "password123" },
          },
        },
        RegisterRequest: {
          type: "object",
          required: ["name", "email", "password"],
          properties: {
            name: { type: "string", example: "Rinesa" },
            email: { type: "string", example: "rinesa@example.com" },
            password: { type: "string", example: "password123" },
            role: { type: "string", enum: ["ADMIN", "CANDIDATE", "HR", "WORKER"], example: "CANDIDATE" },
          },
        },
        CandidateProfileUpsertRequest: {
          type: "object",
          properties: {
            phone: { type: "string", example: "04934875" },
            location: { type: "string", example: "Prishtine" },
            education: { type: "string", example: "FIEK" },
            experienceYears: { type: "integer", example: 3 },
            githubUrl: { type: "string", example: "https://github.com/user" },
            linkedinUrl: { type: "string", example: "https://linkedin.com/in/user" },
            bio: { type: "string", example: "Software developer" },
            skills: { type: "array", items: { type: "integer" }, example: [1, 2] },
            cvFile: {
              type: "object",
              description: "File i kthyer ne base64 nga frontend-i",
              properties: {
                fileName: { type: "string", example: "cv.pdf" },
                contentBase64: { type: "string", example: "JVBERi0xLjQ..." },
              },
            },
          },
        },
        JobCreateRequest: {
          type: "object",
          required: ["title", "description", "employmentType"],
          properties: {
            title: { type: "string", example: "Backend Developer" },
            description: { type: "string", example: "Node.js dhe PostgreSQL" },
            location: { type: "string", example: "Prishtine" },
            salaryMin: { type: "number", example: 700 },
            salaryMax: { type: "number", example: 1200 },
            employmentType: { type: "string", enum: ["FULL_TIME", "PART_TIME", "INTERNSHIP", "CONTRACT"] },
            status: { type: "string", enum: ["OPEN", "CLOSED"], example: "OPEN" },
            deadline: { type: "string", format: "date", example: "2026-06-30" },
            departmentId: { type: "integer", nullable: true },
            skills: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  skillId: { type: "integer" },
                  importanceLevel: { type: "string", enum: ["REQUIRED", "PREFERRED"] },
                },
              },
            },
            requirements: { type: "array", items: { type: "string" }, example: ["2+ vite pervoje"] },
          },
        },
      },
    },
    paths: {
      "/auth/register": {
        post: {
          tags: ["Auth"],
          summary: "Regjistro perdorues",
          requestBody: jsonBody({ $ref: "#/components/schemas/RegisterRequest" }),
          responses: { 201: ok("Register successful"), 400: ok("Te dhenat nuk jane valide") },
        },
      },
      "/auth/login": {
        post: {
          tags: ["Auth"],
          summary: "Kycu dhe merr JWT token",
          requestBody: jsonBody({ $ref: "#/components/schemas/LoginRequest" }),
          responses: { 200: ok("Login successful"), 401: ok("Kredencialet jane gabim") },
        },
      },
      "/auth/refresh": {
        post: {
          tags: ["Auth"],
          summary: "Rifresko token-in",
          requestBody: jsonBody({
            type: "object",
            required: ["refreshToken"],
            properties: {
              refreshToken: { type: "string", example: "eyJhbGciOiJIUzI1NiIs..." },
            },
          }),
          responses: { 200: ok() },
        },
      },
      "/users": {
        get: { tags: ["Users"], summary: "Lista e perdoruesve", security: bearer, responses: { 200: ok() } },
        post: {
          tags: ["Users"],
          summary: "Krijo perdorues",
          security: bearer,
          requestBody: jsonBody({ $ref: "#/components/schemas/RegisterRequest" }),
          responses: { 201: ok("User created") },
        },
      },
      "/users/{id}": {
        get: { tags: ["Users"], summary: "Merr perdorues sipas ID", security: bearer, parameters: [idParam()], responses: { 200: ok(), 404: ok("Nuk u gjet") } },
        put: { tags: ["Users"], summary: "Perditeso perdorues", security: bearer, parameters: [idParam()], requestBody: jsonBody({ $ref: "#/components/schemas/User" }), responses: { 200: ok() } },
        delete: { tags: ["Users"], summary: "Fshi perdorues", security: bearer, parameters: [idParam()], responses: { 200: ok() } },
      },
      "/companies": {
        get: { tags: ["Companies"], summary: "Lista e kompanive", security: bearer, responses: { 200: ok() } },
        post: {
          tags: ["Companies"],
          summary: "Krijo kompani",
          requestBody: jsonBody({
            type: "object",
            required: ["name", "email"],
            properties: {
              name: { type: "string", example: "HireFlow LLC" },
              email: { type: "string", example: "company@example.com" },
              phone: { type: "string", example: "049111222" },
              location: { type: "string", example: "Prishtine" },
              description: { type: "string", example: "Tech company" },
              adminEmail: { type: "string", example: "admin@example.com" },
              adminName: { type: "string", example: "Admin User" },
            },
          }),
          responses: { 201: ok("Company created") },
        },
      },
      "/companies/me": {
        get: { tags: ["Companies"], summary: "Kompania ime", security: bearer, responses: { 200: ok(), 404: ok("Nuk u gjet") } },
      },
      "/companies/{id}": {
        get: { tags: ["Companies"], summary: "Merr kompani sipas ID", security: bearer, parameters: [idParam()], responses: { 200: ok() } },
        put: { tags: ["Companies"], summary: "Perditeso kompani", security: bearer, parameters: [idParam()], requestBody: jsonBody({ $ref: "#/components/schemas/Company" }), responses: { 200: ok() } },
        delete: { tags: ["Companies"], summary: "Deaktivizo kompani", security: bearer, parameters: [idParam()], responses: { 200: ok() } },
      },
      "/departments": {
        get: { tags: ["Departments"], summary: "Lista e departamenteve", security: bearer, responses: { 200: ok() } },
        post: {
          tags: ["Departments"],
          summary: "Krijo departament",
          security: bearer,
          requestBody: jsonBody({ type: "object", required: ["name"], properties: { name: { type: "string", example: "Engineering" } } }),
          responses: { 201: ok() },
        },
      },
      "/jobs": {
        get: {
          tags: ["Jobs"],
          summary: "Lista e puneve me filtra opsionale",
          parameters: [
            { name: "search", in: "query", schema: { type: "string" } },
            { name: "status", in: "query", schema: { type: "string", enum: ["OPEN", "CLOSED"] } },
            { name: "employmentType", in: "query", schema: { type: "string", enum: ["FULL_TIME", "PART_TIME", "INTERNSHIP", "CONTRACT"] } },
            { name: "location", in: "query", schema: { type: "string" } },
            { name: "companyId", in: "query", schema: { type: "integer" } },
            { name: "departmentId", in: "query", schema: { type: "integer" } },
            { name: "skill", in: "query", schema: { type: "string" } },
            { name: "page", in: "query", schema: { type: "integer", default: 1 } },
            { name: "limit", in: "query", schema: { type: "integer", default: 10 } },
          ],
          responses: { 200: ok() },
        },
        post: {
          tags: ["Jobs"],
          summary: "Krijo pune",
          security: bearer,
          requestBody: jsonBody({ $ref: "#/components/schemas/JobCreateRequest" }),
          responses: { 201: ok("Job created"), 403: ok("Nuk keni autorizim") },
        },
      },
      "/skills": {
        get: { tags: ["Skills"], summary: "Lista e skills", responses: { 200: ok() } },
        post: {
          tags: ["Skills"],
          summary: "Krijo skill",
          security: bearer,
          requestBody: jsonBody({ type: "object", required: ["name"], properties: { name: { type: "string", example: "Node.js" }, category: { type: "string", enum: ["TECHNICAL", "SOFT", "LANGUAGE", "TOOL"] }, description: { type: "string" } } }),
          responses: { 201: ok() },
        },
      },
      "/skills/{id}": {
        delete: { tags: ["Skills"], summary: "Fshi skill", security: bearer, parameters: [idParam()], responses: { 200: ok() } },
      },
      "/candidate-profiles": {
        get: { tags: ["Candidate Profiles"], summary: "Lista e profileve", responses: { 200: ok() } },
        post: { tags: ["Candidate Profiles"], summary: "Krijo profil direkt", requestBody: jsonBody({ $ref: "#/components/schemas/CandidateProfile" }), responses: { 201: ok() } },
      },
      "/candidate-profiles/me": {
        get: { tags: ["Candidate Profiles"], summary: "Profili im", security: bearer, responses: { 200: ok() } },
        put: { tags: ["Candidate Profiles"], summary: "Krijo/perditeso profilin tim me CV", security: bearer, requestBody: jsonBody({ $ref: "#/components/schemas/CandidateProfileUpsertRequest" }), responses: { 200: ok("Profile saved successfully") } },
      },
      "/candidate-profiles/{id}": {
        get: { tags: ["Candidate Profiles"], summary: "Merr profil sipas ID", parameters: [idParam()], responses: { 200: ok() } },
        put: { tags: ["Candidate Profiles"], summary: "Perditeso profil direkt", parameters: [idParam()], requestBody: jsonBody({ $ref: "#/components/schemas/CandidateProfile" }), responses: { 200: ok() } },
        delete: { tags: ["Candidate Profiles"], summary: "Fshi profil", parameters: [idParam()], responses: { 200: ok() } },
      },
      "/candidate-skills": {
        get: { tags: ["Candidate Skills"], summary: "Lista e candidate skills", responses: { 200: ok() } },
        post: { tags: ["Candidate Skills"], summary: "Lidh skill me profil kandidati", requestBody: jsonBody({ $ref: "#/components/schemas/CandidateSkill" }), responses: { 201: ok() } },
      },
      "/candidate-skills/{id}": {
        delete: { tags: ["Candidate Skills"], summary: "Fshi candidate skill", parameters: [idParam()], responses: { 200: ok() } },
      },
      "/applications/apply": {
        post: {
          tags: ["Applications"],
          summary: "Apliko ne pune duke perdorur CV-ne nga profili",
          security: bearer,
          requestBody: jsonBody({
            type: "object",
            required: ["jobId"],
            properties: {
              jobId: { type: "integer", example: 1 },
              coverLetter: { type: "string", example: "Jam e interesuar per kete pozite." },
              coverLetterFile: {
                type: "object",
                properties: { fileName: { type: "string" }, contentBase64: { type: "string" } },
              },
            },
          }),
          responses: { 201: ok("Aplikimi u realizua"), 400: ok("Profili/CV mungon") },
        },
      },
      "/applications/me": {
        get: { tags: ["Applications"], summary: "Aplikimet e mia", security: bearer, responses: { 200: ok() } },
      },
      "/applications/company": {
        get: { tags: ["Applications"], summary: "Aplikimet e kompanise", security: bearer, responses: { 200: ok() } },
      },
      "/applications/{id}/status": {
        put: {
          tags: ["Applications"],
          summary: "Ndrysho status aplikimi",
          security: bearer,
          parameters: [idParam()],
          requestBody: jsonBody({ type: "object", properties: { statusId: { type: "integer", example: 2 }, statusName: { type: "string", example: "REVIEWED" } } }),
          responses: { 200: ok() },
        },
      },
      "/application-statuses": {
        get: { tags: ["Application Statuses"], summary: "Lista e statuseve", responses: { 200: ok() } },
        post: { tags: ["Application Statuses"], summary: "Krijo status", requestBody: jsonBody({ type: "object", required: ["name"], properties: { name: { type: "string", example: "PENDING" }, description: { type: "string" } } }), responses: { 201: ok() } },
      },
      "/application-statuses/{id}": {
        get: { tags: ["Application Statuses"], summary: "Merr status sipas ID", parameters: [idParam()], responses: { 200: ok() } },
        put: { tags: ["Application Statuses"], summary: "Perditeso status", parameters: [idParam()], requestBody: jsonBody({ type: "object", required: ["name"], properties: { name: { type: "string", example: "REVIEWED" } } }), responses: { 200: ok() } },
        delete: { tags: ["Application Statuses"], summary: "Fshi status", parameters: [idParam()], responses: { 200: ok() } },
      },
      "/application-documents": {
        get: { tags: ["Application Documents"], summary: "Lista e dokumenteve", responses: { 200: ok() } },
        post: { tags: ["Application Documents"], summary: "Krijo dokument aplikimi", requestBody: jsonBody({ $ref: "#/components/schemas/ApplicationDocument" }), responses: { 200: ok() } },
      },
      "/application-documents/application/{applicationId}": {
        get: { tags: ["Application Documents"], summary: "Dokumentet e nje aplikimi", parameters: [idParam("applicationId")], responses: { 200: ok() } },
      },
      "/application-documents/{id}": {
        delete: { tags: ["Application Documents"], summary: "Fshi dokument", parameters: [idParam()], responses: { 200: ok() } },
      },
      "/application-reviews": {
        get: { tags: ["Application Reviews"], summary: "Lista e reviews per kompani", security: bearer, responses: { 200: ok() } },
        post: { tags: ["Application Reviews"], summary: "Krijo review per aplikim", security: bearer, requestBody: jsonBody({ type: "object", required: ["applicationId", "rating"], properties: { applicationId: { type: "integer" }, rating: { type: "integer", example: 4 }, comment: { type: "string" }, recommendation: { type: "string", enum: ["RECOMMENDED", "NOT_RECOMMENDED", "NEUTRAL"] } } }), responses: { 201: ok() } },
      },
      "/application-reviews/application/{applicationId}": {
        get: { tags: ["Application Reviews"], summary: "Reviews per aplikim", security: bearer, parameters: [idParam("applicationId")], responses: { 200: ok() } },
      },
      "/application-reviews/{id}": {
        put: { tags: ["Application Reviews"], summary: "Perditeso review", security: bearer, parameters: [idParam()], requestBody: jsonBody({ $ref: "#/components/schemas/ApplicationReview" }), responses: { 200: ok() } },
        delete: { tags: ["Application Reviews"], summary: "Fshi review", security: bearer, parameters: [idParam()], responses: { 200: ok() } },
      },
      "/application-responses": {
        get: { tags: ["Application Responses"], summary: "Lista e responses per kompani", security: bearer, responses: { 200: ok() } },
        post: { tags: ["Application Responses"], summary: "Dergo response per aplikim", security: bearer, requestBody: jsonBody({ type: "object", required: ["applicationId", "message"], properties: { applicationId: { type: "integer" }, message: { type: "string" }, status: { type: "string", enum: ["ACCEPTED", "REJECTED", "INTERVIEW", "PENDING"] } } }), responses: { 201: ok() } },
      },
      "/application-responses/application/{applicationId}": {
        get: { tags: ["Application Responses"], summary: "Responses per aplikim", security: bearer, parameters: [idParam("applicationId")], responses: { 200: ok() } },
      },
      "/application-responses/{id}": {
        put: { tags: ["Application Responses"], summary: "Perditeso response", security: bearer, parameters: [idParam()], requestBody: jsonBody({ $ref: "#/components/schemas/ApplicationResponse" }), responses: { 200: ok() } },
        delete: { tags: ["Application Responses"], summary: "Fshi response", security: bearer, parameters: [idParam()], responses: { 200: ok() } },
      },
      "/saved-jobs": {
        get: { tags: ["Saved Jobs"], summary: "Punet e ruajtura te user-it", security: bearer, responses: { 200: ok() } },
        post: { tags: ["Saved Jobs"], summary: "Ruaj pune", security: bearer, requestBody: jsonBody({ type: "object", required: ["jobId"], properties: { jobId: { type: "integer", example: 1 } } }), responses: { 201: ok() } },
      },
      "/saved-jobs/user/{userId}": {
        get: { tags: ["Saved Jobs"], summary: "Punet e ruajtura per user", security: bearer, parameters: [idParam("userId")], responses: { 200: ok() } },
      },
      "/saved-jobs/{id}": {
        delete: { tags: ["Saved Jobs"], summary: "Hiq pune nga te ruajturat", security: bearer, parameters: [idParam()], responses: { 200: ok() } },
      },
      "/api/saved-jobs": {
        get: { tags: ["Saved Jobs"], summary: "Alias: punet e ruajtura te user-it", security: bearer, responses: { 200: ok() } },
        post: { tags: ["Saved Jobs"], summary: "Alias: ruaj pune", security: bearer, requestBody: jsonBody({ type: "object", required: ["jobId"], properties: { jobId: { type: "integer", example: 1 } } }), responses: { 201: ok() } },
      },
      "/api/saved-jobs/user/{userId}": {
        get: { tags: ["Saved Jobs"], summary: "Alias: punet e ruajtura per user", security: bearer, parameters: [idParam("userId")], responses: { 200: ok() } },
      },
      "/api/saved-jobs/{id}": {
        delete: { tags: ["Saved Jobs"], summary: "Alias: hiq pune nga te ruajturat", security: bearer, parameters: [idParam()], responses: { 200: ok() } },
      },
      "/notifications": {
        get: { tags: ["Notifications"], summary: "Notifikimet e mia", security: bearer, responses: { 200: ok() } },
        post: { tags: ["Notifications"], summary: "Krijo notifikim", security: bearer, requestBody: jsonBody({ $ref: "#/components/schemas/Notification" }), responses: { 200: ok() } },
      },
      "/notifications/user/{userId}": {
        get: { tags: ["Notifications"], summary: "Notifikimet per user", security: bearer, parameters: [idParam("userId")], responses: { 200: ok() } },
      },
      "/notifications/{id}/read": {
        put: { tags: ["Notifications"], summary: "Sheno notifikimin si te lexuar", security: bearer, parameters: [idParam()], responses: { 200: ok() } },
      },
      "/notifications/{id}": {
        delete: { tags: ["Notifications"], summary: "Fshi notifikim", security: bearer, parameters: [idParam()], responses: { 200: ok() } },
      },
      "/audit-logs": {
        get: { tags: ["Audit Logs"], summary: "Lista e audit logs", responses: { 200: ok() } },
        post: { tags: ["Audit Logs"], summary: "Krijo audit log", requestBody: jsonBody({ $ref: "#/components/schemas/AuditLog" }), responses: { 200: ok() } },
      },
      "/audit-logs/company/{companyId}": {
        get: { tags: ["Audit Logs"], summary: "Audit logs per kompani", parameters: [idParam("companyId")], responses: { 200: ok() } },
      },
      "/audit-logs/user/{userId}": {
        get: { tags: ["Audit Logs"], summary: "Audit logs per user", parameters: [idParam("userId")], responses: { 200: ok() } },
      },
      "/ai/analyze-application/{applicationId}": {
        post: { tags: ["AI"], summary: "Analizo aplikim me AI", security: bearer, parameters: [idParam("applicationId")], responses: { 200: ok() } },
      },
    },
  },
  apis: [],
};

const swaggerSpec = swaggerJSDoc(options);

export const setupSwagger = (app) => {
  app.get("/api-docs.json", (_req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });

  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
