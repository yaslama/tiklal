var AppDispatcher = require('../dispatcher/AppDispatcher');
var SidurConstants = require('../constants/SidurConstants');

var ActionTypes = SidurConstants.ActionTypes;

module.exports = {

  changePath: function(path) {
    AppDispatcher.dispatch({
      type: ActionTypes.CHANGE_PATH,
      path: path
    });
  },

  setCurrent: function(pos, title) {
    AppDispatcher.dispatch({
      type: ActionTypes.SET_CURRENT,
      pos: pos,
      title: title
    });
  },

  setMenu(menu) {
    AppDispatcher.dispatch({
      type: ActionTypes.SET_MENU,
      menu: menu
    });
  },

  setTopIndex(index) {
    AppDispatcher.dispatch({
      type: ActionTypes.SET_TOPINDEX,
      index: index
    });
  }

};
