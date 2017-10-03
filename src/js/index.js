//require("babelify/polyfill.js");
var React = require('react');
var ReactDOM = require('react-dom');
var App = require('./components/App.js');
var injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();

ReactDOM.render(<App/>, document.getElementById("main"));
