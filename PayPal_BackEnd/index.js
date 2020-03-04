const fastify = require('fastify')();
const path = require('path')
const app = fastify;
const publicDir = '/public/'
const port = 8888;
const userApi = require('./api/user/routes/user.routes.js')
const productApi = require('./api/product/routes/product.routes.js')
const payPalApi = require('./api/paypal/routes/paypal.routes.js')
console.log(userApi)

fastify.register(require('fastify-cors'), { 
  
})
fastify.register(require('fastify-formbody'))
fastify.addContentTypeParser('*', function (req, done) {
  var data = ''
  req.on('data', chunk => { data += chunk })
  req.on('end', () => {
    done(null, data)
  })
})

app.post('/home', async(req, reply) => {
  console.log(req.body)
  reply.send({
    error: false,
    result: 'Hello world!'
  });

});

/* User APIs */
app.post('/user/create', async (req, reply) => {
  userApi.createUserById(req).then(function(result){
    reply.send(result);
  })
});
app.get('/user/get/:userId', async (req, reply) => {
  userApi.getUserById(req).then(function(result){
    reply.send(result);
  })
});

/* Product APIs */
app.post('/product/create', async (req, reply) => {
  productApi.createProduct(req).then(function(result){
    reply.send(result);
  })
});
app.get('/product/get/:itemNumber', async (req, reply) => {
  productApi.getProductByItemNumber(req).then(function(result){
    reply.send(result);
  })
});

/* PayPal APIs */
app.post('/transaction/create', async (req, reply) => {
  console.log(result)
  var result = await payPalApi.handleRequest(req)
  //payPalApi.createPayment(req ).then(function(result){
  reply.code(result.respCode)
  reply.send({orderID: result.id})
  //})
});
app.post('/transaction/validate', async (req, reply) => {
  var result = await payPalApi.validatePayment(req);
  reply.code(result.respCode)
  reply.send({status: result.status})
});

app.post('/signup', async (req, reply) => {
  return {
    error: false,
    username: req.body.username
  };
});

app.post('/checkout', async (req, reply) => {
  return {
    error: false,
    username: req.body.username
  };
});

app.listen(port).then(() => {
  console.log('Server running at http://localhost:' + port + '/');
});