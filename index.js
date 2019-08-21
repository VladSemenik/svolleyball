const app = require('express')();
const router = require('./routes');

app.use(router);

app.listen(3030, '172.20.1.30', function(){
  console.log('listening on 172.20.1.30:3030');
});