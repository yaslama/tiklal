var React = require('react');
var ReactDOM = require('react-dom');
var SidurStore = require('../stores/SidurStore');
var SidurActionCreators = require('../actions/SidurActionCreators');
var SidurContent = require('../SidurContent');
var SidurConstants = require('../constants/SidurConstants');
var Container = require('./Container.js');

function getStateFromStores(o) {
  var menu = SidurStore.getMenu();
  var title = '';
  if (menu.length == 1) {
    var c = SidurContent.content;
    title = Object.keys(c[menu[0]])[0];
  }

  return {
  	menu: menu,
	title: title
  };
}

export class Menu extends React.Component {

	constructor(props) {
    	super(props);
    	this.state = getStateFromStores(this);
  	}

	componentDidMount() {
    	SidurStore.addChangeListener(this._onChange.bind(this));
	}

	componentWillUnmount() {
    	SidurStore.removeChangeListener(this._onChange);
	}

	_getMenu(menu) {
		var c = SidurContent.content;
		var keyPrefix = '';
		var style = {
			width: "70vw",
			backgroundImage: "url(images/button.png)",
			backgroundColor: "transparent",
			height: "15.95vw",
			fontFamily: "Text Font",
			color: "#fef9e3",
			border: "none",
			backgroundSize: "contain",
			margin: "3vw 11vw 0",
			fontSize: "5rem",
			lineHeight: "15.95vw",
			backgroundRepeat: "no-repeat",
			outline: "none"
    	};
    	var styleLast = {};
    	Object.assign(styleLast, style, {'marginBottom':'5vw'});
		var clickHandler = function(i){
			return function(e) {
				//console.log("type1");
				SidurActionCreators.setMenu([i]);
			};
		}
		if (menu.length == 1) {
			c = c[menu[0]][Object.keys(c[menu[0]])[0]];
			keyPrefix = menu[0] + '/';
			clickHandler = function(i){
				return function(e) {
					//console.log("type2", [menu[0],i,0]);
					SidurActionCreators.setTopIndex([menu[0],i,0]);
				};
			}
		}
		//console.log(clickHandler(0));
		var titles = c.map(e => Object.keys(e)[0]);
		//console.log(titles);
		var lastI = c.length-1;
		var buttons = c.map((e, i) => 
			<button style={i!=lastI ? style : styleLast} key={ keyPrefix + i } onTouchTap={ clickHandler(i) }>{ Object.keys(e)[0] }</button>);
		return buttons;
	}

	render() {
		var header;
		//if (this.state.title) {
		var menu = this.state.menu;
		var doNext = (menu.length==1)&&(menu[0]<SidurContent.content.length-1) ? function() {
			SidurActionCreators.setMenu([menu[0] + 1]);
		} : function() {
			console.log("next");
		}
		var doBack = (menu.length==1)&&(menu[0]>0) ? function() {
			SidurActionCreators.setMenu([menu[0] - 1]);
		} : function() {
			console.log("back")
		}
		var titleStyle = {
			position: "absolute",
			top: "8vw",
			fontSize: "6.5rem",
			fontFamily: "Title Font",
			//color: "#fef9e3",
			color: "#542b22",
			fontWeight: "bold",
			right: "43vw",
			width: "54vw",
			lineHeight: "1.5em",
			height: "1.5em",
			whiteSpace: "nowrap",
			overflow: "hidden",
			textOverflow: "ellipsis",
			zIndex: 1
		};
		var titleStyleSmall = {
			position: "absolute",
			top: "8vw",
			fontSize: "5rem",
			fontFamily: "Title Font",
			//color: "#fef9e3",
			color: "#542b22",
			fontWeight: "bold",
			right: "43vw",
			width: "54vw",
			lineHeight: "1em",
			height: "2em",
			whiteSpace: "nowrap",
			overflow: "hidden",
			textOverflow: "ellipsis",
			zIndex: 1
		}
		var title = (<div style={titleStyle}>{this.state.title}</div>);
		if (this.state.title == '') {
			title = (<div style={titleStyleSmall}>סידור תפילה בנוסח הקדום והזך של<br />קהילות קודש תימן יע"א – בלדי</div>);
		}
		header = (
			<div>
			<img src="images/top.png" style={{ width: "100%", position: "absolute", top: 0, left: 0, display: "block", zIndex: 1}} />
			{title}
			</div>
		);
		return (
			<div>
				{ header }
				<div style={{ width: "96vw", position: "absolute", top: "21.5vw", left: "1vw", backgroundColor: "#fef9e3", height: window.innerHeight - 0.38*window.innerWidth, overflow: "auto"}} className='menuContainer'>
				{ this._getMenu(this.state.menu) }
				</div>
				<img src="images/bottom.png" style={{ width: "100%", position: "absolute", left: 0, bottom: 0 }} />
				<div onClick={ function() { navigator.app.exitApp(); } } style={{ height: "20vw", width: "22.65625vw", position: "absolute", bottom: "5vw", left: 0, display: "block" }} ></div>
				<div onClick={ doNext } style={{ height: "20vw", width: "20vw", position: "absolute", bottom: "5vw", left: "22.65625vw", display: "block" }} ></div>
				<div onClick={ function() { console.log("logo") } } style={{ height: "20vw", width: "14.6875vw", position: "absolute", bottom: "5vw", left: "42.65625vw", display: "block" }} ></div>
				<div onClick={ doBack } style={{ height: "20vw", width: "20vw", position: "absolute", bottom: "5vw", left: "57.34375vw", display: "block" }} ></div>
				<div onClick={ function() { SidurActionCreators.setMenu([]); } } style={{ height: "20vw", width: "22.65625vw", position: "absolute", bottom: "5vw", left: "77.34375vw", display: "block" }} ></div>
				<div style={{ height: "5vw", width:"100%", position:'absolute', bottom:0, left:0, display: "block" }}></div>
			</div>
        );
	}

	_onChange() {
    	//console.log(getStateFromStores());
    	this.setState(getStateFromStores(this));
  	}
};

module.exports = Menu;