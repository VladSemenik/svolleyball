const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, { origins: '*:*' });

const router = express.Router();
const games = [];

router.get('/create/:name', async (req, res, next) => {

  const session = await io.of(`/${req.params.name}`);

  await session.on('connection', async function(socket){
    await socket.on('ball point', async (e) => {
      await session.emit('ball point', e);
    });

    await socket.on('enemy point', async (e) => {
      await session.emit('enemy point', e);
    })
  });

  console.log(req.params.name);

  if (await games.includes(req.params.name)) {
    res.json({ createdStatus: 'already' });
  } else {
    games.push(req.params.name);
    res.json({ createdStatus: 'created', game: req.params.name });
  }

});

http.listen(3031, function(){
  console.log('web socket server listening on *:3031');
});

module.exports = router;