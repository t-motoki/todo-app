# todo-app
  
## todoを管理する為のREST-APIです。  
  
  
  
### ◆開発環境
  
  
* Node.js v8.12.0  
* mongodb v4.0  
  
利用時は下記コマンドでインストールしてください。  
  
```npm:command
   npm install
```
  
### ◆DB構造
  
* データベース名:todo
* コレクション名:items
* データモデル:  
  ```
    {
      done    : todoが完了したかどうか(boolean)(false:未完、true:完了)
      subject : todoのタイトル(string):unique
      detail  : todoの内容(string)
    }
  ```
  
### ◆REST-API起動コマンド
  
```npm:command
   npm server
```
  
REST-API起動後、下記URLにブラウザでアクセスすると、
API仕様書を確認することが出来ます。
  
http://localhost:3000/api/spec
　 
　 
  
以下のデモ用Webで簡単な動作を確認出来ます。
　 
http://localhost:3000/
