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
const flashcardModel_1 = require("../models/flashcardModel");
const router = (0, express_1.Router)();
router.post('/create', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { courseId, question, answer } = req.body;
    try {
        if (!mongoose_1.default.Types.ObjectId.isValid(courseId)) {
            res.status(400).json({ message: 'Invalid course ID' });
            return;
        }
        const course = yield courseModel_1.Course.findById(new mongoose_1.default.Types.ObjectId(courseId));
        if (!course) {
            res.status(404).json({ message: 'Course not found' });
            return;
        }
        const newFlashcard = yield flashcardModel_1.Flashcard.create({ question, answer });
        course.flashcards.push(newFlashcard._id);
        yield course.save();
        res.status(201).json({ message: 'Flashcard created', flashcard: newFlashcard });
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating flashcard', error });
    }
}));
router.post('/update', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { flashcardId, question, answer } = req.body;
    try {
        if (!mongoose_1.default.Types.ObjectId.isValid(flashcardId)) {
            res.status(400).json({ message: 'Invalid flashcard ID' });
            return;
        }
        const flashcard = yield flashcardModel_1.Flashcard.findById(new mongoose_1.default.Types.ObjectId(flashcardId));
        if (!flashcard) {
            res.status(404).json({ message: 'Flashcard not found' });
            return;
        }
        flashcard.question = question;
        flashcard.answer = answer;
        yield flashcard.save();
        res.status(200).json({ message: 'Flashcard updated', flashcard });
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating flashcard', error });
    }
}));
router.post('/delete', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { flashcardId } = req.body;
    try {
        if (!mongoose_1.default.Types.ObjectId.isValid(flashcardId)) {
            res.status(400).json({ message: 'Invalid flashcard ID' });
            return;
        }
        const flashcard = yield flashcardModel_1.Flashcard.findByIdAndDelete(new mongoose_1.default.Types.ObjectId(flashcardId));
        if (!flashcard) {
            res.status(404).json({ message: 'Flashcard not found' });
            return;
        }
        res.status(200).json({ message: 'Flashcard deleted', flashcard });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting flashcard', error });
    }
}));
exports.default = router;
