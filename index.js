const app = require('express')();
const router = require('./routes');

app.use(router);

app.listen(3030, function(){
  console.log('listening on lh:3030');
});