"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const courseRoutes_1 = __importDefault(require("./routes/courseRoutes"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
const mongoUri = process.env.MONGO_URI || '';
mongoose_1.default.connect(mongoUri, {
    useUnifiedTopology: true,
}).then(() => {
    console.log('db connected');
}).catch(err => {
    console.error('couldn\'t connect to db', err);
});
app.use(body_parser_1.default.json());
app.use('/users', userRoutes_1.default);
app.use('/admin', adminRoutes_1.default);
app.use('/courses', courseRoutes_1.default);
app.listen(PORT, () => {
    console.log(`running on port ${PORT}`);
});
