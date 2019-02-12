"use strict";

const errorlist = [
  {number:  0, summary:"エラーなし"},
  {number:100, summary:"入力パラメータ不足"},
  {number:101, summary:"入力パラメータ不正(キャストエラー)"},
  {number:102, summary:"入力パラメータ不正(文字サイズオーバー)"},
  {number:200, summary:"既に存在しているタイトルに変更しようとした"},
  {number:300, summary:"更新対象が存在しない"},
  {number:500, summary:"データベース実行エラー"},
  {number:600, summary:"未実装API"}
];

module.exports = errorlist;