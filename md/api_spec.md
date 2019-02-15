FORMAT: 1A

# TODO List REST-API仕様書

## Group Todo List API

### TODO一覧取得 [/todo{?done,subject,detail,exact}]

#### TODO一覧取得 [GET]

* TODOの内容全てを一覧で返却する
* パラメータの指定がない場合、すべての一覧を返却
* doneのみ指定された場合、条件に一致する一覧を返却
* subjectのみ指定された場合、その文字列が含む一覧を返却
* exactにtrueが指定されるとsubujectのみ、完全一致検索となる
* detailのみ指定された場合、その文字列が含む一覧を返却
* 複数条件が指定された場合、AND検索して条件に一致した一覧を返却

+ Parameters
    + done: false (boolean) - 完了フラグ(false:未完、true:完了)
    + subject: 宿題 (string) - タイトルの検索条件
    + detail: 算数ドリル (string) - 内容の検索条件
    + exact: false (boolean) - タイトルの完全一致検索設定(false:未完[default]、true:完了)

+ Response 200 (application/json)
    + Attributes
        + result: 600 (number, required) - 実行結果(0:正常、1以上:エラー)
        + message: 未実装です (string, required) - エラーメッセージなど
        + data (array[object], fixed-type)
            + (object)
                + done: false (boolean, required) - 完了かどうか(false:未完、true:完了)
                + subject: 宿題 (string, required) - タイトル
                + detail: 算数ドリル (string, required) - 内容


### TODOタイトル一覧取得 [/todo/subjects{?done,subject,detail,exact}]

#### TODOタイトル一覧取得 [GET]

* TODOのタイトルのみ、一覧で返却する
* パラメータの指定がない場合、すべての一覧を返却
* doneのみ指定された場合、条件に一致する一覧を返却
* subjectのみ指定された場合、その文字列が含む一覧を返却
* exactにtrueが指定されるとsubujectのみ、完全一致検索となる
* detailのみ指定された場合、その文字列が含む一覧を返却
* 複数条件が指定された場合、AND検索して条件に一致した一覧を返却

+ Parameters 
    + done: false (boolean) - 完了フラグ(false:未完、true:完了)
    + subject: 宿題 (string) - タイトルの検索条件
    + detail: 算数ドリル (string) - 内容の検索条件
    + exact: false (boolean) - タイトルの完全一致検索設定(false:未完[default]、true:完了)

+ Response 200 (application/json)
    + Attributes
        + result: 600 (number, required) - 実行結果(0:正常、1以上:エラー)
        + message: 未実装です (string, required) - エラーメッセージなど
        + data (array) - タイトル一覧
            + 宿題 (string)
            + 自習 (string)


### TODO追加 [/todo]

#### TODO追加 [POST]

* 指定された値で新規にTODOを1件追加する
* 既に存在しているタイトルが指定された場合、上書き保存する
* リクエストBodyにsubjectかdetail、もしくはどちらも指定がない場合はエラーを返す(100)
* リクエストBodyにdoneがなければ「false」を追加する
* リクエストBodyのdoneに指定された値が正しく処理出来なかった場合はエラーを返す(101)
* リクエストBodyのsubjectは50文字まで。超えた場合はエラーを返す(102)
* リクエストBodyのdetailは255文字まで。超えた場合はエラーを返す(102)
* リクエストBodyのsubjectに空白が指定された場合はエラーを返す(103)

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

### TODO更新 [/todo/{?subject}]

#### TODO更新 [PUT]

* 指定されたタイトルに該当するTODOを1件更新する
* パラメータにsubjectがない場合はエラーを返す(100)
* リクエストBodyにある項目のみ更新する(done、subject、detailのいずれか、もしくは複数)
* 更新後のタイトルが既に存在しているタイトルの場合、エラーを返す(200)
* ただし、更新前後のタイトルが同じ場合はエラーとせず更新する
* リクエストBodyが何も指定されてない場合はエラーを返す(100)
* リクエストBodyのdoneに指定された値が正しく処理出来なかった場合はエラーを返す(101)
* リクエストBodyのsubjectは50文字まで。超えた場合はエラーを返す(102)
* リクエストBodyのdetailは255文字まで。超えた場合はエラーを返す(102)
* リクエストBodyのsubjectに空白が指定された場合はエラーを返す(103)

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

### TODO削除 [/todo{?done,subject,detail,exact}]

#### TODO削除 [DELETE]

* パラメータに指定がない場合は全件削除
* パラメータの指定がない場合、すべてのTODO一覧を削除
* doneのみ指定された場合、条件に一致する一覧を削除
* subjectのみ指定された場合、その文字列が含む一覧を削除
* exactにtrueが指定されるとsubujectのみ、完全一致検索となる
* detailのみ指定された場合、その文字列が含む一覧を削除
* 複数条件が指定された場合、AND検索して条件に一致した一覧を削除

+ Parameters
    + done: false (boolean) - 完了かどうか(false:未完、true:完了)
    + subject: 宿題 (string) - タイトル
    + detail: 算数ドリル (string) - 内容
    + exact: false (boolean) - タイトルの完全一致検索設定(false:未完[default]、true:完了)

+ Response 200 (application/json)
    + Attributes
        + result: 600 (number, required) - 実行結果(0:正常、1以上:エラー)
        + message: 未実装です (string, required) - エラーメッセージなど

## Group Support API

### API概要一覧取得 [/api]

#### API概要一覧取得 [GET]

* 本APIのエンドポイントと概要の一覧を取得できる

+ Response 200 (application/json)
    + Attributes
        + list (array[object], required, fixed-type)
            + (object)
                + method: DELETE (string, required) - HTTPメソッド
                + endpoint: /todo (string, required) - エンドポイントURL
                + summary: TODOを全件削除 (string, required) - エンドポイントURL

### API仕様書表示 [/api/spec]

#### API仕様書表示 [GET]

* ブラウザからリクエストする前提
* API仕様書のWebページを表示する

+ Response 200 (text/html)


### エラー内容一覧取得 [/api/error]

#### エラー内容一覧取得 [GET]

* 本APIにて発行するエラー番号とその概要一覧を取得できる

+ Response 200 (application/json)
    + Attributes
        + list (array[object], required, fixed-type)
            + (object)
                + number: 500 (number, required) - HTTPメソッド
                + summary: データベース実行エラー (string, required) - エンドポイントURL
　 
　 
### テスト結果表示 [/coverage]

#### テスト結果表示 [GET]

* ブラウザからリクエストする前提
* テスト結果のWebページを表示する

+ Response 200 (text/html)
