const webPush = require('web-push')
const express = require('express')
const app = express()

webPush.setGCMAPIKey(process.env.GCM_API_KEY || null)

app.post('/register', function (req, res) {
  res.sendStatus(201)
})

app.post('/sendNotification', function (req, res) {

  setTimeout(function () {
    webPush.sendNotification({
      endpoint: req.body.endpoint,
      TTL: req.body.ttl,
      keys: {
        p256dh: req.body.key,
        auth: req.body.authSecret
      }
    }, req.body.payload)
      .then(function () {
        res.sendStatus(201);
      })
      .catch(function (error) {
        console.log(error);
        res.sendStatus(500);
      });
  }, req.body.delay * 1000);
})

app.listen(3000, () => console.log('Example app listening on port 3000!'))

