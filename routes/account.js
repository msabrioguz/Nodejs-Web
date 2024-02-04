const express = require('express');
const router = express.Router();

const accountController = require('../controllers/account.js');

router.get('/login', accountController.getLogin);
router.post('/login', accountController.postLogin);

router.get('/register', accountController.getRegister);
router.post('/register', accountController.postRegister);

router.get('/reset-password', accountController.getReset);
router.post('/reset-password', accountController.postReset);

router.get('/logout', accountController.getLogout);
router.post('/logout', accountController.postLogout);

module.exports = router;