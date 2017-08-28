Meteor.publish('sectionsPub', function(){
  return Sections.find();
});
Meteor.publish('beersPub', function(){
  return Beers.find();
});
