/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  // test('#example Test GET /api/books', function(done){
  //    chai.request(server)
  //     .get('/api/books')
  //     .end(function(err, res){
  //       assert.equal(res.status, 200);
  //       assert.isArray(res.body, 'response should be an array');
  //       assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
  //       assert.property(res.body[0], 'title', 'Books in array should contain title');
  //       assert.property(res.body[0], '_id', 'Books in array should contain _id');
  //       done();
  //     });
  // });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {
    this.timeout(5000)
    let testId
    
    suite('#1 POST /api/books with title => create book object/expect book object', function() {
      
      test('#a Test POST /api/books with title', function(done) {
        chai
        .request(server)
        .post('/api/books')
        .send({title: 'mimi1'})
        .end(function(err, res){
          // console.log(res.body)
          assert.equal(res.status, 200);
          assert.isObject(res.body)
          assert.property(res.body, 'title');
          assert.property(res.body, '_id');
          done();
        })
        
      });
      
      test('#b Test POST /api/books with no title given', function(done) {
        chai
        .request(server)
        .post('/api/books')
        .send({title: ''})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, "missing required field title")
          done();
        })
        
      });
      
    });


    suite('#2 GET /api/books => array of books', function(){
      
      test('#a Test GET /api/books',  function(done){
        chai
        .request(server)
        .get('/api/books')
        .end(function(err, res){
          testId=res.body[0]._id// for delete request below
          // console.log(res.body[0]._id)
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'title');
          assert.property(res.body[0], '_id');
          assert.property(res.body[0], 'commentcount');
          done();
        })
      });      
      
    });


    suite('#3 GET /api/books/[id] => book object with [id]', function(){
      
      test('#a Test GET /api/books/[id] with id not in db',  function(done){
        chai
        .request(server)
        .get('/api/books/62505ee7d3ceb0f5f0a')
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'no book exists')
          done();
        })
      });
      
      test('#b Test GET /api/books/[id] with valid id in db',  function(done){
        chai
        .request(server)
        .get('/api/books/625113a3ae6d23956bef7f8a')
        .end(function(err, res){
          // console.log(res.body);
          assert.equal(res.status, 200);
          assert.isObject(res.body);
          assert.property(res.body, 'title');
          assert.property(res.body, '_id');
          assert.property(res.body, 'comments');
          done();
        })
      });
      
    });


    suite('#4 POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('#a Test POST /api/books/[id] with comment', function(done){
        chai
        .request(server)
        .post('/api/books/625113a3ae6d23956bef7f8a')
        .send({comment: 'testing testing testing'})
        .end(function(err, res){
          // console.log(res.body);
          assert.equal(res.status, 200);
          assert.isObject(res.body)
          assert.property(res.body, 'title')
          assert.property(res.body, '_id')
          assert.property(res.body, 'comments')
          done();
        })
      });

      test('#b Test POST /api/books/[id] without comment field', function(done){
        chai
        .request(server)
        .post('/api/books/625113a3ae6d23956bef7f8a')
        .send({})
        .end(function(err, res){
          assert.equal(res.status, 200)
          assert.equal(res.text, "missing required field comment");
          done();
        })
        
      });

      test('#c Test POST /api/books/[id] with comment, id not in db', function(done){
        chai
        .request(server)
        .post('/api/books/625113a3ae6d')
        .send({comment: 'Testing POST /api/books/[id] with comment, id not in db'})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'no book exists');
          done();
        })
        
      });
      
    });

    suite('#5 DELETE /api/books/[id] => delete book object id', function() {

      test('#a Test DELETE /api/books/[id] with valid id in db', function(done){
        chai
        .request(server)
        .delete(`/api/books/${testId}`)
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'delete successful');
          done();
        })
        
      });

      test('#b Test DELETE /api/books/[id] with  id not in db', function(done){
        chai
        .request(server)
        .delete('/api/books/625113a3ae6d')
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'no book exists');
          done();
        })
        
      });

    });

  });

});
