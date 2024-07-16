const express = require("express");

const app = express();

const port = 3000;
app.listen(process.env.Port || port, () => console.log(`listening on port ${port}`))

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.get("/?", (req, res) => {
  res.render("index")
});
