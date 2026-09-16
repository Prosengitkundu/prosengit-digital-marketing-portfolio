'use strict';
const { fail } = require('../utils/helpers');

/** Require a logged-in admin session for the route (API and admin pages). */
function requireAuth(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  }
  // API requests get JSON; page requests get a redirect to the admin login.
  // Use originalUrl so routes mounted under /api are still detected as API.
  if (req.originalUrl.startsWith('/api')) {
    return fail(res, 'Unauthorized. Please log in.', 401);
  }
  return res.redirect('/admin/login');
}

/** Attach the authenticated user for optional routes (e.g. partial auth). */
function attachUser(req, res, next) {
  req.user = req.session && req.session.user ? req.session.user : null;
  next();
}

/** Mark the current user as logged in on the session. */
function loginSession(req, user) {
  req.session.user = {
    id: user.id,
    username: user.username,
    name: user.name,
    role: user.role
  };
  req.session.cookie.originalMaxAge = 7 * 24 * 60 * 60 * 1000; // 7 days
}

module.exports = { requireAuth, attachUser, loginSession };
