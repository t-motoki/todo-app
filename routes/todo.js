"use strict";

const express = require('express');
const router = express.Router();
const EL = require('./errorlist');

//logger
const log4js = require('log4js');
log4js.configure('./log4js.config.json');
const systemLogger = log4js.getLogger();

// データベースモデル
const item = require('../model');

// レスポンス情報
const contentType = 'application/json; Accept-Charset=utf-8';
const result_template = {
  result:EL.NO_ERROR.num,
  message:""
};

/* eslint-disable */
// 正規表現で問題になる可能性がある文字列をエスケープ処理を実装
RegExp.escape = s => s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
/* eslint-enable */

// 文字列をBooleanに変換
const toBoolean = data => data.toLowerCase() === "true";

// 条件付きクエリ作成
const createConditionalQuery = reqQuery => {

  // クエリの生成(複数指定されるとANDとなる)
  let query = {}; // 全検索
  let querylog = {};  // ログに正規表現をそのまま出力できないので別途用意

  // タイトル
  if("subject" in reqQuery){
    // 部分一致
    const subject = RegExp.escape(reqQuery.subject);
    query["subject"] = new RegExp(subject);
    querylog["subject"] = `/${subject}/`;
  }

  // 内容
  if("detail" in reqQuery){
    // 部分一致
    const detail = RegExp.escape(reqQuery.detail);
    query["detail"] = new RegExp(detail);
    querylog["detail"] = `/${detail}/`;
  }

  // 完了フラグ
  if("done" in reqQuery){
    if(reqQuery.done==="true" || reqQuery.done==="false"){
      // 正しい指定時のみ条件に入れる
      query["done"] = toBoolean(reqQuery.done);
      querylog["done"] = query["done"];
    }
  }

  // 返却
  systemLogger.debug(`query:${JSON.stringify(querylog)}`);
  return query;

};

// ページオプションの追加
const createPagenationOptions = (reqQuery,originalOptions) => {

  // 1ページに表示する数を取得(デフォルト1000)
  let pagers = parseInt((process.env.PAGERS || '1000'),10);
  if(isNaN(pagers)){
    pagers = 1000;
  }
  
  let options = {};

  // ページオプション以外のオプション設定をマージ
  if(typeof originalOptions === "object"){
    if(Object.keys(originalOptions).length>0){
      options = JSON.parse(JSON.stringify(originalOptions));
    }
  }

  // ページ設定
  if("page" in reqQuery){
    if(Math.sign(reqQuery["page"])>=1){
      let page = Number(reqQuery["page"]);

      // 1ページ内で取得できる数の制御
      if("limit" in reqQuery){
        if(Math.sign(reqQuery["limit"])>=1){
          pagers = Number(reqQuery["limit"]);
        }
      }

      options["skip"] = pagers * (page - 1);
      options["limit"] = pagers;
    }
  }
  systemLogger.debug(`options:${JSON.stringify(options)}`);

  return options;

};

