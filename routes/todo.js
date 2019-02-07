"use strict";

const express = require('express');
const router = express.Router();

//logger
const log4js = require('log4js');
log4js.configure('./log4js.config.json');
const systemLogger = log4js.getLogger();

// データベースモデル
const item = require('../model');

// レスポンス情報
const contentType = 'application/json; Accept-Charset=utf-8';
const result_template = {
  result:0,
  message:""
}

// 正規表現で問題になる可能性がある文字列をエスケープ処理を実装
RegExp.escape = s => s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');


// todo一覧取得
router.get('/', (req, res, next) => {

  // クエリの生成(どちらも指定されるとANDとなる)
  let query = {}; // 全検索
  let querylog = {};  // ログに正規表現をそのまま出力できないので別途用意
  if("subject" in req.query){
    const subject = RegExp.escape(req.query.subject);
    query["subject"] = new RegExp(subject);
    querylog["subject"] = `\/${subject}\/`;
  }
  if("detail" in req.query){
    const detail = RegExp.escape(req.query.detail);
    query["detail"] = new RegExp(detail);
    querylog["detail"] = `\/${detail}\/`;
  }
  systemLogger.debug(`query:${JSON.stringify(querylog)}`);

  // todo一覧を取得(IDは取得しない)
  let result = JSON.parse(JSON.stringify(result_template));
  item.find(query, { _id:0, __v:0 }, (err, docs) => {
    res.header('Content-Type', contentType);
    if (err){
      result["result"] = 500;
      result["message"] = err.errmsg;
      systemLogger.error(err.errmsg);
    }else{
      // 正しく取得できた場合に格納
      result["data"] = JSON.parse(JSON.stringify(docs));
    }
    
    // 結果を返却
    res.send(result);
  });
});

// タイトル一覧取得
router.get('/subject', (req, res, next) =>  {

  let result = JSON.parse(JSON.stringify(result_template));
  item.distinct("subject", (err, docs) => {
    res.header('Content-Type', contentType);
    if (err){
      result["result"] = 500;
      result["message"] = err.errmsg;
      systemLogger.error(err.errmsg);
    }else{
      // 正しく取得できた場合に格納
      result["data"] = JSON.parse(JSON.stringify(docs));
    }
    // 結果を返却
    res.send(result);
  });
});

// todoを取得(タイトル指定して1件取得)
router.get('/:subject', (req, res, next) => {

  // クエリの生成
  let query = {subject:req.params.subject};
  systemLogger.debug(`query:${JSON.stringify(query)}`);

  // todo一覧を取得(IDは取得しない)
  let result = JSON.parse(JSON.stringify(result_template));
  item.findOne(query, { _id:0, __v:0 }, (err, docs) => {
    res.header('Content-Type', contentType);
    if (err){
      result["result"] = 500;
      result["message"] = err.errmsg;
      systemLogger.error(err.errmsg);
    }else{
      // 正しく取得できた場合に格納
      result["data"] = JSON.parse(JSON.stringify(docs));
    }
    
    // 結果を返却
    res.send(result);
  });

});

// todo追加
router.post('/', (req, res, next) => {
  let result = JSON.parse(JSON.stringify(result_template));
  result["result"] = 600;
  result["message"] = "未実装です";
  res.send(result);
});

// 指定したtodo更新
router.put('/:subject', (req, res, next) => {
  let result = JSON.parse(JSON.stringify(result_template));
  result["result"] = 600;
  result["message"] = "未実装です";
  res.send(result);
});

// todo全件削除
router.delete('/', (req, res, next) => {
  let result = JSON.parse(JSON.stringify(result_template));
  result["result"] = 600;
  result["message"] = "未実装です";
  res.send(result);
});

// 指定したtodo削除
router.delete('/:subject', (req, res, next) => {
  let result = JSON.parse(JSON.stringify(result_template));
  result["result"] = 600;
  result["message"] = "未実装です";
  res.send(result);
});

module.exports = router;
