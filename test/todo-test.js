const expect = require('expect');
const app = require('../app');
const supertest = require('supertest').agent(app.listen());

const EL = require('../routes/errorlist');

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
    done :false, subject : "test3",
    detail : "1234567890"
  },
  {
    done :true, subject : "test2",
    detail : "jklmnopqrstuvwxyz123"
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
  before('事前に全件削除しておく', async () => {
    await supertest.del('/todo')
    .timeout({ response: 100000, deadline: 100000 })
    .catch(err => { 
      console.error(err);
      throw err; 
    });
  });

  it('登録', async () => {

      for(let item of todoData){
          const response = await supertest.post('/todo')
          .type('form')
          .set('Accept', /application\/json/)
          .timeout({ response: 100000, deadline: 100000 })
          .send(item)
          .expect(200)
          .catch(err => { 
            console.error(err);
            throw err; 
          });
          expect(response.body).toEqual(checkResponse);
        }
  });

  it('全件取得', async () => {
    // 登録出来たデータが正しいかチェック
    const response = await supertest.get('/todo')
    .timeout({ response: 100000, deadline: 100000 })
    .expect(200)
    .catch(err => { 
      console.error(err);
      throw err; 
    });

    expect(response.body.data.sort(compObject)).toEqual(todoData.sort(compObject));
  });

  it('タイトル一覧取得', async () => {
    const response = await supertest.get('/todo/subjects')
    .timeout({ response: 100000, deadline: 100000 })
    .expect(200)
    .catch(err => { 
      console.error(err);
      throw err; 
    });

    // 比較対象取り出し
    let ref = [];
    for(item of todoData){
      ref.push(item.subject);
    }
    expect(response.body.data.sort(compArray)).toEqual(ref.sort(compArray));

  });

  it('複数取得(done=true)', async () => {
    const response = await supertest.get('/todo?done=true')
    .timeout({ response: 100000, deadline: 100000 })
    .expect(200)
    .catch(err => { 
      console.error(err);
      throw err; 
    });

    let check = JSON.parse(JSON.stringify(checkResponse));
    check["data"] = {};
    expect(response.body).toMatchObject({result:0});
    expect(response.body).toHaveProperty("data");
    expect(response.body.data.length).toBeGreaterThanOrEqual(1); // 1以上
    for(let item of response.body.data){
      expect(item).toMatchObject({done:true});
    }
  });

  it('複数取得(subject=te)', async () => {
    const response = await supertest.get('/todo?subject=te')
    .timeout({ response: 100000, deadline: 100000 })
    .expect(200)
    .catch(err => { 
      console.error(err);
      throw err; 
    });
    
    let check = JSON.parse(JSON.stringify(checkResponse));
    check["data"] = {};
    expect(response.body).toMatchObject({result:0});
    expect(response.body).toHaveProperty("data");
    expect(response.body.data.length).toBeGreaterThanOrEqual(1); // 1以上
    for(let item of response.body.data){
      expect(item).toMatchObject({subject:expect.stringMatching(/te/)});
    }
  });

  it('複数取得(detail=123)', async () => {
    const response = await supertest.get('/todo?detail=123')
    .timeout({ response: 100000, deadline: 100000 })
    .expect(200)
    .catch(err => { 
      console.error(err);
      throw err; 
    });

    let check = JSON.parse(JSON.stringify(checkResponse));
    check["data"] = {};
    expect(response.body).toMatchObject({result:0});
    expect(response.body).toHaveProperty("data");
    expect(response.body.data.length).toBeGreaterThanOrEqual(1); // 1以上
    for(let item of response.body.data){
      expect(item).toMatchObject({detail:expect.stringMatching(/123/)});
    }
  });
  it('複数取得(done=false&subject=xt)', async () => {
    const response = await supertest.get('/todo?false&subject=xt')
    .timeout({ response: 100000, deadline: 100000 })
    .expect(200)
    .catch(err => { 
      console.error(err);
      throw err; 
    });

    let check = JSON.parse(JSON.stringify(checkResponse));
    check["data"] = {};
    expect(response.body).toMatchObject({result:0});
    expect(response.body).toHaveProperty("data");
    expect(response.body.data.length).toBeGreaterThanOrEqual(1); // 1以上
    for(let item of response.body.data){
      expect(item).toMatchObject({done:false,subject:expect.stringMatching(/xt/)});
    }
  });
  it('1件更新', async () => {
    let afterItem = {done:false, subject:"aftersubject", detail:"詳細書き換え後"};
    const response = await supertest.put('/todo/beforesubject')
    .type('form')
    .set('Accept', /application\/json/)
    .timeout({ response: 100000, deadline: 100000 })
    .send(afterItem)
    .expect(200)
    .catch(err => { 
      console.error(err);
      throw err; 
    });
    
    expect(response.body).toEqual(checkResponse);
  });

  it('1件取得', async () => {
    let afterItem = {done:false, subject:"aftersubject", detail:"詳細書き換え後"};
    const response = await supertest.get('/todo/aftersubject')
    .timeout({ response: 100000, deadline: 100000 })
    .expect(200)
    .catch(err => { 
      console.error(err);
      throw err; 
    });

    let check = JSON.parse(JSON.stringify(checkResponse));
    check["data"] = afterItem;
    expect(response.body).toEqual(check);
  });

  it('登録(上書き)', async () => {
    let afterItem = {done:false, subject:"test1", detail:"詳細書き換え後2"};
    const response = await supertest.post('/todo')
    .type('form')
    .set('Accept', /application\/json/)
    .timeout({ response: 100000, deadline: 100000 })
    .send(afterItem)
    .expect(200)
    .catch(err => { 
      console.error(err);
      throw err; 
    });    
    expect(response.body).toEqual(checkResponse);

    // 更新確認
    const result = await supertest.get('/todo/test1')
    .expect(200)
    .catch(err => { 
      console.error(err);
      throw err; 
    });
    let check = JSON.parse(JSON.stringify(checkResponse));
    check["data"] = afterItem;
    expect(result.body).toEqual(check);
  });

  it('1件削除', async () => {
    const response = await supertest.del('/todo/aftersubject')
    .timeout({ response: 100000, deadline: 100000 })
    .expect(200)
    .catch(err => { 
      console.error(err);
      throw err; 
    });
    expect(response.body).toEqual(checkResponse);

    // 取得して消えていることを確認
    const result = await supertest.get('/todo/aftersubject')
    .timeout({ response: 100000, deadline: 100000 })
    .expect(200)
    .catch(err => { 
      console.error(err);
      throw err; 
    });
    let check = JSON.parse(JSON.stringify(checkResponse));
    check["data"] = {};
    expect(result.body).toEqual(check);
  });

  it('全件削除', async () => {
    const response = await supertest.del('/todo')
    .timeout({ response: 100000, deadline: 100000 })
    .expect(200)
    .catch(err => { 
      console.error(err);
      throw err; 
    });
    expect(response.body).toEqual(checkResponse);

    // 取得して消えていることを確認
    const result = await supertest.get('/todo')
    .timeout({ response: 100000, deadline: 100000 })
    .expect(200)
    .catch(err => { 
      console.error(err);
      throw err; 
    });
    let check = JSON.parse(JSON.stringify(checkResponse));
    check["data"] = [];
    expect(result.body).toEqual(check);
  });
});