// todo一覧取得
router.get('/', (req, res) => {

  // クエリ作成
  const query = createConditionalQuery(req.query);

  // オプション作成
  const options = createPagenationOptions(req.query, {sort:{ subject: 1 }});

  // todo一覧を取得(IDとバージョンは取得しない)
  let result = JSON.parse(JSON.stringify(result_template));
  item.find(query, {_id:0, __v:0}, options, (err, docs) => {
    res.header('Content-Type', contentType);
    if (err){
      result["result"] = EL.E_RUN_DATABASE.num;
      result["message"] = "データベース実行時にエラーが発生しました。詳細 => ";
      result["message"] += JSON.stringify(err);
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

  // クエリ作成
  const query = createConditionalQuery(req.query);

  // オプション作成
  const options = createPagenationOptions(req.query, {sort:{ subject: 1 }});

  // クエリ実行
  let result = JSON.parse(JSON.stringify(result_template));
  // item.find(query).distinct("subject", (err, docs) => {
  item.find(query, {_id:0, __v:0}, options, (err, docs) => {
    res.header('Content-Type', contentType);
    if (err){
      result["result"] = EL.E_RUN_DATABASE.num;
      result["message"] = "データベース実行時にエラーが発生しました。詳細 => ";
      result["message"] += JSON.stringify(err);
      systemLogger.error(`result:${result["result"]}, message:${result["message"].replace(/\r?\n/g,'')}`);
    }else{
      // 正しく取得できた場合に格納
      result["data"] = [];
      for(let item of docs){
        result["data"].push(item.subject);
      }
    }

    // 結果を返却
    res.send(result);
  });
});

// todoを取得(タイトル指定して1件取得)
router.get('/item', (req, res, next) => {

  if(!("subject" in req.query)){
    // queryにタイトルの指定がない場合エラー
    next();
  }else{
    // クエリの生成
    const query = {subject:req.query.subject};
    systemLogger.debug(`query:${JSON.stringify(query)}`);

    // todoを取得(IDとバージョンは取得しない)
    let result = JSON.parse(JSON.stringify(result_template));
    item.findOne(query, { _id:0, __v:0 }, (err, docs) => {
      res.header('Content-Type', contentType);
      if (err){
        result["result"] = EL.E_RUN_DATABASE.num;
        result["message"] = "データベース実行時にエラーが発生しました。詳細 => ";
        result["message"] += JSON.stringify(err);
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
  }

}, (req, res) => {

  // 引数が足りていないためエラー
  let result = {
    result: EL.E_PRM_NOTENOUGH.num,
    message: `subjectが指定されていません。`
  };
  systemLogger.error(`result:${result["result"]}, message:${result["message"].replace(/\r?\n/g,'')}`);

  // エラーを返却
  res.header('Content-Type', contentType);
  res.send(result);

});

// todo追加
router.post('/', (req, res, next) => {

  // 必須の引数が揃っていることを確認
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
    const register = {done:false,subject:req.body["subject"],detail:req.body["detail"]};
    if("done" in req.body){
      // 完了フラグが指定されていたら変更
      register["done"] = req.body.done;
    }

    systemLogger.debug(`register data:${JSON.stringify(register)}`);

    // 登録処理(無ければ追加、あれば更新)
    let result = JSON.parse(JSON.stringify(result_template));
    item.updateOne( query, register, {upsert: true, runValidators: true}, err => {
      res.header('Content-Type', contentType);
      if (err){
        if(err.name === "CastError"){
          // doneが不正な文字列だった場合、キャストエラーとなる
          result["result"] = EL.E_PRM_TYPECAST.num;
          result["message"] = "doneにその文字列は使えません。詳細 => ";
        }else if(err.name === "ValidationError"){
          let isMaxlength = true;
          if("subject" in err.errors){
            if(err.errors.subject.properties.type==="required"){
              // subjectは空白禁止
              result["result"] = EL.E_PRM_PROHIBITED.num;
              result["message"] = "subjectに空白は登録できません。詳細 => ";
              isMaxlength = false;
            }
          }
          if(isMaxlength){
            // 文字数超過
            result["result"] = EL.E_PRM_SIZEOVER.num;
            result["message"] = "登録しようとしている文字数が超過しています。詳細 => ";
          }
        }else{
          result["result"] = EL.E_RUN_DATABASE.num;
          result["message"] = "データベース実行時にエラーが発生しました。詳細 => ";
        }
        result["message"] += JSON.stringify(err);
        systemLogger.error(`result:${result["result"]} , message:${result["message"].replace(/\r?\n/g,'')}`);
      } 
      res.send(result);
    });
  }

}, (req, res) => {

  // 引数が足りていないためエラー
  let result = {
    result: EL.E_PRM_NOTENOUGH.num,
    message: `${res["errorfactor"]}が指定されていません。`
  };
  systemLogger.error(`result:${result["result"]}, message:${result["message"].replace(/\r?\n/g,'')}`);

  // エラーを返却
  res.header('Content-Type', contentType);
  res.send(result);

});

// 指定したtodo更新
router.put('/', (req, res, next) => {

  // 更新対象が指定されてない場合はエラーとする
  if(!("subject" in req.query)){
    const result = {
      result: EL.E_PRM_NOTENOUGH.num,
      message: `更新対象となる元のsubjectが指定されていません。`
    };
    systemLogger.error(`result:${result["result"]}, message:${result["message"]}`);
    // エラーを返却
    res.header('Content-Type', contentType);
    return res.send(result);
  }

  // 登録データの作成
  let register = {};
  if("subject" in req.body){
    register["subject"] = req.body["subject"];
  }
  if("detail" in req.body){
    register["detail"] = req.body["detail"];
  }
  if("done" in req.body){
    register["done"] = req.body["done"];
  }

  if(!Object.keys(register).length){  
    // 何も指定されていなければエラー
    next();
  }else{
    // クエリの生成
    const query = {subject:req.query.subject};
    systemLogger.debug(`query:${JSON.stringify(query)}`);

    // 登録データをログ出力
    systemLogger.debug(`register data:${JSON.stringify(register)}`);

    // 登録処理(無ければ追加、あれば更新)
    let result = JSON.parse(JSON.stringify(result_template));
    item.updateOne( query, register, {runValidators: true}, (err, docs) => {
      res.header('Content-Type', contentType);
      if (err){
        if(err.name === "CastError"){
          // 不正な文字列だった場合、キャストエラーとなる
          result["result"] = EL.E_PRM_TYPECAST.num;
          result["message"] = "doneにその文字列は使えません。詳細 => ";
        }else if(err.name === "ValidationError"){
          let isMaxlength = true;
          if("subject" in err.errors){
            if(err.errors.subject.properties.type==="required"){
              // subjectは空白禁止
              result["result"] = EL.E_PRM_PROHIBITED.num;
              result["message"] = "subjectに空白は登録できません。詳細 => ";
              isMaxlength = false;
            }
          }
          if(isMaxlength){
            // 文字数超過
            result["result"] = EL.E_PRM_SIZEOVER.num;
            result["message"] = "登録しようとしている文字数が超過しています。詳細 => ";
          }
        }else if(err.code === 11000){
          // 既に存在しているタイトルに変更しようとした
          result["result"] = EL.E_SRH_HAVETITLE.num;
          result["message"] = "変更後に指定されたsubjectは、別に存在しています。詳細 => ";
        }else{
          // その他実行エラー
          result["result"] = EL.E_RUN_DATABASE.num;
          result["message"] = "データベース実行時にエラーが発生しました。詳細 => ";
        }
        result["message"] += JSON.stringify(err);
        systemLogger.error(`result: , message:${result["message"].replace(/\r?\n/g,'')}`);
      }else{
        // DBに存在していないタイトルが更新対象に指定された
        if(docs.n === 0){
          result["result"] = EL.E_SRH_NOTTERGET.num;
          result["message"] = `更新対象subject:"${req.query.subject}"はデータベースに存在しません`;
          systemLogger.error(`result:${result["result"]} , message:${result["message"].replace(/\r?\n/g,'')}`);
        }
      }
      res.send(result);
    });
  }
}, (req, res) => {

  // 引数が足りていないためエラー
  const result = {
    result: EL.E_PRM_NOTENOUGH.num,
    message: `登録用データ何も有効な更新データが1つも指定されていません。`
  };
  systemLogger.error(`result:${result["result"]}, message:${result["message"]}`);

  // エラーを返却
  res.header('Content-Type', contentType);
  res.send(result);

});

// todo複数削除
router.delete('/', (req, res) => {

  // クエリ作成
  const query = createConditionalQuery(req.query);

  // 複数削除
  let result = JSON.parse(JSON.stringify(result_template));
  item.remove(query, err => {
    res.header('Content-Type', contentType);
    if (err){
      result["result"] = EL.E_RUN_DATABASE.num;
      result["message"] = "データベース実行時にエラーが発生しました。詳細 => ";
      result["message"] += JSON.stringify(err);
      systemLogger.error(`result:${result["result"]}, message:${result["message"].replace(/\r?\n/g,'')}`);
    }
    // 結果を返却
    res.send(result);
  });
});

// todo1件削除
router.delete('/item', (req, res, next) => {

  if(!("subject" in req.query)){
    // queryにタイトルの指定がない場合エラー
    next();
  }else{
    // クエリの生成
    const query = {subject:req.query.subject};
    systemLogger.debug(`query:${JSON.stringify(query)}`);

    // 1検削除
    let result = JSON.parse(JSON.stringify(result_template));
    item.remove(query, err => {
      res.header('Content-Type', contentType);
      if (err){
        result["result"] = EL.E_RUN_DATABASE.num;
        result["message"] = "データベース実行時にエラーが発生しました。詳細 => ";
        result["message"] += JSON.stringify(err);
        systemLogger.error(`result:${result["result"]}, message:${result["message"].replace(/\r?\n/g,'')}`);
      }
      // 結果を返却
      res.send(result);
    });
  }
}, (req, res) => {

  // 引数が足りていないためエラー
  let result = {
    result: EL.E_PRM_NOTENOUGH.num,
    message: `subjectが指定されていません。`
  };
  systemLogger.error(`result:${result["result"]}, message:${result["message"].replace(/\r?\n/g,'')}`);

  // エラーを返却
  res.header('Content-Type', contentType);
  res.send(result);

});



module.exports = router;
