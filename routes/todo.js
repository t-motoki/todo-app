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
};

// 正規表現で問題になる可能性がある文字列をエスケープ処理を実装
RegExp.escape = s => s.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');


// todo一覧取得
router.get('/', (req, res) => {

  // クエリの生成(どちらも指定されるとANDとなる)
  let query = {}; // 全検索
  let querylog = {};  // ログに正規表現をそのまま出力できないので別途用意
  if("subject" in req.query){
    const subject = RegExp.escape(req.query.subject);
    query["subject"] = new RegExp(subject);
    querylog["subject"] = `\\/${subject}\\/`;
  }
  if("detail" in req.query){
    const detail = RegExp.escape(req.query.detail);
    query["detail"] = new RegExp(detail);
    querylog["detail"] = `\\/${detail}\\/`;
  }
  systemLogger.debug(`query:${JSON.stringify(querylog)}`);

  // todo一覧を取得(IDとバージョンは取得しない)
  let result = JSON.parse(JSON.stringify(result_template));
  item.find(query, { _id:0, __v:0 }, (err, docs) => {
    res.header('Content-Type', contentType);
    if (err){
      result["result"] = 500;
      result["message"] = err.errmsg;
      systemLogger.error(`result:${result["result"]}, message:${result["message"].replace(/\r?\n/g,'')}`);
    }else{
      // 正しく取得できた場合に格納
      result["data"] = JSON.parse(JSON.stringify(docs));
    }
    
    // 結果を返却
    res.send(result);
  });
});

// タイトル一覧取得
router.get('/subjects', (req, res) =>  {

  let result = JSON.parse(JSON.stringify(result_template));
  item.distinct("subject", (err, docs) => {
    res.header('Content-Type', contentType);
    if (err){
      result["result"] = 500;
      result["message"] = err.errmsg;
      systemLogger.error(`result:${result["result"]}, message:${result["message"].replace(/\r?\n/g,'')}`);
    }else{
      // 正しく取得できた場合に格納
      result["data"] = JSON.parse(JSON.stringify(docs));
    }
    // 結果を返却
    res.send(result);
  });
});

// todoを取得(タイトル指定して1件取得)
router.get('/:subject', (req, res) => {

  // クエリの生成
  const query = {subject:req.params.subject};
  systemLogger.debug(`query:${JSON.stringify(query)}`);

  // todoを取得(IDとバージョンは取得しない)
  let result = JSON.parse(JSON.stringify(result_template));
  item.findOne(query, { _id:0, __v:0 }, (err, docs) => {
    res.header('Content-Type', contentType);
    if (err){
      result["result"] = 500;
      result["message"] = err.errmsg;
      systemLogger.error(`result:${result["result"]}, message:${result["message"].replace(/\r?\n/g,'')}`);
    }else{
      if(docs){
        // 正しく取得できた場合に格納
        result["data"] = JSON.parse(JSON.stringify(docs));
      }else{
        // ない場合は空のオブジェクトを返す
        result["data"] = {};
      }
    }
    
    // 結果を返却
    res.send(result);
  });

});

// todo追加
router.post('/', (req, res, next) => {

  // 引数が揃っていることを確認
  let check = false;
  if(!("subject" in req.body)){
    if(!("detail" in req.body)){
      res["errorfactor"] = "subject & detail";
    }else{
      res["errorfactor"] = "subject";
    }
  }else if(!("detail" in req.body)){
    res["errorfactor"] = "detail";
  }else{
    // 問題なし
    check = true;
  }

  if(!check){
    // エラー処理
    next();
  }else{
    // クエリの生成
    const query = {subject:req.body.subject};
    systemLogger.debug(`query:${JSON.stringify(query)}`);

    // 登録データの作成
    const register = {subject:req.body["subject"],detail:req.body["detail"]};
    systemLogger.debug(`register data:${JSON.stringify(register)}`);

    // 登録処理(無ければ追加、あれば更新)
    let result = JSON.parse(JSON.stringify(result_template));
    item.updateOne( query, register, {upsert: true}, err => {
      res.header('Content-Type', contentType);
      if (err){
        result["result"] = 500;
        result["message"] = err.errmsg;
        systemLogger.error(`result: , message:${(err.errmsg).replace(/\r?\n/g,'')}`);
      } 
      res.send(result);
    });
  }

}, (req, res) => {

  // 引数が足りていないためエラー
  let result = {
    result: 100,
    message: `${res["errorfactor"]}が指定されていません。`
  };
  systemLogger.error(`result:${result["result"]}, message:${result["message"].replace(/\r?\n/g,'')}`);

  // エラーを返却
  res.header('Content-Type', contentType);
  res.send(result);

});

