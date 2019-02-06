"use strict";

const express = require('express');
const router = express.Router();
const log4js = require('log4js');
log4js.configure('./log4js.config.json');

const contentType = 'application/json; Accept-Charset=utf-8';

// db model
const item = require('../model');

//logger
const systemLogger = log4js.getLogger();

// todo一覧取得
router.get('/', function(req, res, next) {

  let param = {};
  item.find({}, function(err, docs) {
    if (err) console.error(err.errmsg)
    param = docs;
    console.log(param);
    for(let doc of param){
      console.log(doc.subject);
      console.log(doc.detail);
    }
    res.header('Content-Type', contentType)
    res.send(param);
  });
});

// タイトル一覧取得
router.get('/subject', function(req, res, next) {
  res.send('respond with a resource');
});

// todoを取得(タイトル指定)
router.get('/:subject', function(req, res, next) {
  let param = {"result":"Hello "+ req.params.subject + " !"}; ;
  res.header('Content-Type', contentType)
  res.send(param);
});

// todo追加
router.post('/', function(req, res, next) {
  res.send('respond with a resource');
});

//todo更新
router.put('/:subject', function(req, res, next) {
  res.send('respond with a resource');
});

// todo削除
router.delete('/', function(req, res, next) {
  res.send('respond with a resource');
});


module.exports = router;
