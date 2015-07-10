var React = require('react');
var SidurStore = require('../stores/SidurStore');
var SidurContent = require('../SidurContent.json');
var SidurActionCreators = require('../actions/SidurActionCreators');
var BookScroller = require('../vendor/bookScroller/BookScroller');

function toNext(that, scroller) {
  var index = that.props.topIndex.slice(0);
  var c = SidurContent.content;
  var level1Key = Object.keys(c[index[0]])[0];
  var level1 = c[index[0]][level1Key];
  var level2Key = Object.keys(level1[index[1]])[0];
  var level2 = level1[index[1]][level2Key];
  if (level1.length-1 > index[1]) {
    index[1]++;
    index[2] = 0;
  } else {
    if (c.length - 1 > index[0]) {
      index[0]++;
      index[1] = 0;
      index[2] = 0;
    } else {
      return;
    }
  }

  //console.log("toNext:", index, level2.length);
  var jsonIndex = JSON.stringify(index);
  scroller.initContent(that._getElement(that._getAtIndex(index), jsonIndex), 0);
}

function toPrev(that, scroller) {
  var index = that.props.topIndex.slice(0);
  //console.log('toPrev:', index)
  var c = SidurContent.content;
  if (index[2] > 0) {
    index[2] = 0;
  } else {
    if (index[1] > 0) {
      index[1]--;
    } else {
      if (index[0] > 0) {
          index[0]--;
          var level1 = c[index[0]][Object.keys(c[index[0]])[0]];
          index[1] = level1.length - 1;
      } else {
        return;
      }
    }
  }
  //console.log('toPrev:', index);
  var jsonIndex = JSON.stringify(index);
  scroller.initContent(that._getElement(that._getAtIndex(index), jsonIndex), 0);
}

