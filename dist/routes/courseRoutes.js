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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mongoose_1 = __importDefault(require("mongoose"));
const courseModel_1 = require("../models/courseModel");
const router = (0, express_1.Router)();
router.post('/create', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description, creatorId, isPrivate } = req.body;
    try {
        if (!mongoose_1.default.Types.ObjectId.isValid(creatorId)) {
            res.status(400).json({ message: 'Invalid creator ID' });
            return;
        }
        const newCourse = yield courseModel_1.Course.create({ name, description, creator: creatorId, isPrivate });
        res.status(201).json({ message: 'Course created', course: newCourse });
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating course', error });
    }
}));
router.get('/:courseId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { courseId } = req.params;
    try {
        const course = yield courseModel_1.Course.findById(courseId).populate({ path: 'creator', select: 'username' }).populate({ path: 'students', select: 'username' }).populate('invites');
        if (course) {
            courseModel_1.Course.updateOne({ _id: courseId }, { $inc: { views: 1 } });
            res.json({ course });
        }
        else {
            res.status(404).json({ message: 'Course not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Error retrieving course', error });
    }
}));
router.post('/join/:courseId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { courseId } = req.params;
    const { userId } = req.body;
    try {
        const course = yield courseModel_1.Course.findById(courseId);
        if (course && !course.students.includes(userId) && !course.isPrivate) {
            course.students.push(userId);
            yield course.save();
            res.json({ message: 'Joined course', course });
        }
        else {
            res.status(404).json({ message: 'Course not found or already joined' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Error joining course', error });
    }
}));
router.post('/invite/:courseId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { courseId } = req.params;
    const { userId } = req.body;
    try {
        const course = yield courseModel_1.Course.findById(courseId);
        if (!course) {
            res.status(404).json({ message: 'Course not found' });
            return;
        }
        if (!userId) {
            res.status(400).json({ message: 'User ID not found' });
            return;
        }
        if (!course.isPrivate) {
            res.status(400).json({ message: 'Course is not private' });
            return;
        }
        if (!course.invites.includes(userId)) {
            course.invites.push(userId);
            yield course.save();
            res.json({ message: 'Invited to course', course });
        }
        else {
            res.status(404).json({ message: 'Course not found or already invited' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Error inviting course', error });
    }
}));
router.post('/accept-invite/:courseId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { courseId } = req.params;
    const { userId } = req.body;
    try {
        const course = yield courseModel_1.Course.findById(courseId);
        if (!course) {
            res.status(404).json({ message: 'Course not found' });
            return;
        }
        if (!course.invites.includes(userId)) {
            res.status(404).json({ message: 'Invite revoked or invalid.' });
            return;
        }
        course.invites = course.invites.filter(id => id.toString() !== userId);
        course.students.push(userId);
        yield course.save();
        res.json({ message: 'Invite accepted', course });
    }
    catch (error) {
        res.status(500).json({ message: 'Error accepting invite', error });
    }
}));
exports.default = router;
