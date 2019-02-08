FORMAT: 1A

# TODO List REST-API仕様書

## Group Todo List API

### TODO List取得 [/todo{?subject,detail}]

#### 検索して取得 [GET]

* パラメータの指定がない場合、すべてのTODO一覧を返却。
* subjectのみ指定された場合、その文字列が含む一覧を返却。
* detailのみ指定された場合、その文字列が含む一覧を返却。
* subjectとdetailが指定された場合、どちらも含む一覧を返却。

+ Parameters 
    + subject: 宿題 (string, optional) - タイトル
    + detail: 算数ドリル (string, optional) - 内容
+ Response 200 (application/json)
    + Attributes
        + result: 600 (number, required) - 実行結果(0:正常、1以上:エラー)
        + message: 未実装です (string, required) - エラーメッセージなど
        + data (array[object], fixed-type)
            + (object)
                + subject: 宿題 (string, required) - タイトル
                + detail: 算数ドリル (string, required) - 内容


### Subject List取得 [/todo/subjects]

#### タイトル一覧を取得 [GET]

* TODOのタイトルを全件取得する

+ Response 200 (application/json)
    + Attributes
        + result: 600 (number, required) - 実行結果(0:正常、1以上:エラー)
        + message: 未実装です (string, required) - エラーメッセージなど
        + data (array) - タイトル一覧
            + 宿題 (string)
            + 自習 (string)

### 特定のTODOを取得 [/todo/{subject}]

#### 指定したタイトルのTODOを取得 [GET]

* 指定したタイトルに一致するTODOを返却

+ Parameters 
    + subject: 宿題 (string, required) - タイトル
+ Response 200 (application/json)
    + Attributes
        + result: 600 (number, required) - 実行結果(0:正常、1以上:エラー)
        + message: 未実装です (string, required) - エラーメッセージなど
        + data (object)
            + subject: 宿題 (string, required) - タイトル
            + detail: 算数ドリル (string, required) - 内容


### TODO 追加 [/todo]

#### TODOを1件追加 [POST]

* 指定された値で新規にTODOを追加する
* 既に存在しているタイトルが指定された場合、上書き保存する
* リクエストBodyにsubjectかdetail、もしくはどちらも指定がない場合はエラーを返す(100)

+ Request (application/json)
    + Headers
        Accept: application/json
    + Attributes
        + subject: 宿題 (string, required) - タイトル
        + : 算数ドリル (string, required) - 内容

+ Response 200 (application/json)
    + Attributes
        + result: 600 (number, required) - 実行結果(0:正常、1以上:エラー)
        + message: 未実装です (string, required) - エラーメッセージなど

### TODO 更新 [/todo/{subject}]

#### 指定されたTODOを1件更新 [PUT]

* 指定されたタイトルに該当するTODOを更新する
* URLパラメータにsubjectがない場合はエラーを返す(100)
* リクエストBodyにsubjectかdetail、もしくはどちらも指定がない場合はエラーを返す(100)
* 更新後のタイトルが既に存在しているタイトルの場合、エラーを返す(200)
* ただし、更新前後のタイトルが同じ場合はエラーとせず更新する

+ Parameters 
    + subject: 宿題 (string, required) - タイトル

+ Request (application/json)
    + Headers
            Accept: application/json
    + Attributes
        + subject: 宿題 (string, required) - タイトル
        + detail: 漢字ドリルP10～11 (string, required) - 内容

+ Response 200 (application/json)
    + Attributes
        + result: 600 (number, required) - 実行結果(0:正常、1以上:エラー)
        + message: 未実装です (string, required) - エラーメッセージなど

### 全TODOを削除 [/todo]

#### TODOを全件削除する [DELETE]

* 全てのTODOを一括削除

+ Response 200 (application/json)
    + Attributes
        + result: 600 (number, required) - 実行結果(0:正常、1以上:エラー)
        + message: 未実装です (string, required) - エラーメッセージなど

### 特定のTODOを削除 [/todo/{subject}]

#### 指定したタイトルのTODOを削除 [DELETE]

* 指定したタイトルに一致するTODOを削除

+ Parameters 
    + subject: 宿題 (string, required) - タイトル
+ Response 200 (application/json)
    + Attributes
        + result: 600 (number, required) - 実行結果(0:正常、1以上:エラー)
        + message: 未実装です (string, required) - エラーメッセージなど


## Group Support API

### API一覧取得 [/api]

#### APIのエンドポイントと概要を取得 [GET]

* 「TODO List REST-API」のAPI一覧を取得できる

+ Response 200 (application/json)
    + Attributes
        + list (array[object], required, fixed-type)
            + (object)
                + method: DELETE (string, required) - HTTPメソッド
                + endpoint: /todo (string, required) - エンドポイントURL
                + summary: TODOを全件削除 (string, required) - エンドポイントURL

### API仕様書表示 [/api/spec]

#### API仕様書を取得する [GET]

* ブラウザからリクエストする前提
* API仕様書のWebページに転送する

+ Response 302 (text/html)


### エラー一覧取得 [/api/error]

#### エラー番号と概要一覧を取得 [GET]

* 本APIにて発行するエラー番号とその概要一覧を取得できる

+ Response 200 (application/json)
    + Attributes
        + list (array[object], required, fixed-type)
            + (object)
                + number: 500 (number, required) - HTTPメソッド
                + summary: データベース実行エラー (string, required) - エンドポイントURL
