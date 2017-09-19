animate= function(){
  element=document.getElementById("svg_13");
  svghero=document.getElementById("svghero");
  TweenMax.to(element, 2, {autoAlpha:0});
  TweenMax.to(svghero, 1, {autoAlpha:1});

  //in 2 seconds, fade back in with visibility:visible
  TweenMax.to(element, 3, {autoAlpha:1, delay:2});

}

Template.titlePage.events({
  'click .scroll-link': function(e){
      scrollToSection(e);
  },
  'click .start-hero-animation': function(e){
    //divBuilder('testSVG').play();
    animate();
    divBuilderOpenPanel('slidePanelTest','divBuilder',{src:'http://11.0.0.132/dlintec-logo-vert-1024x1024.svg'});
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

Template.titlePage.created = function() {
  console.log('titlePage created.');
  //Meteor.Loader.loadJs("/gsap/TweenMax.min.js");
}
Template.titlePage.rendered = function() {
    console.log('titlePage rendered');
    setTimeout(  animate, 500);


}
Template.titlePage.onCreated(function() {
  const pagesHandle=this.subscribe('pages');
  const sectionsHandle=this.subscribe('sectionsPub');
  this.autorun(() => {
    FlowRouter.watchPathChange();
    const pagesIsReady = pagesHandle.ready();
    const sectionsIsReady = sectionsHandle.ready();
    //console.log(`titlePage Pages Handle is ${pagesIsReady ? 'ready' : 'not ready'}`);
    //console.log(`titlePage Sections Handle is ${sectionsIsReady ? 'ready' : 'not ready'}`);
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
