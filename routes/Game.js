const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, { origins: '*:*' });

const router = express.Router();
const games = [];

router.get('/create/:name', async (req, res, next) => {

  let session;

  if(await games.find(e => e.name === '/' + req.params.name)){
    session = await games.find(e => e.name === '/' + req.params.name);
  } else {
    session = await io.of(`/${req.params.name}`);
    await games.push(session);
  }


  await session.on('connection', async function(socket){
    await socket.on('ball point', async (e) => {
      await session.emit('ball point', e);
    });

    await socket.on('enemy point', async (e) => {
      await session.emit('enemy point', e);
    })
  });

  console.log(games);

    if(Object.keys(games.find(e => e.name === '/' + req.params.name).connected).length > 0){
      if(Object.keys(games.find(e => e.name === '/' + req.params.name).connected).length > 1)
        res.json({ createdStatus: 'full lobby', game: req.params.name });
      else
        res.json({ createdStatus: 'connected', game: req.params.name });
    }
    else
      res.json({ createdStatus: 'created', game: req.params.name });

});

http.listen(3031, '172.20.1.30', function(){
  console.log('web socket server listening on 172.20.1.30:3031');
});

module.exports = router;