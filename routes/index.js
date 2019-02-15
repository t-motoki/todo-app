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

// API仕様書に転送
router.get('/api/spec', (req, res) => {
  res.redirect('../../api_spec.html');
});

// エラー一覧を取得
router.get('/api/error', (req, res) => {
  const result = JSON.stringify({list:errorlist}, null , "\t");
  res.header('Content-Type', 'application/json; charset=utf-8');
  res.send(result);
});

// テスト用API(500)
router.get('/test/broken', (req, res) => {
    try {
      throw new Error("BROKEN");
    }
    catch (err) {
      next(err);
    }
});

module.exports = router;
