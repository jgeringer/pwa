console.log('online? ', navigator.onLine)

window.addEventListener('online', () => console.warn('you are back online'))

window.addEventListener('offline', () => console.log('you went offline'))

//checking strength of connection (not good browser support)
if ('connection' in navigator){
	console.log('init connection strength: ', navigator.connection.effectiveType)
  navigator.connection.addEventListener('change', (e) => {
  	console.log('strength: ', e.target.effectiveType)
  })
}