const { Router } = require('express');
const authRouter = Router();

const authController = require('../controllers/authController');
const { registerValidation, loginValidation } = require("../middleware/authValidator");
const handleValidationErrors = require("../middleware/handleValidationErrors");

authRouter.post('/register', registerValidation, handleValidationErrors, authController.register);
authRouter.post('/login', loginValidation, handleValidationErrors, authController.login);

module.exports = authRouter;
