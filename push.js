const webPush = require('web-push')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const vapidKeys = {
  publicKey:
'BI5oyws4LvhV0Na6GWLQp_RRW6Sw9sjoIYUYdS26OMJOYdHevmVPH59HhkcXxUP5PkBA1lrUz5_SN4nPa4MazY4',
  privateKey: 'CyE04R9_c3xwo_36kdtQ06TvTR3PYvEj1qKCgFiZRSs'
};

webPush.setVapidDetails(
  'mailto:web-push-book@gauntface.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,PATCH,POST,DELETE')
  if (req.method === 'OPTIONS') {
    return res.send(200)
  }
  next();
});

// app.post('/save-subscription', function (req, res) {
//   console.log(req.body)
//   res.send(200)
// })

app.post('/save-subscription', function (req, res) {

  setTimeout(function () {
    console.log('ahdsfasf')
    webPush.sendNotification({
      endpoint: req.body.endpoint,
      keys: {
        p256dh: req.body.key,
        auth: req.body.authSecret
      }
    })
      .then(function () {
        res.sendStatus(201);
      })
      .catch(function (error) {
        console.log(error);
        res.sendStatus(500);
      });
  },  4000);
})

app.listen(3000, () => console.log('Example app listening on port 3000!'))

