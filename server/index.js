var fs = require('fs');
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const port = 4000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const JSONDatabase = require('./JSONDatabase');
const favoritesController = require('./controllers/favorites');
const followController = require('./controllers/followController');
const userDataController = require('./controllers/userData');

const db = new JSONDatabase('./samples/users.json');

require('./podcasts')(app);
require('./search')(app, db);
require('./history')(app);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/getUser/:username', userDataController.getUser)

app.get('/favorites/:username', favoritesController.getUserFavorites);
app.post('/favorite/:username', favoritesController.favoritePodcast);

//function to get the users i'm following
app.get('/users/:userId/following', followController.getFollowing);

//function to get users that follow me
app.get('/users/:userId/followers', followController.getFollowers)

//function to create the follow relation
app.post('/users/:userId/following', followController.follow)

//function to undo the follow relation
app.delete('/users/:userId/following', followController.unFollow)

//function to unfollow everyone
app.delete('/users/:userId/unfollow_all', followController.unFollowAll)

app.get('/search', (req, res) => {
  console.log('Search Request Recieved')
  const query = req.query.q;
  console.log(query)
  if (query) {
      const results = db.getAllMatchingNames(query);
      res.json(results);
  } else {
      const allRecords = db.getAll();
      res.json(allRecords);
  }
});

app.get('/podcast/:name', (req, res) => {
  var data = JSON.parse(fs.readFileSync('./samples/podcasts.json', 'utf8'));
  res.json(data.find(({name}) => name == req.params.name));
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port} with cors`)
})