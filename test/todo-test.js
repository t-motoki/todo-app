const expect = require('expect');
const app = require('../app');
const supertest = require('supertest').agent(app.listen());

const errorlist = require('../routes/apilist');
const apilist = require('../routes/apilist');

// API共通のレスポンス確認用
const checkResponse = {
  result :0, message :""
};

// タイトルで昇順にソート
const compObject = (a,b)=>{
  let comp = 0;
  if(a.subject.toUpperCase() > b.subject.toUpperCase()){
    comp = 1;
  }else if(a.subject.toUpperCase() < b.subject.toUpperCase()){
    comp = -1;
  }
  return comp;
};

// 配列を昇順でソート
const compArray = (a,b)=>{
  let comp = 0;
  if(a > b){
    comp = 1;
  }else if(a < b){
    comp = -1;
  }
  return comp;
};

// テスト用ひな形データ
const todoData = [
  {
    done :true, subject : "test1",
    detail : "abcdefghijklmn"
  },
  {
    done :true, subject : "test2",
    detail : "jklmnopqrstuvwxyz123"
  },
  {
    done :false, subject : "test3",
    detail : "1234567890"
  },
  {
    done :false, subject : "extr1",
    detail : "今日は晴れのち曇り"
  },
  {
    done :false, subject : "extr2",
    detail : "あかさたなハマヤラワ"
  },
  {
    done :true, subject : "beforesubject",
    detail : "beforedetail"
  }
]

describe(`Webサーバ基本機能`, () => {
  it('存在しないページ', (done) => {
    supertest.get('/test')
      .expect(404)
      .end((error, response) => {
        if(error) {
          return done(error);
        }
        done();
      });
  });
  it('サーバエラー', (done) => {
    supertest.get('/test/broken')
      .expect(500)
      .end((error, response) => {
        if(error) {
          return done(error);
        }
        done();
      });
  });
});
  
describe(`サポートAPIのチェック`, () => {
  it('デモ用ページ読み込み', (done) => {
    supertest.get('/')
      .expect(200)
      .end((error, response) => {
        if(error) {
          return done(error);
        }
        done();
      });
  });
  it('API一覧取得', (done) => {
    supertest.get('/api')
      .expect(200)
      .end((error, response) => {
        if(error) {
          return done(error);
        }
        expect(response.body).toHaveProperty("list");
        done();
      });
  });
  it('エラー一覧取得', (done) => {
    supertest.get('/api/error')
      .expect(200)
      .end((error, response) => {
        if(error) {
          return done(error);
        }
        expect(response.body).toHaveProperty("list");
        done();
      });
  });
  it('API仕様書へ転送', (done) => {
    supertest.get('/api/spec')
      .expect(302)
      .end((error, response) => {
        if(error) {
          return done(error);
        }
        done();
      });
  });
});

