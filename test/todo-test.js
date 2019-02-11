const expect = require('expect');
const app = require('../app');
const supertest = require('supertest').agent(app.listen());

const errorlist = require('../routes/apilist');
const apilist = require('../routes/apilist');

const checResponse = {
  "error_no":{
    result:0,
    message:""
  }
};

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

