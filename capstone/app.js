const express = require('express');
const app = express();
const path = require('path');
const Blog = require("./models/blog.js");
const User = require("./models/user.js");
const mongoose = require("mongoose");
const { writer } = require('repl');
const { title } = require('process');
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // Ensure you can parse JSON bodies if needed

signed_in = 0;

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
  existingNumbers = [];
 
  Blog.find()
    .sort({ createdAt: -1 })
    .then((result) => {
        User.findOne({ blog_id: signed_in }).then((user) => {
          res.render("index", {blogs: result, webpage: 0, login: signed_in, user: user});
        });        
      })
    .catch((err) => {
    });
});
app.get("/create", (req, res) => {
  User.find({blog_id:signed_in}).then((result) => {
  res.render("create", {login: signed_in, result: result[0], type: "new"})
})
})
app.get('/reg', (req, res) => {
  res.render('signup', {login: signed_in}); // Render signup page
});
app.get('/signin', (req, res) => {
  res.render('login', {login: signed_in}); // Render login page
});
app.get("/signout", (req, res) => {
  signed_in = 0;
  res.redirect("/");
})
app.get("/myblogs", (req,res) => {
  User.findOne({ blog_id: signed_in }).then((user) => {
    Blog.find({blog_id: signed_in}).then((result) => {
    res.render("myblogs", {blogs: result, webpage: 0, login: signed_in, user: user, active: "personal"});
  })
  });
})
app.get("/delete/:id", async (req, res) => {
  const id = req.params.id;
  if (signed_in > 0) {
    try {
      const result = await Blog.findById(id);
      if (!result) {
        console.log("Blog post not found");
        return res.status(404).send("Blog post not found");
      }

      await Blog.updateOne(
        { _id: id },
        { $set: { available: "0" } }
      );

      res.redirect("/");
    } catch (err) {
      console.error("Error updating blog post:", err);
      res.status(500).send("Internal server error");
    }
  } else {
    res.redirect("/")
  }
});

app.get("/edit?", (req, res) => {
  Blog.find({_id: req.query["id"]})
  .then((result) => {
    res.render("create", {login: signed_in, result:result[0], type: "edit"})
  })
})

app.get("/:id", (req, res) => {
  const id = req.params.id;
  Blog.find().then((mainresult) => {
    Blog.findById(id)
      .then((result) => {
        res.render("current_blog", {
          blogs: mainresult,
          blog: result,
          login: signed_in
        });
      })
      .catch((err) => {
      
      });
  });
});

app.post('/submit', async (req, res) => {
  
  
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


// Route to handle signup form submission
app.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;
  function generateUniqueThreeDigitNumber(existingNumbers) {
    let randomNumber;
    do {
      // Generate a random 3-digit number between 100 and 999
      randomNumber = Math.floor(Math.random() * 900) + 100;
    } while (existingNumbers.includes(randomNumber));
  
    return randomNumber;
  }
  
  
  // Simple validation
  if (!username || !email || !password) {
    return res.status(400).send('All fields are required');
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).send('Username already exists');
    }

    // Create new user
    async function createUser() {
      try {
        const result = await Blog.find(); // Wait for the Blog.find() to complete
        existingNumbers = [];
        result.forEach((element) => {
          existingNumbers.push(element.blog_id);
        });
    
        uniqueNumber = generateUniqueThreeDigitNumber(existingNumbers);
    
        const newUser = new User({
          Name: username.toLowerCase(),
          email: email.toLowerCase(),
          password, // In production, hash the password before storing it
          blog_id: uniqueNumber,
        });
    
        await newUser.save(); // Save the newUser inside the async function
        console.log("New user created successfully");
      } catch (error) {
        console.error(error);
      }
    }
    
    // Call the function
    createUser();
    
    res.redirect('/signin'); // Redirect to login page after successful signup
  } catch (err) {
    console.error('Error details:', err);
    res.status(500).send('Error occurred while signing up.');
  }
});
// Route to handle login page

app.post('/login', async (req, res) => {
  username = req.body.username;
  password = req.body.password;
  username = username.toLowerCase();
  try {
    // User.find()
    // .then((result) => {
    //   console.log(result)
    // })
    // Find user by either username or email
    const user = await User.findOne({
      $or: [{ Name: username }, { email: username }]
    });

    if (!user) {
      return res.status(400).send('Invalid username or email');
    }

    // Compare provided password with hashed password in the database
    if (!(password === user.password)) {
      return res.status(400).send('Invalid password');
    }

    // Save user info in session
    signed_in = parseInt(user.blog_id);

    res.redirect('/'); // Redirect to the homepage or a protected page
  } catch (err) {
    console.error('Error details:', err);
    res.status(500).send('Error occurred while logging in.');
  }
});

// Start the server
module.exports = app