describe(`正常シーケンス(複数削除とタイトル一覧の条件は、複数取得と同じ処理なので動作保証。動作確認済み)`, () => {
  before('事前に全件削除しておく', () => {
    supertest.del('/todo')
      .end((error, response) => {
      if(error) {
        return done(error);
      }
    });
  });
  it('登録', (done) => {
    // Todoを登録
    for(let item of todoData){
      supertest.post('/todo')
      .type('form')
      .send(item)
      .set('Accept', /application\/json/)
      .expect(200)
      .end((error, response) => {
        if(error) {
          return done(error);
        }
        expect(response.body).toEqual(checkResponse);
      });
    }
    done();
  });
  it('全件取得', (done) => {
    // 登録出来たデータが正しいかチェック
    supertest.get('/todo')
      .expect(200)
      .end((error, response) => {
        if(error) {
          return done(error);
        }
        expect(response.body.data.sort(compObject)).toEqual(todoData.sort(compObject));
      });

    done();
  });
  it('タイトル一覧取得', (done) => {
    supertest.get('/todo/subjects')
      .expect(200)
      .end((error, response) => {
        if(error) {
          return done(error);
        }
        // 比較対象取り出し
        let ref = [];
        for(item of todoData){
          ref.push(item.subject);
        }
        expect(response.body.data.sort(compArray)).toEqual(ref.sort(compArray));
        done();
      });
  });
  it('複数取得(done=true)', (done) => {
    supertest.get('/todo?done=true')
      .expect(200)
      .end((error, response) => {
        if(error) {
          return done(error);
        }
        let check = JSON.parse(JSON.stringify(checkResponse));
        check["data"] = {};
        expect(response.body).toMatchObject({result:0});
        expect(response.body).toHaveProperty("data");
        expect(response.body.data.length).toBeGreaterThanOrEqual(1); // 1以上
        for(let item of response.body.data){
          expect(item).toMatchObject({done:true});
        }
        done();
      });
  });
  it('複数取得(subject=te)', (done) => {
    supertest.get('/todo?subject=te')
      .expect(200)
      .end((error, response) => {
        if(error) {
          return done(error);
        }
        let check = JSON.parse(JSON.stringify(checkResponse));
        check["data"] = {};
        expect(response.body).toMatchObject({result:0});
        expect(response.body).toHaveProperty("data");
        expect(response.body.data.length).toBeGreaterThanOrEqual(1); // 1以上
        for(let item of response.body.data){
          expect(item).toMatchObject({subject:expect.stringMatching(/te/)});
        }
        done();
      });
  });
  it('複数取得(detail=123)', (done) => {
    supertest.get('/todo?detail=123')
      .expect(200)
      .end((error, response) => {
        if(error) {
          return done(error);
        }
        let check = JSON.parse(JSON.stringify(checkResponse));
        check["data"] = {};
        expect(response.body).toMatchObject({result:0});
        expect(response.body).toHaveProperty("data");
        expect(response.body.data.length).toBeGreaterThanOrEqual(1); // 1以上
        for(let item of response.body.data){
          expect(item).toMatchObject({detail:expect.stringMatching(/123/)});
        }
        done();
      });
  });
  it('複数取得(done=false&subject=xt)', (done) => {
    supertest.get('/todo?false&subject=xt')
      .expect(200)
      .end((error, response) => {
        if(error) {
          return done(error);
        }
        let check = JSON.parse(JSON.stringify(checkResponse));
        check["data"] = {};
        expect(response.body).toMatchObject({result:0});
        expect(response.body).toHaveProperty("data");
        expect(response.body.data.length).toBeGreaterThanOrEqual(1); // 1以上
        for(let item of response.body.data){
          expect(item).toMatchObject({done:false,subject:expect.stringMatching(/xt/)});
        }
        done();
      });
  });
  it('1件更新', (done) => {
    let afterItem = {done:false, subject:"aftersubject", detail:"詳細書き換え後"};
    supertest.put('/todo/beforesubject')
    .type('form')
    .send(afterItem)
    .set('Accept', /application\/json/)
    .expect(200)
    .end((error, response) => {
      if(error) {
        return done(error);
      }
      expect(response.body).toEqual(checkResponse);
      done();
    });
  });

  it('1件取得', (done) => {
    let afterItem = {done:false, subject:"aftersubject", detail:"詳細書き換え後"};
    supertest.get('/todo/aftersubject')
      .expect(200)
      .end((error, response) => {
        if(error) {
          return done(error);
        }
        let check = JSON.parse(JSON.stringify(checkResponse));
        check["data"] = afterItem;
        expect(response.body).toEqual(check);
        done();
      });
  });
  it('1件削除', (done) => {
    supertest.del('/todo/aftersubject')
      .expect(200)
      .end((error, response) => {
        if(error) {
          return done(error);
        }
        expect(response.body).toEqual(checkResponse);

        // 取得して消えていることを確認
        supertest.get('/todo/aftersubject')
        .expect(200)
        .end((error, response) => {
          if(error) {
            return done(error);
          }
          let check = JSON.parse(JSON.stringify(checkResponse));
          check["data"] = {};
          expect(response.body).toEqual(check);
          done();
        });
      });
  });
  it('全件削除', (done) => {
    supertest.del('/todo')
      .expect(200)
      .end((error, response) => {
        if(error) {
          return done(error);
        }
        expect(response.body).toEqual(checkResponse);

        // 取得して消えていることを確認
        supertest.get('/todo')
        .expect(200)
        .end((error, response) => {
          if(error) {
            return done(error);
          }
          let check = JSON.parse(JSON.stringify(checkResponse));
          check["data"] = [];
          expect(response.body).toEqual(check);
          done();
        });
      });
  });


});

