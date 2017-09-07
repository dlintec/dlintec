Meteor.startup(function () {

process.env.MAIL_URL = 'smtp://'+orion.config.get('MAIL_ACCOUNT')+':'+orion.config.get('MAIL_PASSWORD')+'@'+orion.config.get('MAIL_SMTP_SERVER');
console.log("smtp user:",orion.config.get('MAIL_ACCOUNT'));
console.log("smtp server:",orion.config.get('MAIL_SMTP_SERVER'));
console.log("smtp alert account:",orion.config.get('MAIL_ALERT_ACCOUNT'));
});
