var React = require('react');
var ReactDOM = require('react-dom');
var SidurStore = require('../stores/SidurStore');
var SidurActionCreators = require('../actions/SidurActionCreators');
var SidurContent = require('../SidurContent');
var SidurConstants = require('../constants/SidurConstants');
var Container = require('./Container.jsx');
var Menu = require('./Menu.jsx');


function getStateFromStores(o) {
  var view = SidurStore.getView();
  var topIndex = SidurStore.getTopIndex();
  var menu = SidurStore.getMenu();
  var c = SidurContent.content;
  var menuTitle = 'סידור תפילה';
  if (menu.length > 0) {
    var c = SidurContent.content;
    menuTitle = Object.keys(c[menu[0]])[0];
  }
  var title, subtitle;
  if (view === SidurConstants.ViewTypes.TEXT) {
    var c = SidurContent.content;
    var level1Key = Object.keys(c[topIndex[0]])[0];
    var level1 = c[topIndex[0]][level1Key];
    var level2Key = Object.keys(level1[topIndex[1]])[0]
    title = level1Key;
    subtitle = level2Key;
  }
  //return level2[index[2]];
  return {
 		title: title,
    subtitle: subtitle,
    view: view,
    topIndex: topIndex,
    menu: menu
  };
}

var App = React.createClass({

	getInitialState: function() {
    return getStateFromStores(this);
  },

	componentDidMount: function() {
    SidurStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    SidurStore.removeChangeListener(this._onChange);
  },

  _getMenu: function(path) {
    var menu = this._getMenuObject(path);
    var style = {
      width: "70vw",
      backgroundImage: "url(images/button.jpg)",
      backgroundColor: "transparent",
      height: "17.3vw",
      fontFamily: "Text Font",
      color: "#fef9e3",
      border: "none",
      backgroundSize: "contain",
      margin: "3vw 11vw 0",
      fontSize: "5rem",
      lineHeight: "17.3vw"
    };
    var _goTo = this._goTo;
    return menu.labels.map(function(l, i){
      var newPath = '';
      var newLabel = '';
      if (typeof l == 'string' || l instanceof String) {
        newPath = path + '/' + i;
        newLabel = l;
      } else {
        newPath = path + '/' + l.name;
        newLabel = l.name;
      }
      return ( <button style={style} key={ newPath } onClick={ _goTo(newPath) }>{ newLabel }</button> );
    });
    //return menu;
  },
	render: function() {

    if (this.state.view === SidurConstants.ViewTypes.TEXT) {
       return (
         <Container topIndex={this.state.topIndex} title={this.state.title} subtitle={this.state.subtitle} />
       );
    } else {
      return <Menu />;
    }
	},
  _onChange: function() {
    //console.log(getStateFromStores());
    var state = getStateFromStores(this);
    this.setState(state);
  }
});

module.exports = App;
