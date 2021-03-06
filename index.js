const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()

const config = require('./server/config');

const { default: AdminBro } = require('admin-bro')
const adminBroOptions = require('./server/routers/admin.options')
const buildAdminRouter = require('./server/routers/admin.router')

const app = express()

app.use(bodyParser.json())
app.use(cors())
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

const postRouter = require('./server/routers/api/post.router')
const videoRouter = require('./server/routers/api/video.router')
const musicRouter = require('./server/routers/api/albums.router')
const photosRouter = require('./server/routers/api/photoalbum.router')
const aboutRouter = require('./server/routers/api/about.router')
const mailRouter = require('./server/routers/api/mail.router')
const settingsRouter = require('./server/routers/api/settings.router')
const discographyMainPageRouter = require('./server/routers/api/discography.router')

app
  .use('/api/news', postRouter)
  .use('/api/video', videoRouter)
  .use('/api/music', musicRouter)
  .use('/api/photos', photosRouter)
  .use('/api/about', aboutRouter)
  .use('/api/feedback', mailRouter)
  .use('/api/settings', settingsRouter)
  .use('/api/discography', discographyMainPageRouter)

const run = async () => {
  try{
    await mongoose.connect(config.MONGO_DB_ADDRESS, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })

    global.__basedir = __dirname;

    console.log('Mongo DB connected!')

    const admin = new AdminBro(adminBroOptions)
    const adminRouter = buildAdminRouter(admin)

    app.use('/admin', adminRouter)

    app.use('/uploads', express.static('uploads'));

    app.listen(config.PORT, () => {
      console.log(`Up! Now listening to port: ${config.PORT}!`)
    })
  }catch (e){
    console.log(e)
  }
}

run()