// todo更新で引数がない場合にエラーを返す
router.put('/', (req, res) => {

  // 引数が足りていないためエラー
  let result = {
    result: 100,
    message: `subjectが指定されていません。`
  };
  systemLogger.error(`result:${result["result"]}, message:${result["message"].replace(/\r?\n/g,'')}`);

  // エラーを返却
  res.header('Content-Type', contentType);
  res.send(result);
});

// 指定したtodo更新
router.put('/:subject', (req, res, next) => {


  // 引数が揃っていることを確認
  let check = false;
  if(!("subject" in req.body)){
    if(!("detail" in req.body)){
      res["errorfactor"] = "subject & detail";
    }else{
      res["errorfactor"] = "subject";
    }
  }else if(!("detail" in req.body)){
    res["errorfactor"] = "detail";
  }else{
    // 問題なし
    check = true;
  }

  if(!check){
    // エラー処理
    next();
  }else{
    // クエリの生成
    const query = {subject:req.params.subject};
    systemLogger.debug(`query:${JSON.stringify(query)}`);

    // 登録データの作成
    const register = {subject:req.body["subject"],detail:req.body["detail"]};
    systemLogger.debug(`register data:${JSON.stringify(register)}`);

    // 登録処理(無ければ追加、あれば更新)
    let result = JSON.parse(JSON.stringify(result_template));
    item.updateOne( query, register, (err, docs) => {
      res.header('Content-Type', contentType);
      if (err){
        if(err.code === 11000){
          // 既に存在しているタイトルに変更しようとした
          result["result"] = 200;
        }else{
          // その他実行エラー
          result["result"] = 500;
        }
        result["message"] = err.errmsg;
        systemLogger.error(`result: , message:${(err.errmsg).replace(/\r?\n/g,'')}`);
      }

      // DBに存在していないタイトルが更新対象に指定された
      if(docs.n === 0){
        result["result"] = 300;
        result["message"] = `subject:${req.params.subject}はデータベースに存在しません`;
        systemLogger.error(`result: , message:${result["message"].replace(/\r?\n/g,'')}`);
      }

      res.send(result);
    });
  }
}, (req, res) => {

  // 引数が足りていないためエラー
  let result = {
    result: 100,
    message: `更新データの${res["errorfactor"]}が指定されていません。`
  };
  systemLogger.error(`result:${result["result"]}, message:${result["message"].replace(/\r?\n/g,'')}`);

  // エラーを返却
  res.header('Content-Type', contentType);
  res.send(result);

});

// todo全件削除
router.delete('/', (req, res) => {

  let result = JSON.parse(JSON.stringify(result_template));
  item.remove({}, err => {
    res.header('Content-Type', contentType);
    if (err){
      result["result"] = 500;
      result["message"] = err.errmsg;
      systemLogger.error(`result:${result["result"]}, message:${result["message"].replace(/\r?\n/g,'')}`);
    }
    // 結果を返却
    res.send(result);
  });
});

// 指定したtodo削除
router.delete('/:subject', (req, res) => {

  // クエリの生成
  const query = {subject:req.params.subject};
  systemLogger.debug(`query:${JSON.stringify(query)}`);

  // 1検削除
  let result = JSON.parse(JSON.stringify(result_template));
  item.remove(query, err => {
    res.header('Content-Type', contentType);
    if (err){
      result["result"] = 500;
      result["message"] = err.errmsg;
      systemLogger.error(`result:${result["result"]}, message:${result["message"].replace(/\r?\n/g,'')}`);
    }
    // 結果を返却
    res.send(result);
  });
});

module.exports = router;
