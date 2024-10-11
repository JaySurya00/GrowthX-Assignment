const { Router } = require('express');
const { body } = require('express-validator');
const validateRequest = require('../middlewares/validate-request.js');
const User = require('../models/user-model.js');
const Admin = require('../models/admin-model.js');
const Task = require('../models/task-model.js');
const generateToken = require('../utils/generate-token.js');
const { authUser } = require('../middlewares/validate-auth.js');
const BadRequestError = require('../errors/bad-request-error.js');
const { hashPassword, verifyPassword } = require('../utils/bcrypt.js');

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
        const isExistingUser = await User.findOne({ email });

        if (isExistingUser) {
            return next(new BadRequestError('Email is already registered'));
        }

        const hashedPassword = await hashPassword(password);

        const user = new User({ firstName, lastName, email, password: hashedPassword });
        const result = await user.save();

        req.session = { token: generateToken({ id: user._id, role: "user" }) };
        res.send(result);

    } catch (error) {
        console.error(error);
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
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send('Email or password is wrong.');
        }

        const isPasswordValid = await verifyPassword(password, user.password);
        if (!isPasswordValid) {
            return res.status(404).send('Email or password is wrong.');
        }

        const { password: _, __v, ...userWithoutPassword } = user.toObject();

        req.session = { token: generateToken({ id: user._id, role: "user" }) };

        res.send(userWithoutPassword);

    } catch (error) {
        console.error(error);
        res.status(500).send('Something went wrong.');
    }
});



router.get('/admins', authUser, async (req, res) => {
    try {
        const admins = await Admin.find().select(['-password', '-_id', '-__v']);
        res.send(admins);
    } catch (error) {
        res.status(500).send('Server error');
    }
});

router.post('/upload', authUser, [
    body('task')
        .trim()
        .notEmpty()
        .withMessage("Task should not be empty"),
    body('admin_email')
        .trim()
        .notEmpty()
        .isEmail()
        .withMessage("admin email is invalid")

], validateRequest, authUser, async (req, res) => {
    const userId = req.userId;
    const { _id: adminId } = await Admin.findOne({ email: req.body.admin_email }).select("_id");
    if (!adminId) {
        res.status(400).send('admin email is not found in database');
        return;
    }
    const task = new Task({ userId, task: req.body.task, adminId });
    const result = await task.save();
    res.status(200).send(result);
})

module.exports = router;
