var loc = window.location.pathname;
var currentFolder = window.location.pathname.substring(0, loc.lastIndexOf('/')) + "/";

async function getServiceWorkers() {
  return navigator.serviceWorker.getRegistrations().then((SWs) => SWs);
}

const updateNetworkStatus = () => {
  const el = document.getElementById('network-status')
  const text = window.navigator.onLine ? '🟢 online' : '🟥 offline'
  el.innerText = text
}

const updateSWStatus = () => {
  getServiceWorkers().then(sws => {
    var swsScopes = sws.map(sw => sw.scope)
    var status = swsScopes.includes(window.location.origin + currentFolder) ? true : false
    const el = document.getElementById('sw-status')
    const text = status ? '🟢 SW registered' : '🟥 SW not registered'
    el.innerText = text
  })
}

updateNetworkStatus()
updateSWStatus() 
window.addEventListener('offline', updateNetworkStatus)
window.addEventListener('online', updateNetworkStatus)

const fetchUrl = () => {
  const page = document.getElementById("fetch-url").value;
  fetch(window.location.origin + currentFolder + page)
    .then(response => { 
      document.getElementById("fetch-response").innerHTML = JSON.stringify({status: response.status, body: response.text()})
    })
    .catch( error => {
      console.log(error)
      document.getElementById("fetch-response").innerHTML = JSON.stringify(error)
    })
}
