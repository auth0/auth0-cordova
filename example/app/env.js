module.exports = {
  domain: 'auth0conciergedemos.auth0.com',
  clientID: 'qXZtRFZ3SDYGhyjwIZi1B1nWofCNlQ43',
  // Dynamically pass the correct controller
  packageIdentifier: (window.webkit && window.webkit.messageHandlers)
    ? 'com.auth0samplescordova.wkwebview'
    : 'com.auth0samplescordova.simple'
};