var Container = React.createClass({
  propTypes: {
    title: React.PropTypes.string,
    subtitle: React.PropTypes.string,
    topIndex: React.PropTypes.array
  },

  componentDidUpdate: function() {
    //console.log("componentDidUpdate");
  },

  componentDidMount: function() {

    this._beginIndex = this.props.topIndex.slice(0);
    this._endIndex = this.props.topIndex.slice(0);

    var that = this;
    var nodeContent = React.findDOMNode(that).querySelector('.Container');

    var index = this.props.topIndex.slice(0);
    var jsonIndex = JSON.stringify(index);
    var fontsLoad = [];
    if (document.fonts) {
      fontsLoad = [
        document.fonts.load('bold 7.2rem "Title Font"'),
        document.fonts.load('3.6rem "Remark Font"'),
        document.fonts.load('bold 5.28rem "Text Font"'),
        document.fonts.load('4.8rem "Text Font"'),
        document.fonts.load('4rem "Text Font"'),
      ];
    }
    Promise.all(fontsLoad).then(_ => {
      var scroller = new BookScroller(nodeContent, {
        node: this._getElement(this._getAtIndex(index), jsonIndex),
        before: this._getBefore,
        after: this._getAfter,
        setTop: this._setTopElement
      });
      this.setState({'scroller':scroller});
      scroller.test();
    });
  },

  _setTopElement(element) {
    //console.log(element);
    var dataPos = element.getAttribute('data-pos');
    if (dataPos) {
      var currentIndex = JSON.parse(dataPos);
      //console.log(dataPos);
      if (this.props.topIndex.some((e,i)=>{return e != currentIndex[i]})) {
        SidurActionCreators.setTopIndex(currentIndex);
      }
    }
  },

  render: function() {
    //var pos = this.props.scrollTo;
    var that = this;
		return (
      <div>
        <img src="images/top.png" style={{ width: "100%", position: "absolute", top: 0, left: 0, display: "block", zIndex: 1 }} />
        <div style={{
          position: "absolute",
          top: "7.5vw",
          fontSize: "6.5vw",
          fontFamily: "Title Font",
          //color: "#fef9e3",
          color: "#542b22",
          fontWeight: "bold",
          right: "43vw",
          width: "54vw",
          lineHeight: "0.8em",
          height: "1.8em",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          zIndex: 1 }}>{this.props.title}<br />{this.props.subtitle}</div>
        <div style={{ height: window.innerHeight - 0.38*window.innerWidth }} className="Container"></div>
        <img src="images/bottom.png" style={{ width: "100%", position: "absolute", left: 0, bottom: 0 }} />
        <div onClick={ function() { SidurActionCreators.setMenu([that.props.topIndex[0]]) } } style={{ height: "20vw", width: "22.65625vw", position: "absolute", bottom: "5vw", left: 0, display: "block" }} ></div>
        <div onClick={ function() { toNext(that, that.state.scroller); } } style={{ height: "20vw", width: "20vw", position: "absolute", bottom: "5vw", left: "22.65625vw", display: "block" }} ></div>
        <div onClick={ function() { console.log("logo") } } style={{ height: "20vw", width: "14.6875vw", position: "absolute", bottom: "5vw", left: "42.65625vw", display: "block" }} ></div>
        <div onClick={ function() { toPrev(that, that.state.scroller); } } style={{ height: "20vw", width: "20vw", position: "absolute", bottom: "5vw", left: "57.34375vw", display: "block" }} ></div>
        <div onClick={ function() { SidurActionCreators.setMenu([]) } } style={{ height: "20vw", width: "22.65625vw", position: "absolute", bottom: "5vw", left: "77.34375vw", display: "block" }} ></div>
        <div style={{ height: "5vw", width:"100%", position:'absolute', bottom:0, left:0, display: "block" }}></div>
      </div>
		);
	},

  _incrementIndex(index) {
    //console.log('incr', index);
    if (!index) {
      return;
    }
    var c = SidurContent.content;
    var level1 = c[index[0]][Object.keys(c[index[0]])[0]];
    var level2 = level1[index[1]][Object.keys(level1[index[1]])[0]];
    if (level2.length-1 > index[2]) {
      index[2]++;
    } else {
      if (level1.length-1 > index[1]) {
        index[1]++;
        index[2] = 0;
      } else {
        if (c.length - 1 > index[0]) {
          index[0]++;
          index[1] = 0;
          index[2] = 0;
        } else {
          return undefined;
        }
      }
    }
    return index;
  },

  _decrementIndex(index) {
    //console.log("decr", index);
    if (!index) {
      return;
    }
    var c = SidurContent.content;
    if (index[2] > 0) {
      index[2]--;
    } else {
      if (index[1] > 0) {
        index[1]--;
        var level1 = c[index[0]][Object.keys(c[index[0]])[0]];
        var level2 = level1[index[1]][Object.keys(level1[index[1]])[0]];
        index[2] = level2.length - 1;
      } else {
        if (index[0] > 0) {
          index[0]--;
          var level1 = c[index[0]][Object.keys(c[index[0]])[0]];
          index[1] = level1.length - 1;
          var level2 = level1[index[1]][Object.keys(level1[index[1]])[0]];
          index[2] = level2.length - 1;
        } else {
          return undefined;
        }
      }
    }
    return index;
  },

  _getAtIndex(index) {
    if (!index) {
      return null;
    }
    var c = SidurContent.content;
    var level1 = c[index[0]][Object.keys(c[index[0]])[0]];
    var level2 = level1[index[1]][Object.keys(level1[index[1]])[0]];
    return level2[index[2]];
  },

  _getBefore(node) {
    var stringIndex = node.getAttribute('data-pos');
    if (stringIndex) {
      var index = JSON.parse(stringIndex);
      var newIndex = this._decrementIndex(index);
      if (newIndex) {
        return this._getElement(this._getAtIndex(newIndex), JSON.stringify(newIndex));
      }
    }
    return null;
  },

  _getAfter(node) {
    var stringIndex = node.getAttribute('data-pos');
    if (stringIndex) {
      var index = JSON.parse(stringIndex);
      var newIndex = this._incrementIndex(index);
      if (newIndex) {
        return this._getElement(this._getAtIndex(newIndex), JSON.stringify(newIndex));
      }
    }
    return null;
  },

  _getElement(jsonElement, index) {
    var elementCreators = {
      "P0": function(children) {
        var elt = window.document.createElement('div');
        elt.classList.add("P0");
        elt.setAttribute('data-pos', index);
        children.forEach(function(e){elt.appendChild(e);});
        var eltAfter = window.document.createElement('div');
        eltAfter.classList.add("P0after");
        eltAfter.setAttribute('data-pos', index);
        var eltMain = window.document.createElement('div');
        eltMain.appendChild(elt);
        eltMain.appendChild(eltAfter);
        eltMain.setAttribute('data-pos', index);
        return eltMain;
      },
      "P1": function(children) {
        var elt = window.document.createElement('div');
        elt.classList.add("P1");
        elt.setAttribute('data-pos', index);
        children.forEach(function(e){elt.appendChild(e);});
        var eltAfter = window.document.createElement('div');
        eltAfter.classList.add("P1after");
        eltAfter.setAttribute('data-pos', index);
        var eltMain = window.document.createElement('div');
        eltMain.appendChild(elt);
        eltMain.appendChild(eltAfter);
        eltMain.setAttribute('data-pos', index);
        return eltMain;
      },
      "P2": function(children) {
        var elt = window.document.createElement('div');
        elt.classList.add("P2");
        elt.setAttribute('data-pos', index);
        children.forEach(function(e){elt.appendChild(e);});
        var eltAfter = window.document.createElement('div');
        eltAfter.classList.add("P2after");
        eltAfter.setAttribute('data-pos', index);
        var eltMain = window.document.createElement('div');
        eltMain.appendChild(elt);
        eltMain.appendChild(eltAfter);
        eltMain.setAttribute('data-pos', index);
        return eltMain;
      },
      "P5": function(children) {
        var elt = window.document.createElement('div');
        elt.classList.add("P5");
        elt.setAttribute('data-pos', index);
        children.forEach(function(e){elt.appendChild(e);});
        var eltAfter = window.document.createElement('div');
        eltAfter.classList.add("P5after");
        eltAfter.setAttribute('data-pos', index);
        var eltMain = window.document.createElement('div');
        eltMain.appendChild(elt);
        eltMain.appendChild(eltAfter);
        eltMain.setAttribute('data-pos', index);
        return eltMain;
      },
      "P6": function(children) {
        var elt = window.document.createElement('div');
        elt.classList.add("P6");
        elt.setAttribute('data-pos', index);
        children.forEach(function(e){elt.appendChild(e);});
        var eltAfter = window.document.createElement('div');
        eltAfter.classList.add("P6after");
        eltAfter.setAttribute('data-pos', index);
        var eltMain = window.document.createElement('div');
        eltMain.appendChild(elt);
        eltMain.appendChild(eltAfter);
        eltMain.setAttribute('data-pos', index);
        return eltMain;
      },
      "C4": function(children) {
        var elt = window.document.createElement('div');
        elt.classList.add("C4");
        elt.setAttribute('data-pos', index);
        children.forEach(function(e){elt.appendChild(e);});
        return elt;
      },
      "C5": function(children) {
        var elt = window.document.createElement('div');
        elt.classList.add("C5");
        elt.setAttribute('data-pos', index);
        children.forEach(function(e){elt.appendChild(e);});
        return elt;
      },
      "C6": function(children) {
        var elt = window.document.createElement('div');
        elt.classList.add("C6");
        elt.setAttribute('data-pos', index);
        children.forEach(function(e){elt.appendChild(e);});
        return elt;
      },
      "C11": function(children) {
        var elt = window.document.createElement('div');
        elt.classList.add("C11");
        elt.setAttribute('data-pos', index);
        children.forEach(function(e){elt.appendChild(e);});
        return elt;
      },
      "C21": function(children) {
        var elt = window.document.createElement('div');
        elt.classList.add("C21");
        elt.setAttribute('data-pos', index);
        children.forEach(function(e){elt.appendChild(e);});
        return elt;
      },
      "C31": function(children) {
        var elt = window.document.createElement('div');
        elt.classList.add("C31");
        elt.setAttribute('data-pos', index);
        children.forEach(function(e){elt.appendChild(e);});
        return elt;
      },
      "br": function(children) {
        var elt = window.document.createElement('br');
        elt.setAttribute('data-pos', index);
        return elt;
      },
      "ul": function(children) {
        var elt = window.document.createElement('ul');
        elt.setAttribute('data-pos', index);
        children.forEach(function(e){elt.appendChild(e);});
        return elt;
      },
      "li": function(children) {
        var elt = window.document.createElement('li');
        elt.setAttribute('data-pos', index);
        children.forEach(function(e){elt.appendChild(e);});
        return elt;
      },
      "END": function(children) {
        var elt = window.document.createElement('img');
        elt.setAttribute('data-pos', index);
        elt.setAttribute('src', 'images/end.svg');
        elt.style.width = '33.33vw';
        elt.style.height = '20.79vw';
        elt.style.margin = '5vw 33.33vw 5vw';
        elt.style.display = 'block';
        var eltMain = window.document.createElement('div');
        eltMain.appendChild(elt);
        eltMain.setAttribute('data-pos', index);
        //children.forEach(function(e){elt.appendChild(e);});
        return eltMain;
      }
    };
    var _ge = function(je) {
      if (je === null) {
        je = "";
      }
      if (typeof je == "string") {
        return window.document.createTextNode(je);
      }
      var type = Object.keys(je)[0];
      var children;
      if ((typeof je[type] == "object") && Array.isArray(je[type])) {
        children = je[type].map(_ge);
      } else {
        children = [_ge(je[type])];
      }
      return elementCreators[type](children);
    };
    return _ge(jsonElement);
  }
});

module.exports = Container;
