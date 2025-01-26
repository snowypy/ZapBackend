"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const inviteCodeModel_1 = require("../models/inviteCodeModel");
const userModel_1 = require("../models/userModel");
const router = (0, express_1.Router)();
const generateRandomCode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let result = '';
    for (let i = 0; i < 5; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
};
router.post('/create-invite', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const code = generateRandomCode();
    try {
        const newInvite = yield inviteCodeModel_1.InviteCode.create({ code });
        res.status(201).json({ message: 'Invite code created', invite: newInvite });
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating invite code', error });
    }
}));
router.delete('/delete-invite/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const deletedInvite = yield inviteCodeModel_1.InviteCode.findByIdAndDelete(id);
        if (deletedInvite) {
            res.json({ message: 'Invite code deleted', invite: deletedInvite });
        }
        else {
            res.status(404).json({ message: 'Invite code not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting invite code', error });
    }
}));
router.get('/invite-info/:code', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { code } = req.params;
    try {
        const invite = yield inviteCodeModel_1.InviteCode.findOne({ code });
        if (invite) {
            res.json({ invite });
        }
        else {
            res.status(404).json({ message: 'Invite code not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Error retrieving invite code', error });
    }
}));
router.post('/delete-user/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const deletedUser = yield userModel_1.User.findByIdAndDelete(id);
        if (deletedUser) {
            res.json({ message: 'User deleted', user: deletedUser });
        }
        else {
            res.status(404).json({ message: 'User not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting user', error });
    }
}));
exports.default = router;
