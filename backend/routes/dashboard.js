'use strict';
const express = require('express');
const { db } = require('../db');
const { ok } = require('../utils/helpers');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// GET /api/dashboard  (admin)
router.get('/', requireAuth, (req, res) => {
  const count = (table) => db.prepare(`SELECT COUNT(*) AS c FROM ${table}`).get().c;

  const recentProjects = db.prepare(
    'SELECT id, title, category, published, updated_at FROM projects ORDER BY updated_at DESC, id DESC LIMIT 5'
  ).all();
  const recentMessages = db.prepare(
    'SELECT id, name, email, subject, status, created_at FROM contact_messages ORDER BY id DESC LIMIT 5'
  ).all();
  const recentPosts = db.prepare(
    'SELECT id, title, category, published, publish_date FROM blog_posts ORDER BY publish_date DESC, id DESC LIMIT 5'
  ).all();

  ok(res, {
    counts: {
      projects: count('projects'),
      services: count('services'),
      blog_posts: count('blog_posts'),
      testimonials: count('testimonials'),
      contact_messages: count('contact_messages'),
      media: count('media'),
      pages: count('pages')
    },
    contact: {
      new: db.prepare("SELECT COUNT(*) AS c FROM contact_messages WHERE status='new'").get().c
    },
    recentProjects,
    recentMessages,
    recentPosts,
    admin: req.session.user
  });
});

module.exports = router;
