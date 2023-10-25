"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = void 0;
const cors_1 = __importDefault(require("@fastify/cors"));
const jwt_1 = __importDefault(require("@fastify/jwt"));
const fastify_1 = __importDefault(require("fastify"));
const fastify_bcrypt_1 = __importDefault(require("fastify-bcrypt"));
const dotenv_1 = require("dotenv");
const path_1 = __importDefault(require("path"));
const authRoutes_1 = require("./routes/authRoutes");
const company_1 = require("./routes/company");
const statusRoutes_1 = require("./routes/statusRoutes");
const init = () => {
    const app = (0, fastify_1.default)({ logger: true });
    const envFilePath = process.env.NODE_ENV === "production" ? ".env.prod" : ".env";
    (0, dotenv_1.configDotenv)({
        path: path_1.default.resolve(__dirname, envFilePath),
    });
    app.register(cors_1.default, {
        // origin: ['http://localhost:3333'],
        origin: [],
    });
    app.register(fastify_bcrypt_1.default, {
        saltWorkFactor: 10,
    });
    app.register(jwt_1.default, {
        secret: process.env.JWT_SECRET_KEY || "123s4567885699",
    });
    app.register(authRoutes_1.authRoutes);
    app.register(statusRoutes_1.statusRoutes);
    app.register(company_1.companies);
    return app;
};
exports.init = init;
if (require.main === module) {
    (0, exports.init)()
        .listen({
        port: 3333,
    })
        .then(() => {
        console.log("running...");
    });
}
