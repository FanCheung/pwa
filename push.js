var webPush = require('web-push');

webPush.setGCMAPIKey(process.env.GCM_API_KEY || null);
module.exports = function(app, route) {
  app.post(route + 'register', function(req, res) {
    res.sendStatus(201);
  });

  app.post(route + 'sendNotification', function(req, res) {
    setTimeout(function() {
      webPush.sendNotification({
        endpoint: req.body.endpoint,
        TTL: req.body.ttl,
        keys: {
          p256dh: req.body.key,
          auth: req.body.authSecret
        }
      }, req.body.payload)
      .then(function() {
        res.sendStatus(201);
      })
      .catch(function(error) {
        console.log(error);
        res.sendStatus(500);
      });
    }, req.body.delay * 1000);
  });
};