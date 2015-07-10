require("babelify/polyfill.js");
var React = require('react');
var App = require('./components/App.jsx');
var injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();

React.render(<App/>, document.body);
