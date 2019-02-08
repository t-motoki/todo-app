"use strict";

const express = require('express');
const router = express.Router();
const apilist = require('./apilist');
const errorlist = require('./errorlist');

// TOPページ
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Express' });
});

// API一覧を取得
router.get('/api', (req, res, next) => {
  const result = JSON.stringify({list:apilist}, null , "\t");;
  res.header('Content-Type', 'application/json; charset=utf-8')
  res.send(result);
});

// API仕様書に転送
router.get('/api/spec', (req, res, next) => {
  res.redirect('../../api_spec.html');
});

// エラー一覧を取得
router.get('/api/error', (req, res, next) => {
  const result = JSON.stringify({list:errorlist}, null , "\t");;
  res.header('Content-Type', 'application/json; charset=utf-8')
  res.send(result);
});

module.exports = router;
