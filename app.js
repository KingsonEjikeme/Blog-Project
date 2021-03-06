//jshint esversion:6
const _ = require('lodash');
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const posts = [];
const app = express();

const dotenv = require('dotenv');
dotenv.config();
var url = process.env.MONGOLAB_URI;

app.set('view engine', 'ejs');  //SETS UP THE VIEWS FOLDER

app.use(bodyParser.urlencoded({  //READ BODY CONTENT
  extended: true
}));
app.use(express.static("public")); //ENABLES YOU TO USE THE PUBLIC FOLDER

mongoose.connect(url, {useNewUrlParser: true});

const postSchema = {
  postTitle: String,
  postBody: String,
  truncatedBody: String
}

const Post = mongoose.model("Post", postSchema);



// STARTING TEXT
const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";


//RENDER THE HOMEPAGE WITH THE STARTING CONTENT AND EMPTY ARRAY "POSTS"
app.get("/", function(req, res) {


  Post.find({}, function(err, foundPosts){

    res.render("home", {
      homeStartingContent: homeStartingContent,
      Post: foundPosts,
      _:_
    });
  })

})

//RENDER THE ABOUT PAGE WITH THE STARTING CONTENT
app.get("/about", function(req, res) {
  res.render("about", {
    aboutContent: aboutContent
  })
})

//RENDER THE CONTACT PAGE WITH THE STARTING CONTENT
app.get("/contact", function(req, res) {
  res.render("contact", {
    contactContent: contactContent
  })
});

//RENDER THE COMPOSE PAGE(CREATE CONTENT)
app.get("/compose", function(req, res) {
  res.render("compose");
});

//PROCESS INPUT FROM THE COMPOSE PAGE AND REDIRECT TO THE HOMEPAGE
app.post("/compose", function(req,res){
  const postTitle = req.body.postTitle;
  const postBody = req.body.postBody;
  const newPost = new Post({
    postTitle: postTitle,
    postBody: postBody,
    truncatedBody: _.truncate(postBody, {length: 100})
  });
  newPost.save();

  res.redirect("/");
});

//POSTS DYNAMIC URL
app.get("/posts/:postId", function(req, res) {
  const postId = req.params.postId;
  Post.findOne({_id:postId}, function(err, post){
      if(!err){
        res.render("post", {
          post: post
        });
      }
  });
});







//START THE SERVER AT PORT 3000
let port = process.env.PORT;
if(port== null || port==""){
  port = 3000;
}

app.listen(port, function() {
  console.log("Server started on port 3000");
});
