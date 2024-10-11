const { Router } = require('express');
const { body } = require('express-validator');
const validateRequest = require('../middlewares/validate-request.js');
const {hashPassword, verifyPassword}= require('../utils/bcrypt.js')
const Admin = require('../models/admin-model.js');
const Task = require('../models/task-model.js');
const AcceptedTask = require('../models/accepted-task-model.js');
const RejectedTask = require('../models/rejected-task-model.js')
const generateToken = require('../utils/generate-token.js');
const { authAdmin } = require('../middlewares/validate-auth.js');
const BadRequestError = require('../errors/bad-request-error.js');

const router = Router();

router.post('/register', [
    body('firstName')
        .trim()
        .notEmpty()
        .withMessage('You must supply first name'),
    body('lastName')
        .trim()
        .notEmpty()
        .withMessage('You must supply last name'),
    body('email')
        .trim()
        .isEmail()
        .withMessage('Email must be valid'),
    body('password')
        .trim()
        .notEmpty()
        .withMessage('You must supply password')
], validateRequest, async (req, res, next) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        const isExistingAdmin = await Admin.findOne({ email });
        if (isExistingAdmin) {
            next(new BadRequestError('Email is already register'));
            return;
        }
        const hashedPassword= await hashPassword(password);
        console.log(hashedPassword);
        const admin = new Admin({ firstName, lastName, email, password: hashedPassword });
        const result = await admin.save();
        req.session = { token: generateToken({ id: admin._id, role: "admin" }) };
        res.send(result);
    }
    catch (error) {
        console.log(error);
        res.status(500).send('Something went wrong :(');
    }
});


router.post('/login', [
    body('email')
        .trim()
        .isEmail()
        .withMessage('Email must be valid'),
    body('password')
        .trim()
        .notEmpty()
        .withMessage('You must supply password')
], validateRequest, async (req, res) => {
    const { email, password } = req.body;

    try {
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(404).send('Email or password is wrong.');
        }

        const isPasswordValid = await verifyPassword(password, admin.password);
        if (!isPasswordValid) {
            return res.status(404).send('Email or password is wrong.');
        }
        const { password: _, __v, ...adminWithoutPassword } = admin.toObject();

        req.session = { token: generateToken({ id: admin._id, role: "admin" }) };

        res.send(adminWithoutPassword);
    } catch (error) {
        res.status(500).send('Something went wrong.');
    }
});



router.get('/assignments', authAdmin, async (req, res) => {
    const tasks = await Task.find({ adminId: req.userId });
    res.send(tasks);
})

router.post('/assignments/:id/accept', authAdmin, async (req, res, next) => {
    const taskId = req.params.id;
    const adminId = req.userId;

    try {
        const existingTask = await AcceptedTask.findOne({ taskId });

        if (existingTask) {
            return res.status(400).send({ message: 'Task has already been accepted' });
        }

        const taskReviewed = new AcceptedTask({ taskId, adminId });

        const result = await taskReviewed.save();
        res.status(200).send(result);
    } catch (error) {
        res.status(500).send({ message: 'Error accepting assignment', error });
    }

})

router.post('/assignments/:id/reject', authAdmin, async (req, res, next) => {
    const taskId = req.params.id;
    const adminId = req.userId;

    try {
        const existingTask = await RejectedTask.findOne({ taskId });

        if (existingTask) {
            return res.status(400).send({ message: 'Task has already been rejected' });
        }

        const taskRevied = new RejectedTask({ taskId, adminId });
        const result = await taskRevied.save();
        res.status(200).send(result);
    } catch (error) {
        res.status(500).send({ message: 'Error rejecting assignment', error });
    }

})


module.exports = router;
