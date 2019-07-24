const publicVapidKey = require("./keys").publicKey;

if ("serviceWorker" in navigator) {
	console.log("registering service worker");

	run().catch(error => {
		console.error(error);
	});
}

async function run() {
	console.log("registering service worker");
	const registration = await navigator.serviceWorker.register("/worker.js", {
		scope: "/"
	});
	console.log("registered service worker");

	console.log("registering push");
	const subscription = await registration.pushManager.subscribe({
		userVisibleOnly: true,
		applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
	});
	console.log("registered push");

	console.log("sending push");
	await fetch("/subscribe", {
		method: "POST",
		body: JSON.stringify(subscription),
		headers: {
			"content-type": "application/json"
		}
	});

	console.log("Sent push");
}

function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');
  
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
  
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }