animate= function(){
  var paths=document.querySelectorAll("path,rect,polygon");
  var texts=document.querySelectorAll("text");
  //TweenMax.to(paths, 0, {autoAlpha:0});
  //TweenMax.to(texts, 0, {autoAlpha:0});
  //TweenMax.to(svghero, 1, {autoAlpha:1});

  //in 2 seconds, fade back in with visibility:visible
  //TweenMax.to(paths, 3, {autoAlpha:1, delay:1});
  //TweenMax.to(texts, 3, {autoAlpha:1, delay:2});

}


Template.titlePage.events({
  'click .scroll-link': function(e){
      scrollToSection(e);
  },
  'click .start-hero-animation': function(e){
    //divBuilder('testSVG').play();
    animate();
    divBuilderOpenPanel('slidePanelTest','divBuilder',{src:'dlintec-logo-vert-1024x1024.svg'});
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


    var $el = $("#very-specific-design");
    var elHeight = $el.outerHeight();
    var elWidth = $el.outerWidth();

    var $wrapper = $("#scaleable-wrapper");

    $wrapper.resizable({
      resize: doResize
    });

    function doResize(event, ui) {

      var scale, origin;

      scale = Math.min(
        ui.size.width / elWidth,
        ui.size.height / elHeight
      );

      $el.css({
        transform: "translate(-50%, -50%) " + "scale(" + scale + ")"
      });

    }

    var starterData = {
      size: {
        width: $wrapper.width(),
        height: $wrapper.height()
      }
    }
    doResize(null, starterData);

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