describe(`POST 登録のエラー、準正常系テスト`, () => {
  it('doneなし、subject数値', (done) => {
    supertest.post('/todo')
    .type('form')
    .send({subject:123,detail:""})
    .set('Accept', /application\/json/)
    .expect(200)
    .end((error, response) => {
      if(error) {
        return done(error);
      }
      expect(response.body).toEqual(checkResponse);
    });
    done();
  });
  it('done文字列＋不正文字', (done) => {
    supertest.post('/todo')
    .type('form')
    .send({done:"aaa",subject:123,detail:""})
    .set('Accept', /application\/json/)
    .expect(200)
    .end((error, response) => {
      if(error) {
        return done(error);
      }
      expect(response.body.result).toEqual(101);
    });
    done();
  });
  it('done文字列＋Boolean句', (done) => {
    supertest.post('/todo')
    .type('form')
    .send({done:"true",subject:123,detail:""})
    .set('Accept', /application\/json/)
    .expect(200)
    .end((error, response) => {
      if(error) {
        return done(error);
      }
      expect(response.body).toEqual(checkResponse);
    });
    done();
  });
  it('subjectなし', (done) => {
    supertest.post('/todo')
    .type('form')
    .send({done:"true",detail:""})
    .set('Accept', /application\/json/)
    .expect(200)
    .end((error, response) => {
      if(error) {
        return done(error);
      }
      expect(response.body.result).toEqual(100);
    });
    done();
  });
  it('detailなし', (done) => {
    supertest.post('/todo')
    .type('form')
    .send({done:"true",subject:""})
    .set('Accept', /application\/json/)
    .expect(200)
    .end((error, response) => {
      if(error) {
        return done(error);
      }
      expect(response.body.result).toEqual(100);
    });
    done();
  });
  it('引数なし', (done) => {
    supertest.post('/todo')
    .type('form')
    .send({})
    .set('Accept', /application\/json/)
    .expect(200)
    .end((error, response) => {
      if(error) {
        return done(error);
      }
      expect(response.body.result).toEqual(100);
    });
    done();
  });
  it('subject50文字', (done) => {
    let testdata = "";
    for(let i=0; i<50; i++){
        testdata += i % 10;
    }
    supertest.post('/todo')
    .type('form')
    .send({done:"false",subject:testdata,detail:""})
    .set('Accept', /application\/json/)
    .expect(200)
    .end((error, response) => {
      if(error) {
        return done(error);
      }
      expect(response.body).toEqual(checkResponse);
    });
    done();
  });
  it('subject51文字', (done) => {
    let testdata = "";
    for(let i=0; i<51; i++){
        testdata += i % 10;
    }
    supertest.post('/todo')
    .type('form')
    .send({done:"false",subject:testdata,detail:""})
    .set('Accept', /application\/json/)
    .expect(200)
    .end((error, response) => {
      if(error) {
        return done(error);
      }
      expect(response.body.result).toEqual(102);
    });
    done();
  });
  it('detail255文字', (done) => {
    let testdata = "";
    for(let i=0; i<255; i++){
        testdata += i % 10;
    }
    supertest.post('/todo')
    .type('form')
    .send({done:"false",subject:"",detail:testdata})
    .set('Accept', /application\/json/)
    .expect(200)
    .end((error, response) => {
      if(error) {
        return done(error);
      }
      expect(response.body).toEqual(checkResponse);
    });
    done();
  });
  it('detail256文字', (done) => {
    let testdata = "";
    for(let i=0; i<256; i++){
        testdata += i % 10;
    }
    supertest.post('/todo')
    .type('form')
    .send({done:"false",subject:"",detail:testdata})
    .set('Accept', /application\/json/)
    .expect(200)
    .end((error, response) => {
      if(error) {
        return done(error);
      }
      expect(response.body.result).toEqual(102);
    });
    done();
  });
});