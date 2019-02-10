FORMAT: 1A

# TODO List REST-API仕様書

## Group Todo List API

### TODO List取得 [/todo{?done,subject,detail}]

#### 検索して取得 [GET]

* パラメータの指定がない場合、すべてのTODO一覧を返却
* doneのみ指定された場合、条件に一致する一覧を返却
* subjectのみ指定された場合、その文字列が含む一覧を返却
* detailのみ指定された場合、その文字列が含む一覧を返却
* 複数条件が指定された場合、AND検索して条件に一致した一覧を返却

+ Parameters
    + done: false (boolean) - 完了かどうか(false:未完、true:完了)
    + subject: 宿題 (string) - タイトル
    + detail: 算数ドリル (string) - 内容
+ Response 200 (application/json)
    + Attributes
        + result: 600 (number, required) - 実行結果(0:正常、1以上:エラー)
        + message: 未実装です (string, required) - エラーメッセージなど
        + data (array[object], fixed-type)
            + (object)
                + done: false (boolean, required) - 完了かどうか(false:未完、true:完了)
                + subject: 宿題 (string, required) - タイトル
                + detail: 算数ドリル (string, required) - 内容


### Subject List取得 [/todo/subjects{?done}]

#### タイトル一覧を取得 [GET]

* TODOのタイトルを全件取得する
* パラメータにdoneがある場合、絞り込んで返却

+ Parameters 
    + done: false (boolean) - 完了かどうか(false:未完、true:完了)

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
            + done: false (boolean, required) - 完了かどうか(false:未完、true:完了)
            + subject: 宿題 (string, required) - タイトル
            + detail: 算数ドリル (string, required) - 内容


### TODO 追加 [/todo]

#### TODOを1件追加 [POST]

* 指定された値で新規にTODOを追加する
* 既に存在しているタイトルが指定された場合、上書き保存する
* リクエストBodyにsubjectかdetail、もしくはどちらも指定がない場合はエラーを返す(100)
* リクエストBodyにdoneがなければ「false」を追加する
* リクエストBodyのdoneに指定された値が正しく処理出来なかった場合はエラーを返す(100)

+ Request (application/json)
    + Headers
        Accept: application/json
    + Attributes
        + done: false (boolean) - 完了かどうか(false:未完、true:完了)
        + subject: 宿題 (string, required) - タイトル
        + detail: 算数ドリル (string, required) - 内容

+ Response 200 (application/json)
    + Attributes
        + result: 600 (number, required) - 実行結果(0:正常、1以上:エラー)
        + message: 未実装です (string, required) - エラーメッセージなど

### TODO 更新 [/todo/{subject}]

#### 指定されたTODOを1件更新 [PUT]

* 指定されたタイトルに該当するTODOを更新する
* リクエストBodyにある項目のみ更新する(done、subject、detailのいずれか、もしくは複数)
* URLパラメータにsubjectがない場合はエラーを返す(100)
* リクエストBodyに対象のパラメータが何も指定されてなかったらエラーを返す(100)
* 更新後のタイトルが既に存在しているタイトルの場合、エラーを返す(200)
* ただし、更新前後のタイトルが同じ場合はエラーとせず更新する

+ Parameters 
    + subject: 宿題 (string, required) - タイトル

+ Request (application/json)
    + Headers
            Accept: application/json
    + Attributes
        + done: false (boolean) - 完了かどうか(false:未完、true:完了)
        + subject: 宿題 (string, required) - タイトル
        + detail: 漢字ドリルP10～11 (string, required) - 内容

+ Response 200 (application/json)
    + Attributes
        + result: 600 (number, required) - 実行結果(0:正常、1以上:エラー)
        + message: 未実装です (string, required) - エラーメッセージなど

### TODO複数削除 [/todo{?done,subject,detail}]

#### TODOを複数件削除する [DELETE]

* パラメータに指定がない場合は全件削除
* パラメータの指定がない場合、すべてのTODO一覧を削除
* doneのみ指定された場合、条件に一致する一覧を削除
* subjectのみ指定された場合、その文字列が含む一覧を削除
* detailのみ指定された場合、その文字列が含む一覧を削除
* 複数条件が指定された場合、AND検索して条件に一致した一覧を削除

+ Parameters
    + done: false (boolean) - 完了かどうか(false:未完、true:完了)
    + subject: 宿題 (string) - タイトル
    + detail: 算数ドリル (string) - 内容

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
