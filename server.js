const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const port = 3000; // You can change this if needed

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/Blog', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define the blog post schema
const blogPostSchema = new mongoose.Schema({
  title: String,
  content: String,
  author: String,
});

const BlogPost = mongoose.model('BlogPost', blogPostSchema);

// Define the routes
app.get('/api/posts', (req, res) => {
  BlogPost.find({})
    .then((posts) => {
      res.json(posts);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

app.get('/api/posts/:id', (req, res) => {
  const postId = req.params.id;
  BlogPost.findById(postId)
    .then((post) => {
      if (!post) {
        res.status(404).send('Post not found');
      } else {
        res.json(post);
      }
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});


app.post('/api/posts', (req, res) => {
    const { title, content, author } = req.body;
    const newPost = new BlogPost({ title, content, author });
    newPost.save()
      .then((post) => {
        res.json(post);
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  });
  
  app.put('/api/posts/:id', (req, res) => {
    const postId = req.params.id;
    const { title, content, author } = req.body;
    BlogPost.findByIdAndUpdate(
      postId,
      { title, content, author },
      { new: true }
    )
      .then((post) => {
        if (!post) {
          res.status(404).send('Post not found');
        } else {
          res.json(post);
        }
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  });
  

app.delete('/api/posts/:id', (req, res) => {
  const postId = req.params.id;
  BlogPost.findByIdAndDelete(postId, (err, post) => {
    if (err) {
      res.status(500).send(err);
    } else if (!post) {
      res.status(404).send('Post not found');
    } else {
      res.send('Post deleted successfully');
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
