const express = require('express');
const router = express.Router();

// todo一覧取得
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// タイトル＋ID一覧取得
router.get('/title', function(req, res, next) {
  res.send('respond with a resource');
});

// todo追加
router.post('/', function(req, res, next) {
  res.send('respond with a resource');
});

//todo更新
router.put('/', function(req, res, next) {
  res.send('respond with a resource');
});

// todo削除
router.delete('/', function(req, res, next) {
  res.send('respond with a resource');
});


module.exports = router;
