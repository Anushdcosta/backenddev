const express = require('express');
const app = express();
const path = require('path');
const Blog = require("./models/blog.js");
const mongoose = require("mongoose");
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // Ensure you can parse JSON bodies if needed

const port = 3000;
const dburi =
  "mongodb+srv://anush:anush123@cluster0.pmpjv44.mongodb.net/aaablogs?retryWrites=true&w=majority&appName=Cluster0";
mongoose
  .connect(dburi)
  .then((results) =>
    app.listen(process.env.Port || port, () =>
      console.log(`listening on port ${port}`)
    )
  )
  .catch((err) => console.log(err));

// Set EJS as the template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Route for the home page
app.get('/', (req, res) => {
  Blog.find()
    .sort({ createdAt: -1 })
    .then((result) => {
      res.render("index", {blogs: result, webpage: 0  });
    })
    .catch((err) => {
    });
});
app.get("/create", (req, res) => {
  res.render("create")
})

app.get("/:id", (req, res) => {
  const id = req.params.id;
  Blog.find().then((mainresult) => {
    Blog.findById(id)
      .then((result) => {
        res.render("current_blog", {
          blogs: mainresult,
          blog: result,
        });
      })
      .catch((err) => {
      
      });
  });
});

app.post('/submit', async (req, res) => {
  console.log(req.body)
  // Get the current date in "YYYY-MM-DD" format
  const currentDate = new Date().toISOString().split('T')[0];

  const newBlogPost = new Blog({
      Name: req.body.Name,
      Title: req.body.Title,
      Data: req.body.Data,
      Date: currentDate // Add the current date to the blog post
  });

  try {
      await newBlogPost.save();
      res.redirect("/");
  } catch (err) {
      console.error('Error details:', err);
      res.status(500).send('Error occurred while saving the blog post.');
  }
});

// Start the server
module.exports = app

