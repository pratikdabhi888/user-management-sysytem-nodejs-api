const express = require('express');
const expressJwt = require('express-jwt');
const config = require('../config');
const userRoutes = require('./user/user.routes');
const authRoutes = require('./auth/auth.routes');
const vyakarRoutes = require('./vyakarAdmin/vyakarAdmin.routes');

const router = express.Router(); // eslint-disable-line new-cap

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) => res.send('OK'));

// mount auth routes at /auth
router.use('/auth', authRoutes);

// Validating all the APIs with jwt token.
router.use(expressJwt({ secret: config.jwtSecret }));

// If jwt is valid, storing user data in local session.
router.use((req, res, next) => {
  const authorization = req.header('authorization');
  res.locals.session = JSON.parse(Buffer.from((authorization.split(' ')[1]).split('.')[1], 'base64').toString()); // eslint-disable-line no-param-reassign
  next();
});

// mount user routes at /users
router.use('/users', userRoutes);

// mount user routes at secret/vyakarAdmin
router.use('/secret/vyakarAdmin', vyakarRoutes);

module.exports = router;
