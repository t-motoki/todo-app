"use strict";

const errorlist = {
  NO_ERROR         : {num:  0, summary:"エラーなし"},
  E_PRM_NOTENOUGH  : {num:100, summary:"入力パラメータ不足"},
  E_PRM_TYPECAST   : {num:101, summary:"入力パラメータ不正(キャストエラー)"},
  E_PRM_SIZEOVER   : {num:102, summary:"入力パラメータ不正(文字サイズオーバー)"},
  E_PRM_PROHIBITED : {num:103, summary:"入力パラメータ不正(禁止文字)"},
  E_SRH_HAVETITLE  : {num:200, summary:"既に存在しているタイトルに変更しようとした"},
  E_SRH_NOTTERGET  : {num:300, summary:"更新対象が存在しない"},
  E_RUN_DATABASE   : {num:500, summary:"データベース実行エラー"},
  E_UNMOUNTED_API  : {num:600, summary:"未実装API"}
};

module.exports = errorlist;