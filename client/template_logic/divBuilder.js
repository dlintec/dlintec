console.log('[ dlintec ] divBuilder starting...');
/*Meteor.Loader.loadJs("/gsap/TweenMax.min.js",10000).fail(
  function() {

  }
);*/
if (typeof TweenMax == 'undefined'){
  Meteor.Loader.loadJs("https://cdnjs.cloudflare.com/ajax/libs/gsap/1.20.2/TweenMax.min.js",
    function(e){
      console.log('GSAP loaded from CDN');
    }
    ,10000)
    .fail(function(e){
      console.log('ERROR:no GSAP could be loaded');
    })
}else{
  console.log('GSAP loaded.');
}
console.log('TweenMax:',TweenMax);
console.log('TimelineMax:',TimelineMax);


Session.set('divBuilderSession',{});
divBuilderObjects={};




uniqueHexId=function(pObject){
  var retryId=true;
  var newId="NEW";
  while (retryId) {
    newId=Random.hexString(6);
    retryId=(typeof pObject[newId] != 'undefined');
  }
  return newId;
}
/*
function mapDOM(element, json) {
    var treeObject = {};

    // If string convert to document Node
    if (typeof element === "string") {
        if (window.DOMParser) {
              parser = new DOMParser();
              docNode = parser.parseFromString(element,"text/xml");
        } else { // Microsoft strikes again
              docNode = new ActiveXObject("Microsoft.XMLDOM");
              docNode.async = false;
              docNode.loadXML(element);
        }
        element = docNode.firstChild;
    }

    //Recursively loop through DOM elements and assign properties to object
    function treeHTML(element, object) {
        object["type"] = element.nodeName;
        var nodeList = element.childNodes;
        if (nodeList != null) {
            if (nodeList.length) {
                object["content"] = [];
                for (var i = 0; i < nodeList.length; i++) {
                    if (nodeList[i].nodeType == 3) {
                        var theValue=nodeList[i].nodeValue;
                        var cleanValue=theValue.replace(/[\n\r]+/g, ' ').replace(/\s{2,}/g,' ').replace(/^\s+|\s+$/,'')
                        if ((cleanValue.length > 1) || (theValue.charCodeAt(0) != 10)) {

                          object["content"].push(nodeList[i].nodeValue);

                        }
                    } else {
                        object["content"].push({});
                        treeHTML(nodeList[i], object["content"][object["content"].length -1]);
                    }
                }
            }
        }
        if (element.attributes != null) {
            if (element.attributes.length) {
                object["attributes"] = {};
                for (var i = 0; i < element.attributes.length; i++) {
                    object["attributes"][element.attributes[i].nodeName] = element.attributes[i].value;
                }
            }
        }
    }
    treeHTML(element, treeObject);

    return (json) ? JSON.stringify(treeObject) : treeObject;
}

*/


divBuilderSrcToHtml= function(pSrc){
  //console.log('divBuilderSrcToHtml:',pSrc);
  if ((typeof pSrc != 'undefined')){
    var fileExt=pSrc.split('.').pop();
    console.log('divBuilderSrcToHtml ext:',fileExt);
    switch (fileExt) {
      case 'svg':
        return "<img src="+pSrc+">" ;
        break;
      default:
        return "No html" ;
    }

  }else{
    return "";
  }
};
divBuilderHtml2json=function(pString){
  var data = { html: pString };

  //  This gives you a string in JSON syntax of the object above that you can
  // send with XMLHttpRequest.
  var json = JSON.stringify(data);
  return json;
}
divBuilder=function(pId){
  return divBuilderObjects[pId];
}

Template.divBuilder.helpers({
  uuid: function () {
    return this.id;
  },
  divClasses: function () {
    if ((typeof this.class != 'undefined')){
      return "divBuilder " + this.class;
    }else{
      return "divBuilder";
    }
  },
  divStyle: function () {
    if ((typeof this.style != 'undefined')){
      return this.style;
    }else{
      return "width:100%;opacity:1;";
    }
  },
  divContent: function () {
    //console.log('divContent',this,Template.instance());
    if ((typeof this.src != 'undefined')){
      var fileExt=this.src.split('.').pop();
      var reqParams=parse_url(this.src);
      var urlParams=parse_url(Meteor.absoluteUrl());
      var abs_url;
      //console.log('divContent ext:',fileExt);
      if (typeof reqParams.scheme == 'undefined') {
        switch (fileExt) {
          case 'divml': case 'html': case 'svg':


              abs_url=urlParams.scheme+'://'+urlParams.authority
              if ( this.src.charAt(0) != '/') {
                abs_url=abs_url+'/';
              }

              abs_url=abs_url+this.src;


            break;
          default:
            return "No html origin" ;
        }

      }else {
        abs_url=this.src;
      }
      //console.log('divBuilder loading:',fileExt,abs_url);

      divBuilder(this.id).loadUrl(abs_url);

      return "Loading..." ;

      return divBuilderSrcToHtml(this.src);

    }else{
      if ((typeof this.template != 'undefined')){
        return "{{>"+this.template+" "+this+"}}";
      }
      return "";

    }

  },
});

