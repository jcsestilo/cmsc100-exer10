
const controller = require('./controller');

module.exports = (app) => {

  // Allow Cross Origin Resource Sharing
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
    next();
  })

  app.post('/signup', controller.signUp)
  app.post('/login', controller.logIn)
  app.post('/checkifloggedin', controller.checkIfLoggedIn)
  app.post('/find-by-email-post', controller.findByEmailPOST)
  app.get('/find-all', controller.findAll)
  app.get('/find-by-id', controller.findById)
  app.post('/find-by-id-post', controller.findByIdPOST)
  app.post('/add', controller.add)
  app.post('/delete-by-id', controller.deleteById)
}