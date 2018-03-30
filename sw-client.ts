
import { Subject } from 'rxjs/Subject';
const onServiceWorkerReady$ = new Subject();
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/')
  const rawData = window.atob(base64);
  return Uint8Array.from(rawData.split('').map((char) => char.charCodeAt(0)));
}
const applicationServerPublicKey = 'BPKr0_ZmXz8QkKYaOkRPB9EQI_hGYyONzHhmiWcV4LHh9LbMr5wm81yeSu6J_wOObn40arX7yxOqc8b3xo9x0M4'

/**
 *  Registration success handler 
 * */
function registrationSuccess(reg) {
  // console.log('ServiceWorker registration successful with scope: ', reg.scope);
  const applicationServerKey = urlBase64ToUint8Array(applicationServerPublicKey);
  // reg.pushManager.getSubscription().then((sub) =>
  //   sub.unsubscribe()
  // ).then(console.log)

  reg.pushManager
    .subscribe({
      userVisibleOnly: true,
      applicationServerKey: applicationServerKey
    })
    .then((e) => console.warn(JSON.stringify(e)));
    // add error handling
  return reg
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('/sw.js')
      .then(registrationSuccess)
      .then(reg => {
        const channel = new MessageChannel();
        channel.port1.onmessage = (e) => {
          console.log(e)
        }
        onServiceWorkerReady$.next(reg)
        // port2 is self
        // navigator.serviceWorker.controller.postMessage('message form the client ', [channel.port2])
      })
      .catch(function (err) {
        console.log('ServiceWorker registration failed: ', err);
      });
  });

  Notification.requestPermission(function (result) {
    // 'denied'
    if (result === 'granted') {
      return result
    }
  })

  // control from the client  
  // navigator.serviceWorker.addEventListener('message', function(event) {
  // });

  // example on how to enable client to client
  // https://developer.mozilla.org/en-US/docs/Web/API/Clients
}

export { onServiceWorkerReady$ }
