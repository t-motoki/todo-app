"use strict";

const express = require('express');
const router = express.Router();
const apilist = require('./apilist');
const errorlist = require('./errorlist');

// TOPページ(public/index.htmがある為、ここは呼ばれない)
// router.get('/', (req, res) => {
//   res.sendFile('index.html', { root: __dirname + "/public/" });
// });

// API一覧を取得
router.get('/api', (req, res) => {
  const result = JSON.stringify({list:apilist}, null , "\t");
  res.header('Content-Type', 'application/json; charset=utf-8');
  res.send(result);
});

// API仕様書ページを表示
router.get('/api/spec', (req, res) => {
  res.sendFile('api_spec.html', { root: __dirname + "/../docs/" });
});

// エラー一覧を取得
router.get('/api/error', (req, res) => {
  const result = JSON.stringify({list:errorlist}, null , "\t");
  res.header('Content-Type', 'application/json; charset=utf-8');
  res.send(result);
});

module.exports = router;
