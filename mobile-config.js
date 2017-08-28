// inside mobile-config.js
App.info({
  name: 'dlintec',
  description: 'An Android app built with Meteor',
  version: '0.0.1',
  buildNumber: '101' // has to be a number
});

App.accessRule("blob:*");
