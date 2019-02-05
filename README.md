# todo-app
  
## todoを管理する為のREST-APIです。  
  
  
  
### ◆開発環境
  
  
* Node.js v10.15.0  
* mongodb v4.0  
  
利用時は下記コマンドでインストールしてください。

```npm:command
   npm install
```

### ◆DB構造
  
* データベース名:todo
* コレクション名:list
* データモデル:  
  ```
    {
      priority : 優先度(integer):unique
      subject  : todoのタイトル(string)
      detail   : todoの内容(string)
    }
  ```
  
### ◆実行

```npm:command
   npm start
```

下記URLで接続可能となります。

http://localhost:3000

