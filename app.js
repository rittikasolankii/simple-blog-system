const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const methodOverride = require('method-override');

const app = express();
const PORT = process.env.PORT || 3000;

// Set up EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride('_method'));

// Helper function to read posts from JSON file
function getPosts() {
  try {
    const postsData = fs.readFileSync(path.join(__dirname, 'data', 'posts.json'), 'utf8');
    return JSON.parse(postsData);
  } catch (error) {
    // If file doesn't exist or is empty, return empty array
    return [];
  }
}

// Helper function to write posts to JSON file
function savePosts(posts) {
  fs.writeFileSync(
    path.join(__dirname, 'data', 'posts.json'),
    JSON.stringify(posts, null, 2),
    'utf8'
  );
}

// Ensure data directory exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

// If posts.json doesn't exist, create it with empty array
const postsFile = path.join(dataDir, 'posts.json');
if (!fs.existsSync(postsFile)) {
  savePosts([]);
}

// Routes
// Home page - List all posts
app.get('/', (req, res) => {
  const posts = getPosts();
  res.render('index', { posts });
});

// Show create post form
app.get('/posts/new', (req, res) => {
  res.render('create');
});

// Create a new post
app.post('/posts', (req, res) => {
  const posts = getPosts();
  const newPost = {
    id: uuidv4(),
    title: req.body.title,
    content: req.body.content,
    author: req.body.author || 'Anonymous',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  posts.push(newPost);
  savePosts(posts);
  
  res.redirect('/');
});

// Show a specific post
app.get('/posts/:id', (req, res) => {
  const posts = getPosts();
  const post = posts.find(post => post.id === req.params.id);
  
  if (!post) {
    return res.status(404).render('404', { message: 'Post not found' });
  }
  
  res.render('post', { post });
});

// Show edit post form
app.get('/posts/:id/edit', (req, res) => {
  const posts = getPosts();
  const post = posts.find(post => post.id === req.params.id);
  
  if (!post) {
    return res.status(404).render('404', { message: 'Post not found' });
  }
  
  res.render('edit', { post });
});

// Update a post
app.put('/posts/:id', (req, res) => {
  let posts = getPosts();
  const postIndex = posts.findIndex(post => post.id === req.params.id);
  
  if (postIndex === -1) {
    return res.status(404).render('404', { message: 'Post not found' });
  }
  
  posts[postIndex] = {
    ...posts[postIndex],
    title: req.body.title,
    content: req.body.content,
    author: req.body.author,
    updatedAt: new Date().toISOString()
  };
  
  savePosts(posts);
  
  res.redirect(`/posts/${req.params.id}`);
});

// Delete a post
app.delete('/posts/:id', (req, res) => {
  let posts = getPosts();
  const filteredPosts = posts.filter(post => post.id !== req.params.id);
  
  if (filteredPosts.length === posts.length) {
    return res.status(404).render('404', { message: 'Post not found' });
  }
  
  savePosts(filteredPosts);
  
  res.redirect('/');
});

// 404 route - This should be the last route
app.use((req, res) => {
  res.status(404).render('404', { message: 'Page not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});