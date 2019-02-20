'use strict';

const apilist = [
  { method: 'GET', endpoint: '/todo', summary: 'TODO一覧取得。query指定で絞り込み' },
  { method: 'GET', endpoint: '/todo/subjects', summary: 'TODOタイトル一覧取得。query指定で絞り込み' },
  { method: 'GET', endpoint: '/todo/{subject}', summary: 'TODO1件取得。指定したタイトルのTODOを取得' },
  { method: 'POST', endpoint: '/todo', summary: 'TODO登録。すでにある場合は上書き' },
  { method: 'PUT', endpoint: '/todo/{subject}', summary: 'TODO更新。指定したタイトルのTODOを更新' },
  { method: 'DELETE', endpoint: '/todo', summary: 'TODO複数削除。query指定で絞り込み' },
  { method: 'DELETE', endpoint: '/todo/{subject}', summary: 'TODO1件削除。指定したタイトルのTODOを削除' },
  { method: 'GET', endpoint: '/api', summary: 'API概要一覧取得' },
  { method: 'GET', endpoint: '/api/spec', summary: 'API仕様書表示' },
  { method: 'GET', endpoint: '/api/error', summary: 'エラー内容一覧取得' }
];

module.exports = apilist;