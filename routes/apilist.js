"use strict";

const apilist = [
    {method:"GET", endpoint:"/todo" , summary:"TODOリストの取得。query指定すると部分一致で絞り込める"},
    {method:"GET", endpoint:"/todo/subjects" , summary:"TODOリストのタイトル一覧を取得"},
    {method:"GET", endpoint:"/todo/{subject}" , summary:"指定したタイトルのTODOを取得"},
    {method:"POST", endpoint:"/todo" , summary:"TODOリストを登録。すでにある場合は上書き"},
    {method:"PUT", endpoint:"/todo/{subject}" , summary:"指定したタイトルのTODOを更新"},
    {method:"DELETE", endpoint:"/todo" , summary:"TODOを全件削除"},
    {method:"DELETE", endpoint:"/todo/{subject}" , summary:"指定したタイトルのTODOを削除"},
    {method:"GET", endpoint:"/api" , summary:"APIの概要一覧を取得"},
    {method:"GET", endpoint:"/api/spec" , summary:"API仕様書を表示"},
    {method:"GET", endpoint:"/api/error" , summary:"エラー内容一覧を表示"}
  ]

module.exports = apilist;