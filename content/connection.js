console.log('online? ', navigator.onLine)

if (navigator.onLine){
  userOnline()
} else {
  userOffline()
}

window.addEventListener('online', () => userOnline(true))

window.addEventListener('offline', () => userOffline())

//checking strength of connection (not good browser support)
if ('connection' in navigator){
	console.log('init connection strength: ', navigator.connection.effectiveType)
  navigator.connection.addEventListener('change', (e) => {
  	console.log('strength: ', e.target.effectiveType)
  })
}


function userOnline(wasOffline) {
  let cloudImage = document.getElementById('onlineStatus')
  console.log('you are back online')
  cloudImage.src = '/content/happy-cloud.png'
  if (wasOffline === true){
    location.reload();
  }
}

function userOffline(){
  let cloudImage = document.getElementById('onlineStatus')
  cloudImage.src = '/content/sad-cloud.png'
  console.log('you went offline')
}