describe(`POST 登録のエラー、準正常系テスト`, () => {
  it('doneなし、subject数値', async () => {
    const response = await supertest.post('/todo')
    .type('form')
    .set('Accept', /application\/json/)
    .timeout({ response: 100000, deadline: 100000 })
    .send({subject:123,detail:""})
    .expect(200)
    .catch(err => { 
      console.error(err);
      throw err; 
    });
    expect(response.body).toEqual(checkResponse);

    // 更新されているか確認
    const result = await supertest.get('/todo/123')
    .timeout({ response: 100000, deadline: 100000 })
    .expect(200)
    .catch(err => { 
      console.error(err);
      throw err; 
    });
    let check = JSON.parse(JSON.stringify(checkResponse));
    check["data"] = {done:false,subject:"123",detail:""};
    expect(result.body).toEqual(check);

  });

  it('done文字列＋不正文字', async () => {
    const response = await supertest.post('/todo')
    .type('form')
    .set('Accept', /application\/json/)
    .timeout({ response: 100000, deadline: 100000 })
    .send({done:"aaa",subject:123,detail:""})
    .expect(200)
    .catch(err => { 
      console.error(err);
      throw err; 
    });
    expect(response.body.result).toEqual(EL.E_PRM_TYPECAST.num);
  });

  it('done文字列＋Boolean句', async () => {
    const response = await supertest.post('/todo')
    .type('form')
    .set('Accept', /application\/json/)
    .timeout({ response: 100000, deadline: 100000 })
    .send({done:"true",subject:123,detail:""})
    .expect(200)
    .catch(err => { 
      console.error(err);
      throw err; 
    });
    expect(response.body).toEqual(checkResponse);

    // 更新されているか確認
    const result = await supertest.get('/todo/123')
    .timeout({ response: 100000, deadline: 100000 })
    .expect(200)
    .catch(err => { 
      console.error(err);
      throw err; 
    });
    let check = JSON.parse(JSON.stringify(checkResponse));
    check["data"] = {done:true,subject:"123",detail:""};
    expect(result.body).toEqual(check);
  
  });

  it('subjectなし', async () => {
    const response = await supertest.post('/todo')
    .type('form')
    .set('Accept', /application\/json/)
    .timeout({ response: 100000, deadline: 100000 })
    .send({done:"true",detail:""})
    .expect(200)
    .catch(err => { 
      console.error(err);
      throw err; 
    });
    expect(response.body.result).toEqual(EL.E_PRM_NOTENOUGH.num);
  });

  it('detailなし', async () => {
    const response = await supertest.post('/todo')
    .type('form')
    .set('Accept', /application\/json/)
    .timeout({ response: 100000, deadline: 100000 })
    .send({done:"true",subject:"test20"})
    .expect(200)
    .catch(err => { 
      console.error(err);
      throw err; 
    });
    expect(response.body.result).toEqual(EL.E_PRM_NOTENOUGH.num);
  });

  it('引数なし', async () => {
    const response = await supertest.post('/todo')
    .type('form')
    .set('Accept', /application\/json/)
    .timeout({ response: 100000, deadline: 100000 })
    .send({})
    .expect(200)
    .catch(err => { 
      console.error(err);
      throw err; 
    });
    expect(response.body.result).toEqual(EL.E_PRM_NOTENOUGH.num);
  });

  it('subject空白', async () => {
    const response = await supertest.post('/todo')
    .type('form')
    .set('Accept', /application\/json/)
    .timeout({ response: 100000, deadline: 100000 })
    .send({done:"false",subject:"",detail:""})
    .expect(200)
    .catch(err => { 
      console.error(err);
      throw err; 
    });
    expect(response.body.result).toEqual(EL.E_PRM_PROHIBITED.num);
  });

  it('subjectがsubjects', async () => {
    const response = await supertest.post('/todo')
    .type('form')
    .set('Accept', /application\/json/)
    .timeout({ response: 100000, deadline: 100000 })
    .send({done:"false",subject:"subjects",detail:""})
    .expect(200)
    .catch(err => { 
      console.error(err);
      throw err; 
    });
    expect(response.body.result).toEqual(EL.E_PRM_PROHIBITED.num);
  });

  it('subject50文字', async () => {
    let testdata = "";
    for(let i=0; i<50; i++){
        testdata += i % 10;
    }
    const response = await supertest.post('/todo')
    .type('form')
    .set('Accept', /application\/json/)
    .timeout({ response: 100000, deadline: 100000 })
    .send({done:"false",subject:testdata,detail:""})
    .expect(200)
    .catch(err => { 
      console.error(err);
      throw err; 
    });
    expect(response.body).toEqual(checkResponse);

    // 更新されているか確認
    const result = await supertest.get(`/todo/${testdata}`)
    .expect(200)
    .catch(err => { 
      console.error(err);
      throw err; 
    });
    let check = JSON.parse(JSON.stringify(checkResponse));
    check["data"] = {done:false,subject:testdata,detail:""};
    expect(result.body).toEqual(check);
  });

  it('subject51文字', async () => {
    let testdata = "";
    for(let i=0; i<51; i++){
        testdata += i % 10;
    }
    const response = await supertest.post('/todo')
    .type('form')
    .set('Accept', /application\/json/)
    .timeout({ response: 100000, deadline: 100000 })
    .send({done:"false",subject:testdata,detail:""})
    .expect(200)
    .catch(err => { 
      console.error(err);
      throw err; 
    });
    expect(response.body.result).toEqual(EL.E_PRM_SIZEOVER.num);
  });

  it('detail255文字', async () => {
    let testdata = "";
    for(let i=0; i<255; i++){
        testdata += i % 10;
    }
    const response = await supertest.post('/todo')
    .type('form')
    .set('Accept', /application\/json/)
    .timeout({ response: 100000, deadline: 100000 })
    .send({done:"false",subject:"extr5",detail:testdata})
    .expect(200)
    .catch(err => { 
      console.error(err);
      throw err; 
    });
    expect(response.body).toEqual(checkResponse);

    // 更新されているか確認
    const result = await supertest.get('/todo/extr5')
    .expect(200)
    .catch(err => { 
      console.error(err);
      throw err; 
    });
    let check = JSON.parse(JSON.stringify(checkResponse));
    check["data"] = {done:false,subject:"extr5",detail:testdata};
    expect(result.body).toEqual(check);
  });

  it('detail256文字', async () => {
    let testdata = "";
    for(let i=0; i<256; i++){
        testdata += i % 10;
    }
    const response = await supertest.post('/todo')
    .type('form')
    .set('Accept', /application\/json/)
    .timeout({ response: 100000, deadline: 100000 })
    .send({done:"false",subject:"extr5",detail:testdata})
    .expect(200)
    .catch(err => { 
      console.error(err);
      throw err; 
    });
    expect(response.body.result).toEqual(EL.E_PRM_SIZEOVER.num);
  });

  after('最後にテストデータを削除しておく', async () => {
    const response = await supertest.del('/todo')
    .timeout({ response: 100000, deadline: 100000 })
    .expect(200)
    .catch(err => { 
      console.error(err);
      throw err; 
    });
    expect(response.body).toEqual(checkResponse);
  });

});

