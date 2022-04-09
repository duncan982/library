/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';
const { Books } = require('../models/books.js') 

module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]

      // console.log("*************/api/book get request*********************");

      Books.find({}, (err, books)=>{
        let foundBooks = [];
        if(err){
          console.log(err);
        }else{
          books.map((item) => {
           let returnedBooks = {
              _id: item._id,
              title: item.title,
              commentcount: item.comments.length
            };
            foundBooks.push(returnedBooks);
          });
            // console.log('foundBooks', foundBooks)
            res.json(foundBooks)
        }
        });
    })


  
    .post(function (req, res){
      //response will contain new book object including atleast _id and title
      
      let title = req.body.title;
      // console.log("*************/api/book post request*********************");
      // console.log("post request", req.body);

      if(!title){
        // console.log("missing required field title");
        res.send("missing required field title");
      }else{
        const newBook = new Books({
          title: req.body.title
        });

          newBook.save();
    
          // console.log({
            // title: newBook.title,
            // _id: newBook._id
          // })
    
          res.json({
            title: newBook.title,
            _id: newBook._id
          })
          };
    })
    
    .delete(async function(req, res){
      // console.log("*************/api/book delete request*********************");
      //if successful response will be 'complete delete successful'
      let deletedAllBooks = await Books.deleteMany({});

      if(deletedAllBooks){
        // console.log('complete delete successful');
        res.send('complete delete successful');
      }
      
    });



  app.route('/api/books/:id')
    .get(function (req, res){
    // .get(async function (req, res){
      // console.log("*************/api/book/:id get request*********************");
      let bookid = req.params.id;
      // console.log('bookid', bookid)
      Books.findById({_id: bookid}, (err, book) =>{
          if(book){
              // console.log('bookFoundById', book)
              res.json(book);
            }else{
              // console.log('no book exists');
              res.send('no book exists');
            }
      });
     
          })
    
    .post(function(req, res){
       // console.log("*************/api/book/:id post request*********************");
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get

        if(comment == undefined || comment == null || comment == ''){

          // console.log("'bookToUpdateCommentById: missing required field comment")
          res.send("missing required field comment");      
        }else if((comment !== undefined || comment !== null || comment !== '') && bookid){
      // console.log('comment', comment);
          // find book by id and push comment to comments array
  Books.findByIdAndUpdate({_id: bookid}, {$push: {comments: comment}}, {new: true}, (err, bookToUpdateCommentById)=>{
          if(bookToUpdateCommentById){
          // console.log('bookToUpdateCommentById', bookToUpdateCommentById)
          res.json(bookToUpdateCommentById);
        }else{
          // console.log('bookToUpdateCommentById: no book exists');
          res.send('no book exists');
        }
            
          });

      };
      
    })
    
    .delete(function(req, res){
      // console.log("*************/api/book/:id delete request*********************");
      let bookid = req.params.id;
      //if successful response will be 'delete successful'

  Books.findByIdAndDelete(bookid, (err, deletedBookById)=>{
      if(deletedBookById){
        // console.log('delete successful', deletedBookById)
        res.send('delete successful');
      }else{
        // console.log('no book exists');
        res.send('no book exists');
      }
  });

    });
  
};
