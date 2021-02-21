/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';
var expect = require('chai').expect;
const mongodb = require("mongodb");
const mongoose = require("mongoose");

module.exports = function (app) {
mongoose.connect(process.env.DB,{ useNewUrlParser: true, useUnifiedTopology: true })

let LibrarySchema = new mongoose.Schema({
  comments: [],
  title: {type: String, required: true},
  commentcount: Number
})

let Library = mongoose.model("Library", LibrarySchema)

  app.route('/api/books')
    .get(function (req, res){
      Library.find({},(err,data)=>{
        if(err || !data){console.log(error)}
        else{
          return res.json(data)
        }
      })
    })
    
    .post(function (req, res){
      let title = req.body.title;
      if(!title){
        return res.json("missing required field title")
      }
      let newBook = new Library({
        comments: [],
        title: title,
        commentcount: 0
      })
      newBook.save((err,data)=>{
        if(err || !data){console.log(error)}
        else{
          return res.json({_id: data.id,title: data.title})
        }
      })
    })
    
    .delete(function(req, res){
      Library.remove({},(err,data)=>{
        if(err){
          console.log(error)
        }else{
          return res.json("complete delete successful")
        }
      })
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      let bookid = req.params.id;
      Library.findById(bookid,(err,data)=>{
        if(err || !data){
          return res.json("no book exists")
        }else{
          return res.json(data)
        }
      })
    })
    
    .post(function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      if(!comment){
        return res.json("missing required field comment")
      }
      Library.findById(bookid,(err,data)=>{
        if(err || !data){
          return res.json("no book exists")
        }
          data.comments.push(comment);
          data.commentcount = data.commentcount + 1;
          data.save((err,updateData)=>{
            if(err || !updateData){
              return res.json("no book exists")
            }else{
              return res.json(updateData)
            }
          })
      })
      // Library.findByIdAndUpdate(
      //   bookid,
      //   {$push: {comments: comment}},
      //   {new:true},
      //   (err,data)=>{
      //   if(err || !data){
      //     return res.json("no book exists")
      //   }else{
      //     return res.json(data)
      //   }
      // })
    })
    
    .delete(function(req, res){
      let bookid = req.params.id;
      Library.findByIdAndRemove(bookid,(err,data)=>{
        if(err || !data){
          return res.json("no book exists")
        }else{
          return res.json("delete successful")
        }
      })
    });
  
};
