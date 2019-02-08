FORMAT: 1A

# TODO List REST-API仕様書

## TODO List取得 [/todo{?subject,detail}]

### 検索して取得 [GET]

* パラメータの指定がない場合、すべてのTODO一覧を返却。
* subjectのみ指定された場合、その文字列が含む一覧を返却。
* detailのみ指定された場合、その文字列が含む一覧を返却。
* subjectとdetailが指定された場合、どちらも含む一覧を返却。

+ Parameters 
    + subject: 宿題 (string, optional) - タイトル
    + detail: 算数ドリル (string, optional) - 内容
+ Response 200 (application/json)
    + Attributes
        + result: 600 (number) - 実行結果(0:正常、1以上:エラー)
        + message: 未実装です (string) - エラーメッセージなど
        + data (array)
            + (object)
                + subject: 宿題 (string, required) - タイトル
                + detail: 算数ドリル (string, required) - 内容


## Subject List取得 [/todo/subjects]

### タイトル一覧を取得 [GET]

* TODOのタイトルを全件取得する

+ Response 200 (application/json)
    + Attributes
        + result: 600 (number) - 実行結果(0:正常、1以上:エラー)
        + message: 未実装です (string) - エラーメッセージなど
        + data (array) - タイトル一覧
            + 宿題 (string, optional)
            + 自習 (string, optional)

## 特定のTODOを取得 [/todo/{subject}]

### 指定したタイトルのTODOを取得 [GET]

* 指定したタイトルに一致するTODOを返却

+ Parameters 
    + subject: 宿題 (string, required, `subject`) - タイトル
+ Response 200 (application/json)
    + Attributes
        + result: 600 (number) - 実行結果(0:正常、1以上:エラー)
        + message: 未実装です (string) - エラーメッセージなど
        + data (object)
            + subject: 宿題 (string, required) - タイトル
            + detail: 算数ドリル (string, required) - 内容


## TODO 追加 [/todo]

### TODOを1件追加 [POST]

* 指定された値で新規にTODOを追加する
* 既に存在しているタイトルが指定された場合、上書き保存する

+ Request (application/json)
    + Headers
            Accept: application/json
    + Attributes
        + subject: 宿題 (string, optional) - タイトル
        + detail: 算数ドリル (string, optional) - 内容

+ Response 200 (application/json)
    + Attributes
        + result: 600 (number) - 実行結果(0:正常、1以上:エラー)
        + message: 未実装です (string) - エラーメッセージなど

## TODO 更新 [/todo/{subject}]

### 指定されたTODOを1件更新 [PUT]

* 指定されたタイトルに該当するTODOを更新する
* 更新後のタイトルが既に存在しているタイトルの場合、エラーを返す(100)
* ただし、更新前後のタイトルが同じ場合はエラーとせず更新する

+ Parameters 
    + subject: 宿題 (string, required, `subject`) - タイトル

+ Request (application/json)
    + Headers
            Accept: application/json
    + Attributes
        + subject: 宿題 (string, optional) - タイトル
        + detail: 漢字ドリルP10～11 (string, optional) - 内容

+ Response 200 (application/json)
    + Attributes
        + result: 600 (number) - 実行結果(0:正常、1以上:エラー)
        + message: 未実装です (string) - エラーメッセージなど

## 全TODOを削除 [/todo]

### TODOを全件削除する [DELETE]

* 全てのTODOを一括削除

+ Response 200 (application/json)
    + Attributes
        + result: 600 (number) - 実行結果(0:正常、1以上:エラー)
        + message: 未実装です (string) - エラーメッセージなど

## 特定のTODOを削除 [/todo/{subject}]

### 指定したタイトルのTODOを削除 [DELETE]

* 指定したタイトルに一致するTODOを削除

+ Parameters 
    + subject: 宿題 (string, required, `subject`) - タイトル
+ Response 200 (application/json)
    + Attributes
        + result: 600 (number) - 実行結果(0:正常、1以上:エラー)
        + message: 未実装です (string) - エラーメッセージなど
