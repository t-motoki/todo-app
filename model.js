"use strict";

const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);  // index生成を有効化
mongoose.set('useNewUrlParser', true); // URL文言指定を有効化
const Schema = mongoose.Schema;

// Todoデータのスキーマを定義
const Item = new Schema({
  subject: { type: String, required: true, unique: true },
  detail : { type: String, required: true }
});

// DBと接続
const connection = mongoose.createConnection('mongodb://localhost:27017/todo');

// modelを作成
module.exports = connection.model('item', Item);

