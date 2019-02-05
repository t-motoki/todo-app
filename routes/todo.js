"use strict";

const express = require('express');
const router = express.Router();
const log4js = require('log4js');
log4js.configure('./log4js.config.json');

const contentType = 'application/json; Accept-Charset=utf-8';

// MongoDB関連
const MongoClient = require("mongodb").MongoClient;
const MongoUrl = "mongodb://localhost:27017";

//logger
const systemLogger = log4js.getLogger();

// todo一覧取得
router.get('/', function(req, res, next) {

  let param = {};
  MongoClient.connect(MongoUrl, {useNewUrlParser: true}, (error, client) => {

      // コレクションの取得
      const collection = client.db("todo").collection("list");
  
      // コレクションに含まれるドキュメントをすべて取得
      collection.find({}).toArray((error, items) => {

        param = items
        res.header('Content-Type', contentType)
        res.send(param);
        
        console.log("error:"+error);
        console.log(items);
        for(let item of items){
          console.log(item.priority);
          console.log(item.subject);
          console.log(item.detail);
        }
        client.close();
      });
  
  });

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
