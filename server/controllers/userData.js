const fs = require('fs');

class UserDataController {
  async getUser(req, res) {
    const userID = req.params.username
    const users = JSON.parse(fs.readFileSync('./samples/users.json', 'utf8'));
    const podcasts = JSON.parse(fs.readFileSync('./samples/podcasts.json', 'utf8'));

    const id = users.findIndex(user => user.username === userID)
    const userPods = podcasts.filter(a => a.author === userID)

    let results = {}

    if(id === -1) {
      res.status(404);
      results = {
        data: {},
        message: 'usuário não encontrado'
      }
    } else {
      res.status(200);
      results = {
        data: {
          userData: {...users[id], password: null},
          podcasts: userPods
        },
        message: 'sucesso'
      }
    }

    res.send(results);
  }
}

module.exports = new UserDataController()