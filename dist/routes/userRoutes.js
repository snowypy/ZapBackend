"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const uuid_1 = require("uuid");
const userModel_1 = require("../models/userModel");
const inviteCodeModel_1 = require("../models/inviteCodeModel");
const dotenv = __importStar(require("dotenv"));
const bcrypt_1 = __importDefault(require("bcrypt"));
dotenv.config();
const SALT_ROUNDS = 10;
const router = (0, express_1.Router)();
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const user = yield userModel_1.User.findOne({ email });
    if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
    }
    const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
    if (!isPasswordValid) {
        res.status(401).json({ message: 'Invalid password' });
        return;
    }
    const jwt = require('jsonwebtoken');
    const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET || (0, uuid_1.v4)(), { expiresIn: '7d' });
    res.json({ success: `Welcome back, ${user.username}`, token, userId: `${user._id}` }).status(200);
}));
router.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password, inviteCode } = req.body;
    const validInvite = yield inviteCodeModel_1.InviteCode.findOne({ code: inviteCode });
    if (!validInvite) {
        res.status(400).json({ message: 'Invalid invite code' });
        return;
    }
    const existingUser = yield userModel_1.User.findOne({ email });
    if (existingUser) {
        res.status(400).json({ message: 'Email in use' });
        return;
    }
    const hashedPassword = yield bcrypt_1.default.hash(password, SALT_ROUNDS);
    const newUser = yield userModel_1.User.create({ username, email, password: hashedPassword, inviteCode });
    res.status(201).json({ success: 'Signed up, redirecting to login page...', user: newUser });
}));
router.post('/profile-picture', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, profilePictureUrl } = req.body;
    const user = yield userModel_1.User.findByIdAndUpdate(userId, { profilePictureUrl }, { new: true });
    if (user) {
        res.json({ message: 'Profile updated', user });
    }
    else {
        res.status(404).json({ message: 'No user found' });
    }
}));
router.put('/change-username', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, username } = req.body;
    const user1 = yield userModel_1.User.findById(userId);
    if (user1) {
        if (username === user1.username) {
            res.status(400).json({ message: 'Username cannot be the same as the old username' });
            return;
        }
        const existingUsername = yield userModel_1.User.findOne({ username: username });
        if (existingUsername) {
            res.status(400).json({ message: 'Username in use' });
            return;
        }
        const user = yield userModel_1.User.findByIdAndUpdate(userId, { username: username }, { new: true });
        res.json({ success: `Your username has been changed. Hello ${username}!`, user });
    }
    else {
        res.status(404).json({ message: 'No user found' });
    }
}));
router.put('/change-password', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, oldPassword, newPassword } = req.body;
    if (oldPassword === newPassword) {
        res.status(400).json({ message: 'New password cannot be the same as the old password' });
        return;
    }
    const user1 = yield userModel_1.User.findById(userId);
    if (!user1) {
        res.status(404).json({ message: 'No user found' });
        return;
    }
    if (!(yield bcrypt_1.default.compare(oldPassword, user1.password))) {
        res.status(401).json({ message: 'Invalid old password' });
        return;
    }
    const hashedPassword = yield bcrypt_1.default.hash(newPassword, SALT_ROUNDS);
    const user = yield userModel_1.User.findByIdAndUpdate(userId, { password: hashedPassword }, { new: true });
    if (!user) {
        res.status(404).json({ message: 'No user found' });
        return;
    }
    res.json({ success: 'Your password has been updated. Make sure to store is safely', user });
}));
router.get('/:userId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const user = yield userModel_1.User.findById(userId);
    if (user) {
        res.json(user);
    }
    else {
        res.status(404).json({ message: 'No user found' });
    }
}));
exports.default = router;
