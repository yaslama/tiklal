var AppDispatcher = require('../dispatcher/AppDispatcher');
var SidurConstants = require('../constants/SidurConstants');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var ActionTypes = SidurConstants.ActionTypes;
var ViewTypes = SidurConstants.ViewTypes;
var CHANGE_EVENT = 'change';

var _path = {'current':'/'};
var _current = {'pos':0, 'title':''};
var _index = {
  'view': ViewTypes.MENU,
  'menu': [],
  'top': [0,0,0],
};

var SidurStore = assign({}, EventEmitter.prototype, {

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  /**
   * @param {function} callback
   */
  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  getPath: function() {
    return _path["current"];
  },

  getTitle: function() {
    return _current["title"];
  },

  getPos: function() {
    return _current["pos"];
  },

  getTopIndex() {
    return _index['top'];
  },

  getMenu() {
    return _index['menu'];
  },

  getView() {
    return _index['view'];
  }

});

SidurStore.dispatchToken = AppDispatcher.register(function(action) {

  switch(action.type) {

    case ActionTypes.CHANGE_PATH:
      _path["current"] = action.path;
      //console.log("New path in store:" + action.path);
      SidurStore.emitChange();
      break;
    case ActionTypes.SET_CURRENT:
      _current["title"] = action.title;
      _current["pos"] = action.pos;
      SidurStore.emitChange();
      break;
    case ActionTypes.SET_TOPINDEX:
      _index['top'] = action.index;
      _index['view'] = ViewTypes.TEXT;
      SidurStore.emitChange();
      break;
    case ActionTypes.SET_MENU:
      _index['menu'] = action.menu;
      _index['view'] = ViewTypes.MENU;
      SidurStore.emitChange();
      break;
    default:
      // do nothing
  }

});

module.exports = SidurStore;