Template.divBuilder.events({
  'click .divBuilder': function(event,template){
    event.preventDefault();
    event.stopPropagation();
    if ( (template.lastClickedId == this.id) || ( typeof template.lastClickedId == 'undefined') ){
      //console.log("Click on divBuilder class - elem:",this.id,event,template);
    }else{

    }
    template.lastClickedId=this.id;

  },
  'dblclick .divBuilder':function(event,template){
    event.preventDefault();
    if ( (template.lastClickedId == this.id) || ( typeof template.lastClickedId == 'undefined') ){
      console.log("dblclick on divBuilder class - elem:",this.id,event,template);
      template.play();

    }else{

    }
    template.lastClickedId=this.id;

  },
  'keydown .divBuilder':function(event,template){
        console.log("keydown on divBuilder class - elem:",this.id,event,template);

  },

  'click *[data-uid]': function(event,template){
      //template.lastClickedId=event.toElement.id;
      var uid=event.target.getAttribute("data-uid");
      if (typeof uid != 'undefined') {
        event.preventDefault();
        event.stopPropagation();
        console.log("devBuilder click uid:",uid,event.target.id,event.target);
        template.lastClickedId=uid;
      }

  },

});

Template.divBuilder.rendered = function() {
    console.log('divBuilder rendered:',this.data.id);

}

Template.divBuilder.onCreated(function() {
  const self = this;
  if (typeof self.data.id == 'undefined'){
    self.data.id=uniqueHexId(divBuilderObjects);
    console.log('new uid created for divBuilder:',self.data.id);
  }
  divBuilderObjects[self.data.id]=self;
  //console.log('divBuilder onCreated:',this,divBuilderObjects);
  const dioramasHandle=this.subscribe('dioramas');
  self.divClasses= "divBuilder";
  self.divStyle= "border: 1px solid #cfcfcf;width:100px;height:100px;";

  self.objectIndex={};


  self.attachData=function(pData){

  }


  self.loadHtmlString= function(pString){

    self.elementSelector="#"+self.data.id;
    self.contentSelector=".divBuilderContent";
    self.element=$(self.elementSelector);
    self.contentElement=self.element.find(self.contentSelector);

    //console.log('divBuilder loadHtmlString:',self.contentElement);

    self.contentElement.empty();
    //var json = mapDOM(pString, false);
    var json ;
    var string2='...';

    try {
      json = html2json(pString);
      //console.log('json:',json);
      string2= json2html(json);
      //console.log('string2:',string2);

      self.contentElement.append(string2);
    } catch (e) {
      self.contentElement.append('<i class="fa fa-cog " aria-hidden="true"></i> Invalid HTLM string');
      console.log('loadHtmlString ERROR: Invalid HTML string',e);
      return;
    } finally {
    }

    //console.log('allElements:',htmlLoaded, element);
    self.buildObjectIndex();
    self.play();
    //console.log('divBuilder loadHtmlString:',string2,element);
  }
  self.buildObjectIndex = function(){

    var allElementsWithUId=self.contentElement.find( '*[data-uid]' );
    var allLinkedelements=self.contentElement.find( '*[data-linked-uid]' );
    /*d3.select('#'+self.data.id).selectAll('*:not([data-uid])').attr('data-uid', function(){
        var uid=uniqueHexId(self.objectIndex);
        self.objectIndex[uid]={};
        console.log('ASSIGN element data-uid:',uid);
        return uid;
      }
    );*/

    var allElements=self.contentElement.find( "*" );
    //console.log('ALL ELEMENTS:',allElements,"with previous ID:",allElementsWithUId);
    var arrayLength = allElements.length;
    console.log('buildObjectIndex...');
    for (var i = 0; i < arrayLength; i++) {
        var element=allElements[i];
        var elementUid=element.getAttribute("data-uid");
        if (elementUid == null) {
          var uid=uniqueHexId(self.objectIndex);
          self.objectIndex[uid]={};
          element.setAttribute("data-uid",uid);
          elementUid=element.getAttribute("data-uid");
          //console.log('ASSIGN element data-uid:',uid);

        }

        console.log('  uid:',elementUid);

        var indexObject=self.objectIndex[elementUid];
        // no previous index
        if (typeof indexObject == 'undefined') {
          self.objectIndex[elementUid]={};
          indexObject=self.objectIndex[elementUid];
        }

        indexObject.element=element;
    }
    //console.log('self.objectIndex:',self.objectIndex);


  }

  self.loadUrl= function(pUrl){

    console.log('divBuilder loadUrl:',pUrl);
    HTTP.call('GET', pUrl, {}, (error, result) => {
      if (!error) {
        //console.log('divBuilder File loaded:',result);
        self.loadHtmlString(result.content);

      }else{
        console.log('divBuilder error loading file:',error,result);

      }
    });
  }

  self.play= function(pScene){
    //var element=document.getElementById(self.data.id);

    //in 2 seconds, fade back in with visibility:visible
    TweenMax.to(self.element, 0, {autoAlpha:0});
    TweenMax.to(self.element, 3, {autoAlpha:1, delay:.5});
    console.log('divBuilder play...');
  }
  self.json= function(){
    var element = document.getElementById(self.data.id);
      var json = html2json(element.innerHTML);

    return json;
  }
  this.autorun(() => {
    //console.log('divBuilder autorun- element:',self.element);
    FlowRouter.watchPathChange();
    const dioramasIsReady = dioramasHandle.ready();
    //console.log(`divBuilder dioramas Handle is ${dioramasIsReady ? 'ready' : 'not ready'}`);

    //document.title = orion.dictionary.get('site.title', 'dlintec');

  });
});
Template.divBuilder.onDestroyed(function() {
  delete divBuilderObjects[this.data.id];
  //console.log('devBuilder onDestroyed',this.data.id,divBuilderObjects);

});
