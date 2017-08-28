import React, { Component, PropTypes  } from 'react';
import {mount} from 'react-mounter';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import reactApp from '/imports/ui/components/reactApp.jsx';
// load Layout and Welcome React components

main_route={
  action: function(params) {
    BlazeLayout.render("flow_layout",  { top:"header",main: "mainPage" })
  }
}
//FlowRouter.route('/1', main_route);
FlowRouter.route('/', main_route);

class MainLayoutCtx extends React.Component {
   render(){
    const {content} = this.props //destructuring obj
    return (
     <div>
      {content}
     </div>
    )
  }
}
FlowRouter.route("/react2", {
  action() {
    console.log("react2",MainLayoutCtx);

    mount( MainLayoutCtx, {content: <reactApp/>});
    //BlazeLayout.render("flow_layout",  { top:"header" })
    //ReactDOM.render( <beerApp />, document.getElementById('render-target') );
  }
});

AccountsTemplates.configure({
    defaultLayoutType: 'blaze', // Optional, the default is 'blaze'
    defaultLayout: 'flow_layout',

    defaultContentRegion: 'main'
});
AccountsTemplates.configureRoute('signIn', {
  layoutType: 'blaze',
  name: 'signin',
  path: '/login',
  layoutTemplate: 'flow_layout',
  layoutRegions: {
    top: 'login_header'
  },
  contentRegion: 'main',
  redirect: '/'
});

AccountsTemplates.configureRoute('verifyEmail', {
  name: 'verifyEmail',
  path: '/verify-email',
  redirect: '/admin'
});

AccountsTemplates.configureRoute('resetPwd', {
  name: 'resetPassword',
  path: '/reset-password',
  redirect: '/admin'
});

AccountsTemplates.configureRoute('enrollAccount', {
  name: 'enrollAccount',
  path: '/enroll',
  redirect: '/admin'
});
