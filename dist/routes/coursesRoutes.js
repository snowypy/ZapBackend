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
const courseModel_1 = require("../models/courseModel");
const flashcardModel_1 = require("../models/flashcardModel");
const router = (0, express_1.Router)();
router.post('/create', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description, creatorId, isPrivate } = req.body;
    try {
        const newCourse = yield courseModel_1.Course.create({ name, description, creator: creatorId, isPrivate });
        res.status(201).json({ message: 'Course created', course: newCourse });
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating course', error });
    }
}));
router.post('/join/:courseId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { courseId } = req.params;
    const { userId } = req.body;
    try {
        const course = yield courseModel_1.Course.findById(courseId);
        if (course && !course.participants.includes(userId)) {
            course.participants.push(userId);
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
router.get('/:courseId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { courseId } = req.params;
    try {
        const course = yield courseModel_1.Course.findById(courseId).populate('creator participants invites');
        if (course) {
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
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const courses = yield courseModel_1.Course.find().populate('creator participants invites');
        res.json({ courses });
    }
    catch (error) {
        res.status(500).json({ message: 'Error retrieving courses', error });
    }
}));
router.post('/invite/:courseId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { courseId } = req.params;
    const { userId } = req.body;
    try {
        const course = yield courseModel_1.Course.findById(courseId);
        if (course && course.isPrivate && !course.invites.includes(userId)) {
            course.invites.push(userId);
            yield course.save();
            res.json({ message: 'Invite sent', course });
        }
        else {
            res.status(404).json({ message: 'Course not found or user already invited' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Error sending invite', error });
    }
}));
router.post('/accept-invite/:courseId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { courseId } = req.params;
    const { userId } = req.body;
    try {
        const course = yield courseModel_1.Course.findById(courseId);
        if (course && course.invites.includes(userId)) {
            course.invites = course.invites.filter(id => id.toString() !== userId);
            if (!course.participants.includes(userId)) {
                course.participants.push(userId);
            }
            yield course.save();
            res.json({ message: 'Invite accepted', course });
        }
        else {
            res.status(404).json({ message: 'Invite not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Error accepting invite', error });
    }
}));
router.get('/invites/:userId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    try {
        const courses = yield courseModel_1.Course.find({ invites: userId }).populate('creator participants invites');
        res.json({ courses });
    }
    catch (error) {
        res.status(500).json({ message: 'Error retrieving invites', error });
    }
}));
router.get('/created/:userId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    try {
        const courses = yield courseModel_1.Course.find({ creator: userId }).populate('creator participants invites');
        res.json({ courses });
    }
    catch (error) {
        res.status(500).json({ message: 'Error retrieving user courses', error });
    }
}));
router.post('/:courseId/flashcards/:flashcardId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { flashcardId } = req.params;
        const flashcard = yield flashcardModel_1.Flashcard.findById(flashcardId);
        if (!flashcard) {
            res.status(404).json({ error: 'Flashcard not found (${flashcardId})' });
            return;
        }
        res.json(flashcard);
    }
    catch (error) {
        const { flashcardId } = req.params;
        res.status(500).json({ error: `Failed to get flashcard (${flashcardId})` });
    }
}));
router.post('/:courseId/flashcards', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { question, answer } = req.body;
        const { courseId } = req.params;
        const flashcard = new flashcardModel_1.Flashcard({
            question,
            answer,
            courseId,
        });
        yield flashcard.save();
        res.status(201).json(flashcard);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to create flashcard' });
    }
}));
router.get('/:courseId/flashcards', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { courseId } = req.params;
        const flashcards = yield flashcardModel_1.Flashcard.find({ courseId });
        res.json(flashcards);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to get all flashcards' });
    }
}));
exports.default = router;
