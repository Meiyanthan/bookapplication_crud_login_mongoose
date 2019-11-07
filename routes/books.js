var express = require('express');
var url = require('url');
//var Book = require('../models/book');
const {SavedBook, Book} = require('../models/book');

var router = express.Router();
var ObjectId = require('mongodb').ObjectId

// SHOW LIST OF BOOKS
router.get('/',isLoggedIn, function(req, res){
    //console.log('getting all books');
    Book.find({}).exec(function(err, books){
        if(err) {
            //res.send('error has occured');
            req.flash('error', err)
      			res.render('books/list', {
      				title_name: 'Book List',
      				data: '',
              keyword :''
      			})
        } else {
            //console.log(books);
            //res.json(books);
            res.render('books/list', {
              title_name: 'Book List',
              data: books,
              keyword :''
            })
        }
    });
});

// Saved LIST OF BOOKS
router.get('/savedlist',isLoggedIn, function(req, res){
  SavedBook.find({ "userid": req.session.passport.user }).exec(function(err, booklist){
    console.log(booklist);
    console.log('************');
    var resArr = [];
    booklist.filter(function(item){
      var i = resArr.findIndex(x => x.book_id == item.book_id);
      //console.log(i)
      if(i <= -1){
          resArr.push({book_id: item.book_id, title: item.title, isbn: item.isbn, author: item.author, category: item.category});
      }
      return null;
    });
    //console.log(resArr);
    //return false;
      if(err) {
          req.flash('error', err)
          res.render('books/savedbooks', {
            title_name: 'Saved Book List',
            data: '',
            keyword :''
          })
      } else {
          res.render('books/savedbooks', {
            title_name: 'Saved Book List',
            data: resArr,
            keyword :''
          })
      }
  });
});

// SEARCH BOOK
router.get('/search/(:keyword)',isLoggedIn, function(req, res){
  Book.find({ $or:[{title: {$regex:'.*' + req.params.keyword + '.*', $options: 'i'}},{isbn: {$regex:'.*' + req.params.keyword + '.*', $options: 'i'}}]})
  .exec(function(err, book){
        if(err) {
            req.flash('error', err)
            res.render('books/search', {
              title_name: 'Search Book List',
              data: '',
              keyword : req.params.keyword
            })
        } else {
            res.render('books/search', {
              title_name: 'Search Book List',
              data: book,
              keyword : req.params.keyword
            })
        }
    });
});


// SHOW ADD BOOK FORM
router.get('/add',isLoggedIn, function(req, res, next){
	res.render('books/add', {
		title_name: 'Add New Book',
		title: '',
		isbn: '',
		author: '',
    category: ''
	})
})


// ADD NEW BOOK POST ACTION
router.post('/add',isLoggedIn, function(req, res, next){
    var newBook = new Book();
    newBook.title = req.body.title;
    newBook.isbn = req.body.isbn;
    newBook.author = req.body.author;
    newBook.category = req.body.category;

    newBook.save(function(err, book){
        if(err) {
          req.flash('error', err)
          res.render('books/add', {
            title_name: 'Add New Book',
            title: book.title,
            isbn: book.isbn,
            author: book.author,
            category: book.category
          })
        } else {
          req.flash('success', 'book added successfully!')
  				res.redirect('/books')
        }
    });

})

// SAVE BOOK POST ACTION
router.post('/savebook',isLoggedIn, function(req, res, next){
  //console.log(req); return false;
  var SaveBook = new SavedBook();
  SaveBook.userid   = req.session.passport.user;
  SaveBook.book_id  = req.body.id;
  SaveBook.title    = req.body.title;
  SaveBook.isbn     = req.body.isbn;
  SaveBook.author   = req.body.author;
  SaveBook.category = req.body.category;


  SaveBook.save(function(err, book){
      if(err) {
        req.flash('error', err)
        res.render('/search', {
          title_name: 'Search Book List'
        })
      } else {
       res.json({"success":true});
        //res.redirect('back');
      }
  });

})


// SHOW EDIT BOOK FORM
router.get('/edit/(:id)',isLoggedIn, function(req, res, next){
	var o_id = new ObjectId(req.params.id)

  Book.findOne({
          _id: o_id
      }).exec(function(err, book){
          if(err) {
            req.flash('error', 'User not found with id = ' + req.params.id)
            res.redirect('/books')
          } else {
            res.render('books/edit', {
              title_name: `Update Book` ,
              id: book._id,
              title: book.title,
              isbn: book.isbn,
              author: book.author,
              category: book.category
            })
          }
      });

})

// EDIT USER POST ACTION
router.post('/edit/(:id)',isLoggedIn, function(req, res){
    Book.findOneAndUpdate({
        _id: req.params.id
    },{
        $set: {
            title: req.body.title,
            isbn: req.body.isbn,
            author: req.body.author,
            category: req.body.category
        }
    },{
        upsert: true
    },function(err, newBook){
        if(err) {
            req.flash('error', err)

            res.render('books/edit', {
              title_name: 'Edit Book',
              id: req.params.id,
              title: req.body.title,
              isbn: req.body.isbn,
              author: req.body.author,
              category: req.body.category
            })
        } else {
            req.flash('success', 'book updated successfully!')
            res.redirect('/books')
        }
    });
});

// DELETE BOOK
router.post('/delete/(:id)',isLoggedIn, function(req, res){
    Book.findByIdAndRemove({
        _id: req.params.id
    },function(err, book){
        if(err) {
            req.flash('error', err)
			      res.redirect('/books')
        } else {
          req.flash('success', 'book deleted successfully! id = ' + req.params.id)
          res.redirect('/books')
        }
    });
});

function isLoggedIn(req, res, next) {
	if(req.isAuthenticated()){
		return next();
	}

	res.redirect('/users/login');
}

module.exports = router;
