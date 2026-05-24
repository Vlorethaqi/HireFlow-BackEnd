import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const bearerAuth = [{ bearerAuth: [] }];

const idParameter = (name = "id", description = "ID e rekordit") => ({
  name,
  in: "path",
  required: true,
  description,
  schema: { type: "integer", example: 1 },
});

const jsonBody = (schemaRef) => ({
  required: true,
  content: {
    "application/json": {
      schema: { $ref: schemaRef },
    },
  },
});

const successResponse = (description = "Sukses", schemaRef = null) => ({
  description,
  ...(schemaRef && {
    content: {
      "application/json": {
        schema: { $ref: schemaRef },
      },
    },
  }),
});

const arrayResponse = (schemaRef, description = "Sukses") => ({
  description,
  content: {
    "application/json": {
      schema: {
        type: "array",
        items: { $ref: schemaRef },
      },
    },
  },
});

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "HireFlow API",
      version: "1.0.0",
      description: "Dokumentimi i API-ve per sistemin HireFlow",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Serveri lokal",
      },
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
        AuthRegisterRequest: {
          type: "object",
          required: ["name", "email", "password"],
          properties: {
            name: { type: "string", example: "Arta Berisha" },
            email: { type: "string", format: "email", example: "arta@example.com" },
            password: { type: "string", format: "password", example: "password123" },
            role: {
              type: "string",
              enum: ["ADMIN", "CANDIDATE", "HR", "WORKER"],
              example: "CANDIDATE",
            },
            companyId: { type: "integer", nullable: true, example: 1 },
            roleId: { type: "integer", nullable: true, example: 2 },
          },
        },
        AuthLoginRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", format: "email", example: "arta@example.com" },
            password: { type: "string", format: "password", example: "password123" },
          },
        },
        User: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            name: { type: "string", example: "Arta Berisha" },
            email: { type: "string", format: "email", example: "arta@example.com" },
            role: {
              type: "string",
              enum: ["ADMIN", "CANDIDATE", "HR", "WORKER"],
              example: "CANDIDATE",
            },
            roleId: { type: "integer", nullable: true, example: 2 },
            companyId: { type: "integer", nullable: true, example: 1 },
            isActive: { type: "boolean", example: true },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        UserRequest: {
          type: "object",
          required: ["name", "email", "password"],
          properties: {
            name: { type: "string", example: "Arta Berisha" },
            email: { type: "string", format: "email", example: "arta@example.com" },
            password: { type: "string", format: "password", example: "password123" },
            role: {
              type: "string",
              enum: ["ADMIN", "CANDIDATE", "HR", "WORKER"],
              example: "HR",
            },
            roleId: { type: "integer", nullable: true, example: 2 },
            isActive: { type: "boolean", example: true },
          },
        },
        Company: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            name: { type: "string", example: "HireFlow SH.P.K." },
            description: { type: "string", nullable: true, example: "Kompani teknologjike" },
            email: { type: "string", format: "email", example: "info@hireflow.com" },
            phone: { type: "string", nullable: true, example: "+38344111222" },
            location: { type: "string", nullable: true, example: "Prishtine" },
            isActive: { type: "boolean", example: true },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        CompanyRequest: {
          type: "object",
          required: ["name", "email"],
          properties: {
            name: { type: "string", example: "HireFlow SH.P.K." },
            description: { type: "string", nullable: true, example: "Kompani teknologjike" },
            email: { type: "string", format: "email", example: "info@hireflow.com" },
            phone: { type: "string", nullable: true, example: "+38344111222" },
            location: { type: "string", nullable: true, example: "Prishtine" },
            adminName: { type: "string", example: "Admin User" },
            adminEmail: { type: "string", format: "email", example: "admin@hireflow.com" },
            adminPassword: { type: "string", format: "password", example: "password123" },
          },
        },
        Department: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            name: { type: "string", example: "Engineering" },
            companyId: { type: "integer", example: 1 },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Job: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            title: { type: "string", example: "Backend Developer" },
            description: { type: "string", example: "Zhvillim dhe mirembajtje e API-ve" },
            location: { type: "string", nullable: true, example: "Prishtine" },
            salaryMin: { type: "number", format: "float", nullable: true, example: 900 },
            salaryMax: { type: "number", format: "float", nullable: true, example: 1500 },
            employmentType: {
              type: "string",
              enum: ["FULL_TIME", "PART_TIME", "INTERNSHIP", "CONTRACT"],
              example: "FULL_TIME",
            },
            status: { type: "string", enum: ["OPEN", "CLOSED"], example: "OPEN" },
            deadline: { type: "string", format: "date-time", nullable: true },
            companyId: { type: "integer", example: 1 },
            departmentId: { type: "integer", nullable: true, example: 1 },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        JobRequest: {
          type: "object",
          required: ["title", "description", "employmentType"],
          properties: {
            title: { type: "string", example: "Backend Developer" },
            description: { type: "string", example: "Zhvillim dhe mirembajtje e API-ve" },
            location: { type: "string", nullable: true, example: "Prishtine" },
            salaryMin: { type: "number", format: "float", nullable: true, example: 900 },
            salaryMax: { type: "number", format: "float", nullable: true, example: 1500 },
            employmentType: {
              type: "string",
              enum: ["FULL_TIME", "PART_TIME", "INTERNSHIP", "CONTRACT"],
              example: "FULL_TIME",
            },
            status: { type: "string", enum: ["OPEN", "CLOSED"], example: "OPEN" },
            deadline: { type: "string", format: "date-time", nullable: true },
            departmentId: { type: "integer", nullable: true, example: 1 },
          },
        },
        JobRequirement: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            requirementText: { type: "string", example: "3+ vite pervoje me Node.js" },
            requirementType: {
              type: "string",
              enum: ["EDUCATION", "EXPERIENCE", "SKILL", "CERTIFICATION", "OTHER"],
              example: "EXPERIENCE",
            },
            isRequired: { type: "boolean", example: true },
            jobId: { type: "integer", example: 1 },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Skill: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            name: { type: "string", example: "Node.js" },
            category: {
              type: "string",
              enum: ["TECHNICAL", "SOFT", "LANGUAGE", "TOOL"],
              example: "TECHNICAL",
            },
            description: { type: "string", nullable: true, example: "Backend JavaScript runtime" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        JobSkill: {
          type: "object",
          properties: {
            jobId: { type: "integer", example: 1 },
            skillId: { type: "integer", example: 1 },
            importanceLevel: {
              type: "string",
              enum: ["REQUIRED", "PREFERRED"],
              example: "REQUIRED",
            },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Role: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            name: { type: "string", example: "HR Manager" },
            description: { type: "string", nullable: true, example: "Menaxhon aplikimet" },
            companyId: { type: "integer", example: 1 },
            isActive: { type: "boolean", example: true },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Permission: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            name: { type: "string", example: "users:manage" },
            description: { type: "string", nullable: true, example: "Menaxhon perdoruesit" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        RolePermission: {
          type: "object",
          properties: {
            roleId: { type: "integer", example: 1 },
            permissionId: { type: "integer", example: 1 },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        CandidateProfile: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            bio: { type: "string", nullable: true, example: "Backend developer" },
            phone: { type: "string", example: "+38344111222" },
            location: { type: "string", nullable: true, example: "Prishtine" },
            experienceYears: { type: "integer", example: 3 },
            education: { type: "string", nullable: true, example: "BSc Computer Science" },
            cvUrl: { type: "string", nullable: true, example: "https://example.com/cv.pdf" },
            linkedinUrl: { type: "string", nullable: true, example: "https://linkedin.com/in/arta" },
            githubUrl: { type: "string", nullable: true, example: "https://github.com/arta" },
            userId: { type: "integer", example: 1 },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        CandidateProfileRequest: {
          type: "object",
          required: ["phone", "userId"],
          properties: {
            bio: { type: "string", nullable: true, example: "Backend developer" },
            phone: { type: "string", example: "+38344111222" },
            location: { type: "string", nullable: true, example: "Prishtine" },
            experienceYears: { type: "integer", example: 3 },
            education: { type: "string", nullable: true, example: "BSc Computer Science" },
            cvUrl: { type: "string", nullable: true, example: "https://example.com/cv.pdf" },
            linkedinUrl: { type: "string", nullable: true, example: "https://linkedin.com/in/arta" },
            githubUrl: { type: "string", nullable: true, example: "https://github.com/arta" },
            userId: { type: "integer", example: 1 },
          },
        },
        CandidateSkill: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            candidateProfileId: { type: "integer", example: 1 },
            skillId: { type: "integer", example: 1 },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        CandidateSkillRequest: {
          type: "object",
          required: ["candidateProfileId", "skillId"],
          properties: {
            candidateProfileId: { type: "integer", example: 1 },
            skillId: { type: "integer", example: 1 },
          },
        },
        ApplicationStatus: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            name: { type: "string", example: "PENDING" },
            description: { type: "string", nullable: true, example: "Aplikimi eshte ne pritje" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Application: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            userId: { type: "integer", example: 1 },
            candidateProfileId: { type: "integer", example: 1 },
            jobId: { type: "integer", example: 1 },
            statusId: { type: "integer", example: 1 },
            companyId: { type: "integer", example: 1 },
            coverLetter: { type: "string", nullable: true, example: "Jam i interesuar per kete pozite." },
            appliedAt: { type: "string", format: "date-time" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        SavedJob: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            userId: { type: "integer", example: 1 },
            jobId: { type: "integer", example: 1 },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        SavedJobRequest: {
          type: "object",
          required: ["userId", "jobId"],
          properties: {
            userId: { type: "integer", example: 1 },
            jobId: { type: "integer", example: 1 },
          },
        },
        ApplicationReview: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            applicationId: { type: "integer", example: 1 },
            reviewerId: { type: "integer", example: 2 },
            rating: { type: "integer", example: 5 },
            comment: { type: "string", nullable: true, example: "Kandidat i mire" },
            recommendation: {
              type: "string",
              enum: ["RECOMMENDED", "NOT_RECOMMENDED", "NEUTRAL"],
              example: "RECOMMENDED",
            },
            companyId: { type: "integer", example: 1 },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        ApplicationResponse: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            applicationId: { type: "integer", example: 1 },
            senderId: { type: "integer", example: 2 },
            message: { type: "string", example: "Ju lutem ejani ne interviste." },
            status: {
              type: "string",
              enum: ["ACCEPTED", "REJECTED", "INTERVIEW", "PENDING"],
              example: "INTERVIEW",
            },
            companyId: { type: "integer", example: 1 },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        ApplicationDocument: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            applicationId: { type: "integer", example: 1 },
            documentType: {
              type: "string",
              enum: ["CV", "COVER_LETTER", "CERTIFICATE", "OTHER"],
              example: "CV",
            },
            fileName: { type: "string", example: "cv.pdf" },
            fileUrl: { type: "string", example: "https://example.com/cv.pdf" },
            companyId: { type: "integer", example: 1 },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Notification: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            userId: { type: "integer", example: 1 },
            title: { type: "string", example: "Aplikimi u perditesua" },
            message: { type: "string", example: "Statusi i aplikimit ka ndryshuar." },
            type: {
              type: "string",
              enum: ["APPLICATION", "RESPONSE", "SYSTEM"],
              example: "APPLICATION",
            },
            isRead: { type: "boolean", example: false },
            companyId: { type: "integer", example: 1 },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        AuditLog: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            userId: { type: "integer", nullable: true, example: 1 },
            action: { type: "string", example: "CREATE" },
            entity: { type: "string", example: "Job" },
            entityId: { type: "integer", nullable: true, example: 1 },
            description: { type: "string", nullable: true, example: "U krijua nje pozite pune" },
            companyId: { type: "integer", example: 1 },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        ApiResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            message: { type: "string", example: "Operacioni u krye me sukses" },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string", example: "Ndodhi nje gabim" },
            error: { type: "string", example: "Error message" },
          },
        },
      },
    },
    tags: [
      { name: "Auth", description: "Autentikimi dhe autorizimi" },
      { name: "Users", description: "Menaxhimi i perdoruesve" },
      { name: "Companies", description: "Menaxhimi i kompanive" },
      { name: "Jobs", description: "Pozitat e punes" },
      { name: "Candidate Profiles", description: "Profilet e kandidateve" },
      { name: "Candidate Skills", description: "Aftesite e kandidateve" },
      { name: "Applications", description: "Aplikimet" },
      { name: "Application Statuses", description: "Statuset e aplikimeve" },
      { name: "Saved Jobs", description: "Punet e ruajtura" },
      { name: "AI", description: "Analiza me AI" },
    ],
    paths: {
      "/auth/register": {
        post: {
          summary: "Regjistro perdorues te ri",
          tags: ["Auth"],
          requestBody: jsonBody("#/components/schemas/AuthRegisterRequest"),
          responses: {
            201: successResponse("Perdoruesi u regjistrua me sukses"),
            400: successResponse("Kerkesa nuk eshte valide", "#/components/schemas/ErrorResponse"),
          },
        },
      },
      "/auth/login": {
        post: {
          summary: "Kycu ne sistem",
          tags: ["Auth"],
          requestBody: jsonBody("#/components/schemas/AuthLoginRequest"),
          responses: {
            200: successResponse("Kyqja u krye me sukses"),
            401: successResponse("Kredencialet nuk jane valide", "#/components/schemas/ErrorResponse"),
          },
        },
      },
      "/users": {
        get: {
          summary: "Merr listen e perdoruesve",
          tags: ["Users"],
          security: bearerAuth,
          responses: {
            200: arrayResponse("#/components/schemas/User"),
          },
        },
        post: {
          summary: "Krijo perdorues",
          tags: ["Users"],
          security: bearerAuth,
          requestBody: jsonBody("#/components/schemas/UserRequest"),
          responses: {
            201: successResponse("Perdoruesi u krijua", "#/components/schemas/User"),
          },
        },
      },
      "/users/{id}": {
        get: {
          summary: "Merr perdorues sipas ID-se",
          tags: ["Users"],
          security: bearerAuth,
          parameters: [idParameter()],
          responses: {
            200: successResponse("Sukses", "#/components/schemas/User"),
            404: successResponse("Perdoruesi nuk u gjet", "#/components/schemas/ErrorResponse"),
          },
        },
        put: {
          summary: "Perditeso perdorues",
          tags: ["Users"],
          security: bearerAuth,
          parameters: [idParameter()],
          requestBody: jsonBody("#/components/schemas/UserRequest"),
          responses: {
            200: successResponse("Perdoruesi u perditesua", "#/components/schemas/User"),
          },
        },
        delete: {
          summary: "Fshi perdorues",
          tags: ["Users"],
          security: bearerAuth,
          parameters: [idParameter()],
          responses: {
            200: successResponse("Perdoruesi u fshi", "#/components/schemas/ApiResponse"),
          },
        },
      },
      "/companies": {
        get: {
          summary: "Merr listen e kompanive",
          tags: ["Companies"],
          security: bearerAuth,
          responses: {
            200: arrayResponse("#/components/schemas/Company"),
          },
        },
        post: {
          summary: "Krijo kompani",
          tags: ["Companies"],
          requestBody: jsonBody("#/components/schemas/CompanyRequest"),
          responses: {
            201: successResponse("Kompania u krijua", "#/components/schemas/Company"),
          },
        },
      },
      "/companies/me": {
        get: {
          summary: "Merr kompanine time",
          tags: ["Companies"],
          security: bearerAuth,
          responses: {
            200: successResponse("Sukses", "#/components/schemas/Company"),
          },
        },
      },
      "/companies/{id}": {
        get: {
          summary: "Merr kompani sipas ID-se",
          tags: ["Companies"],
          security: bearerAuth,
          parameters: [idParameter()],
          responses: {
            200: successResponse("Sukses", "#/components/schemas/Company"),
            404: successResponse("Kompania nuk u gjet", "#/components/schemas/ErrorResponse"),
          },
        },
        put: {
          summary: "Perditeso kompani",
          tags: ["Companies"],
          security: bearerAuth,
          parameters: [idParameter()],
          requestBody: jsonBody("#/components/schemas/CompanyRequest"),
          responses: {
            200: successResponse("Kompania u perditesua", "#/components/schemas/Company"),
          },
        },
        delete: {
          summary: "Deaktivizo kompani",
          tags: ["Companies"],
          security: bearerAuth,
          parameters: [idParameter()],
          responses: {
            200: successResponse("Kompania u deaktivizua", "#/components/schemas/ApiResponse"),
          },
        },
      },
      "/jobs": {
        get: {
          summary: "Merr listen e pozitave te punes",
          tags: ["Jobs"],
          parameters: [
            { name: "search", in: "query", schema: { type: "string" } },
            { name: "status", in: "query", schema: { type: "string", enum: ["OPEN", "CLOSED"] } },
            {
              name: "employmentType",
              in: "query",
              schema: { type: "string", enum: ["FULL_TIME", "PART_TIME", "INTERNSHIP", "CONTRACT"] },
            },
            { name: "location", in: "query", schema: { type: "string" } },
            { name: "companyId", in: "query", schema: { type: "integer" } },
            { name: "departmentId", in: "query", schema: { type: "integer" } },
            { name: "departmentName", in: "query", schema: { type: "string" } },
            { name: "skillId", in: "query", schema: { type: "integer" } },
            { name: "skill", in: "query", schema: { type: "string" } },
            { name: "skillCategory", in: "query", schema: { type: "string" } },
            { name: "minSalary", in: "query", schema: { type: "number" } },
            { name: "maxSalary", in: "query", schema: { type: "number" } },
            { name: "deadlineFrom", in: "query", schema: { type: "string", format: "date" } },
            { name: "deadlineTo", in: "query", schema: { type: "string", format: "date" } },
            { name: "page", in: "query", schema: { type: "integer", default: 1 } },
            { name: "limit", in: "query", schema: { type: "integer", default: 10 } },
            { name: "sortBy", in: "query", schema: { type: "string", default: "createdAt" } },
            { name: "sortOrder", in: "query", schema: { type: "string", enum: ["ASC", "DESC"], default: "DESC" } },
          ],
          responses: {
            200: arrayResponse("#/components/schemas/Job"),
          },
        },
        post: {
          summary: "Krijo pozite pune",
          tags: ["Jobs"],
          security: bearerAuth,
          requestBody: jsonBody("#/components/schemas/JobRequest"),
          responses: {
            201: successResponse("Pozita u krijua", "#/components/schemas/Job"),
          },
        },
      },
      "/candidate-profiles": {
        get: {
          summary: "Merr listen e profileve te kandidateve",
          tags: ["Candidate Profiles"],
          responses: {
            200: arrayResponse("#/components/schemas/CandidateProfile"),
          },
        },
        post: {
          summary: "Krijo profil kandidati",
          tags: ["Candidate Profiles"],
          requestBody: jsonBody("#/components/schemas/CandidateProfileRequest"),
          responses: {
            201: successResponse("Profili u krijua", "#/components/schemas/CandidateProfile"),
          },
        },
      },
      "/candidate-profiles/{id}": {
        get: {
          summary: "Merr profil kandidati sipas ID-se",
          tags: ["Candidate Profiles"],
          parameters: [idParameter()],
          responses: {
            200: successResponse("Sukses", "#/components/schemas/CandidateProfile"),
            404: successResponse("Profili nuk u gjet", "#/components/schemas/ErrorResponse"),
          },
        },
        put: {
          summary: "Perditeso profil kandidati",
          tags: ["Candidate Profiles"],
          parameters: [idParameter()],
          requestBody: jsonBody("#/components/schemas/CandidateProfileRequest"),
          responses: {
            200: successResponse("Profili u perditesua", "#/components/schemas/CandidateProfile"),
          },
        },
        delete: {
          summary: "Fshi profil kandidati",
          tags: ["Candidate Profiles"],
          parameters: [idParameter()],
          responses: {
            200: successResponse("Profili u fshi", "#/components/schemas/ApiResponse"),
          },
        },
      },
      "/candidate-skills": {
        get: {
          summary: "Merr aftesite e kandidateve",
          tags: ["Candidate Skills"],
          responses: {
            200: arrayResponse("#/components/schemas/CandidateSkill"),
          },
        },
        post: {
          summary: "Shto aftesi per kandidat",
          tags: ["Candidate Skills"],
          requestBody: jsonBody("#/components/schemas/CandidateSkillRequest"),
          responses: {
            201: successResponse("Aftesia u shtua", "#/components/schemas/CandidateSkill"),
          },
        },
      },
      "/candidate-skills/{id}": {
        delete: {
          summary: "Fshi aftesi kandidati",
          tags: ["Candidate Skills"],
          parameters: [idParameter()],
          responses: {
            200: successResponse("Aftesia u fshi", "#/components/schemas/ApiResponse"),
          },
        },
      },
      "/application-statuses": {
        get: {
          summary: "Merr listen e statuseve te aplikimeve",
          tags: ["Application Statuses"],
          responses: {
            200: arrayResponse("#/components/schemas/ApplicationStatus"),
          },
        },
      },
      "/applications": {
        get: {
          summary: "Merr listen nga route i aplikimeve",
          description: "Ky route aktualisht kthen statuset sipas implementimit ekzistues ne applicationRoutes.js.",
          tags: ["Applications"],
          responses: {
            200: arrayResponse("#/components/schemas/ApplicationStatus"),
          },
        },
      },
      "/api/saved-jobs": {
        post: {
          summary: "Ruaj nje pozite pune",
          tags: ["Saved Jobs"],
          requestBody: jsonBody("#/components/schemas/SavedJobRequest"),
          responses: {
            201: successResponse("Pozita u ruajt", "#/components/schemas/SavedJob"),
            400: successResponse("Pozita eshte ruajtur me pare", "#/components/schemas/ErrorResponse"),
          },
        },
      },
      "/api/saved-jobs/user/{userId}": {
        get: {
          summary: "Merr punet e ruajtura per nje perdorues",
          tags: ["Saved Jobs"],
          parameters: [idParameter("userId", "ID e perdoruesit")],
          responses: {
            200: arrayResponse("#/components/schemas/SavedJob"),
          },
        },
      },
      "/api/saved-jobs/{id}": {
        delete: {
          summary: "Hiq nje pune nga te ruajturat",
          tags: ["Saved Jobs"],
          parameters: [idParameter()],
          responses: {
            200: successResponse("Puna u hoq nga te ruajturat", "#/components/schemas/ApiResponse"),
            404: successResponse("Puna e ruajtur nuk u gjet", "#/components/schemas/ErrorResponse"),
          },
        },
      },
      "/ai/analyze-application/{applicationId}": {
        post: {
          summary: "Analizo aplikim me AI",
          tags: ["AI"],
          security: bearerAuth,
          parameters: [idParameter("applicationId", "ID e aplikimit")],
          responses: {
            200: successResponse("Analiza u krye"),
          },
        },
      },
    },
  },
  apis: [],
};

export const swaggerSpec = swaggerJSDoc(options);

export const setupSwagger = (app) => {
  app.get("/api-docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });

  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
