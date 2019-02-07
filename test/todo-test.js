describe('ひな型', () => {
  it('テスト内容', done => {
    if('iiii' === 'iiii') {
      done();
    }
    else {
      done('失敗');
    }
  });
});