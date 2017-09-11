Template.titlePage.events({
  'click .scroll-link': function(e){
      scrollToSection(e);
  },
  'click [data-social-login]' ( event, template ) {
    const service = event.target.getAttribute( 'data-social-login' ),
          options = {
            requestPermissions: [ 'email' ]
          };

    if ( service === 'loginWithTwitter' ) {
      delete options.requestPermissions;
    }

    Meteor[ service ]( options, ( error ) => {
      if ( error ) {
        Bert.alert( error.message, 'danger' );
      }
    });
  },
});

Template.titlePage.onCreated(function() {
  const pagesHandle=this.subscribe('pages');
  const sectionsHandle=this.subscribe('sectionsPub');
  this.autorun(() => {
    FlowRouter.watchPathChange();
    const pagesIsReady = pagesHandle.ready();
    const sectionsIsReady = sectionsHandle.ready();
    console.log(`titlePage Pages Handle is ${pagesIsReady ? 'ready' : 'not ready'}`);
    console.log(`titlePage Sections Handle is ${sectionsIsReady ? 'ready' : 'not ready'}`);
    //document.title = orion.dictionary.get('site.title', 'dlintec');
  });
});

Template.titlePage.helpers({
  sections: function(){
      return Sections.find({}, {sort: {order: 1}});
  },
  pagesHelper:function(){
    console.log(`pagesHelper`);
    return  pages.find({}, {sort: {order: 1}});
  },

});