describe(`PUT 更新のエラー、準正常系テスト`, () => {
  before('事前にテストデータを登録しておく', async () => {
    // Todoを登録
    for(let item of todoData){
      const response = await supertest.post('/todo')
      .type('form')
      .set('Accept', /application\/json/)
      .timeout({ response: 100000, deadline: 100000 })
      .send(item)
      .expect(200)
      .catch(err => { 
        console.error(err);
        throw err; 
      });
      expect(response.body).toEqual(checkResponse);
    }
  });

  it('更新対象指定なし', async () => {
    const response = await supertest.put('/todo')
    .type('form')
    .set('Accept', /application\/json/)
    .timeout({ response: 100000, deadline: 100000 })
    .send({done:"aaa",subject:123,detail:""})
    .expect(200)
    .catch(err => { 
      console.error(err);
      throw err; 
    });
    expect(response.body.result).toEqual(EL.E_PRM_NOTENOUGH.num);
  });

  it('存在しているsubjectに変更しようとした', async () => {
    const response = await supertest.put('/todo/test1')
    .type('form')
    .set('Accept', /application\/json/)
    .timeout({ response: 100000, deadline: 100000 })
    .send({done:true,subject:"test2",detail:""})
    .expect(200)
    .catch(err => { 
      console.error(err);
      throw err; 
    });
    expect(response.body.result).toEqual(EL.E_SRH_HAVETITLE.num);
  });

  it('doneなし、subject数値', async () => {
    const response = await supertest.put('/todo/test1')
    .type('form')
    .set('Accept', /application\/json/)
    .timeout({ response: 100000, deadline: 100000 })
    .send({subject:123,detail:""})
    .expect(200)
    .catch(err => { 
      console.error(err);
      throw err; 
    });
    expect(response.body).toEqual(checkResponse);

    // 更新されているか確認
    const result = await supertest.get('/todo/123')
    .timeout({ response: 100000, deadline: 100000 })
    .expect(200)
    .catch(err => { 
      console.error(err);
      throw err; 
    });
    let check = JSON.parse(JSON.stringify(checkResponse));
    check["data"] = {done:true,subject:"123",detail:""};
    expect(result.body).toEqual(check);
  });

  it('存在しないsubjectを更新しようとする', async () => {
    const response = await supertest.put('/todo/cccc')
    .type('form')
    .set('Accept', /application\/json/)
    .timeout({ response: 100000, deadline: 100000 })
    .send({done:true,subject:"push",detail:""})
    .expect(200)
    .catch(err => { 
      console.error(err);
      throw err; 
    });
    expect(response.body.result).toEqual(EL.E_SRH_NOTTERGET.num);
  });
  
  it('done文字列＋不正文字', async () => {
    const response = await supertest.put('/todo/test2')
    .type('form')
    .set('Accept', /application\/json/)
    .timeout({ response: 100000, deadline: 100000 })
    .send({done:"aaa",subject:567,detail:""})
    .expect(200)
    .catch(err => { 
      console.error(err);
      throw err; 
    });
    expect(response.body.result).toEqual(EL.E_PRM_TYPECAST.num);
  });

  it('done文字列＋Boolean句', async () => {
    const response = await supertest.put('/todo/test2')
    .type('form')
    .set('Accept', /application\/json/)
    .timeout({ response: 100000, deadline: 100000 })
    .send({done:"true",subject:567,detail:""})
    .expect(200)
    .catch(err => { 
      console.error(err);
      throw err; 
    });
    expect(response.body).toEqual(checkResponse);

    // 更新されているか確認
    const result = await supertest.get('/todo/567')
    .timeout({ response: 100000, deadline: 100000 })
    .expect(200)
    .catch(err => { 
      console.error(err);
      throw err; 
    });
    let check = JSON.parse(JSON.stringify(checkResponse));
    check["data"] = {done:true,subject:"567",detail:""};
    expect(result.body).toEqual(check);
  });
  it('subjectなし', async () => {
    const response = await supertest.put('/todo/test3')
    .type('form')
    .set('Accept', /application\/json/)
    .timeout({ response: 100000, deadline: 100000 })
    .send({done:"true",detail:"部分更新できる"})
    .expect(200)
    .catch(err => { 
      console.error(err);
      throw err; 
    });
    expect(response.body).toEqual(checkResponse);

    // 更新されているか確認
    const result = await supertest.get('/todo/test3')
    .expect(200)
    .catch(err => { 
      console.error(err);
      throw err; 
    });
    let check = JSON.parse(JSON.stringify(checkResponse));
    check["data"] = {done:true,subject:"test3",detail:"部分更新できる"};
    expect(result.body).toEqual(check);

  });

  it('detailなし', async () => {
    const response = await supertest.put('/todo/extr1')
    .type('form')
    .set('Accept', /application\/json/)
    .timeout({ response: 100000, deadline: 100000 })
    .send({done:"true",subject:"extr10"})
    .expect(200)
    .catch(err => { 
      console.error(err);
      throw err; 
    });

    expect(response.body).toEqual(checkResponse);

    // 更新されているか確認
    const result = await supertest.get('/todo/extr10')
    .timeout({ response: 100000, deadline: 100000 })
    .expect(200)
    .catch(err => { 
      console.error(err);
      throw err; 
    });
    let check = JSON.parse(JSON.stringify(checkResponse));
    check["data"] = {done:true,subject:"extr10",detail:"今日は晴れのち曇り"};
    expect(result.body).toEqual(check);
  });

  it('引数なし', async () => {
    const response = await supertest.put('/todo/extr2')
    .type('form')
    .set('Accept', /application\/json/)
    .timeout({ response: 100000, deadline: 100000 })
    .send({})
    .expect(200)
    .catch(err => { 
      console.error(err);
      throw err; 
    });
      expect(response.body.result).toEqual(EL.E_PRM_NOTENOUGH.num);
  });

  it('subject空白', async () => {
    const response = await supertest.put('/todo/extr2')
    .type('form')
    .set('Accept', /application\/json/)
    .timeout({ response: 100000, deadline: 100000 })
    .send({done:"false",subject:"",detail:""})
    .expect(200)
    .catch(err => { 
      console.error(err);
      throw err; 
    });
    expect(response.body.result).toEqual(EL.E_PRM_PROHIBITED.num);
  });

  it('subjectがsubjects', async () => {
    const response = await supertest.put('/todo/extr2')
    .type('form')
    .set('Accept', /application\/json/)
    .timeout({ response: 100000, deadline: 100000 })
    .send({done:"false",subject:"subjects",detail:""})
    .expect(200)
    .catch(err => { 
      console.error(err);
      throw err; 
    });
    expect(response.body.result).toEqual(EL.E_PRM_PROHIBITED.num);
  });

  it('subject50文字', async () => {
    let testdata = "";
    for(let i=0; i<50; i++){
        testdata += i % 10;
    }
    const response = await supertest.put('/todo/extr2')
    .type('form')
    .set('Accept', /application\/json/)
    .timeout({ response: 100000, deadline: 100000 })
    .send({done:"false",subject:testdata,detail:""})
    .expect(200)
    .catch(err => { 
      console.error(err);
      throw err; 
    });
    expect(response.body).toEqual(checkResponse);

    // 更新されているか確認
    const result = await supertest.get(`/todo/${testdata}`)
    .expect(200)
    .catch(err => { 
      console.error(err);
      throw err; 
    });
    let check = JSON.parse(JSON.stringify(checkResponse));
    check["data"] = {done:false,subject:testdata,detail:""};
    expect(result.body).toEqual(check);
  });

  it('subject51文字', async () => {
    let testdata = "";
    for(let i=0; i<51; i++){
        testdata += i % 10;
    }
    const response = await supertest.put('/todo/extr2')
    .type('form')
    .set('Accept', /application\/json/)
    .timeout({ response: 100000, deadline: 100000 })
    .send({done:"false",subject:testdata,detail:""})
    .expect(200)
    .catch(err => { 
      console.error(err);
      throw err; 
    });
    expect(response.body.result).toEqual(EL.E_PRM_SIZEOVER.num);
  });

  it('detail255文字', async () => {
    let testdata = "";
    for(let i=0; i<255; i++){
        testdata += i % 10;
    }
    const response = await supertest.put('/todo/extr10')
    .type('form')
    .set('Accept', /application\/json/)
    .timeout({ response: 100000, deadline: 100000 })
    .send({done:"false",subject:"extr10",detail:testdata})
    .expect(200)
    .catch(err => { 
      console.error(err);
      throw err; 
    });
    expect(response.body).toEqual(checkResponse);

    // 更新されているか確認
    const result = await supertest.get('/todo/extr10')
    .timeout({ response: 100000, deadline: 100000 })
    .expect(200)
    .catch(err => { 
      console.error(err);
      throw err; 
    });
    let check = JSON.parse(JSON.stringify(checkResponse));
    check["data"] = {done:false,subject:"extr10",detail:testdata};
    expect(result.body).toEqual(check);

  });

  it('detail256文字', async () => {
    let testdata = "";
    for(let i=0; i<256; i++){
        testdata += i % 10;
    }
    const response = await supertest.put('/todo/extr10')
    .type('form')
    .set('Accept', /application\/json/)
    .timeout({ response: 100000, deadline: 100000 })
    .send({done:"false",subject:"extr10",detail:testdata})
    .expect(200)
    .catch(err => { 
      console.error(err);
      throw err; 
    });
    expect(response.body.result).toEqual(EL.E_PRM_SIZEOVER.num);
  });

  after('最後にテストデータを削除して、サンプルデータを追加', async () => {
    const response = await supertest.del('/todo')
    .timeout({ response: 100000, deadline: 100000 })
    .expect(200)
    .catch(err => { 
      console.error(err);
      throw err; 
    });
    expect(response.body).toEqual(checkResponse);

    const presetdata = [
      {
        subject:"お母さんのお使い",
        detail:"スーパーへ。牛肉200g 牛乳3本",
        done:false
      },
      {
        subject:"お父さんのお使い",
        detail:"コンビニ。醤油1本",
        done:true
      },
      {
        subject:"国語の宿題",
        detail:"漢字ドリル32〜43",
        done:false
      },
      {
        subject:"算数の宿題",
        detail:"計算カード、計算スキルノート14〜22",
        done:false
      },
      {
        subject:"草むしり",
        detail:"2/13 17:00までに庭の草むしりをする約束",
        done:true
      }      
    ]

    for(let item of presetdata){
      const response = await supertest.post('/todo')
      .type('form')
      .set('Accept', /application\/json/)
      .timeout({ response: 100000, deadline: 100000 })
      .send(item)
      .expect(200)
      .catch(err => { 
        console.error(err);
        throw err; 
      });
      expect(response.body).toEqual(checkResponse);
    }
  });

});
