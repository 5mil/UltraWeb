

/* ---- plugins/Sidebar/media/Class.coffee ---- */


(function() {
  var Class,
    __slice = [].slice;

  Class = (function() {
    function Class() {}

    Class.prototype.trace = true;

    Class.prototype.log = function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      if (!this.trace) {
        return;
      }
      if (typeof console === 'undefined') {
        return;
      }
      args.unshift("[" + this.constructor.name + "]");
      console.log.apply(console, args);
      return this;
    };

    Class.prototype.logStart = function() {
      var args, name;
      name = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      if (!this.trace) {
        return;
      }
      this.logtimers || (this.logtimers = {});
      this.logtimers[name] = +(new Date);
      if (args.length > 0) {
        this.log.apply(this, ["" + name].concat(__slice.call(args), ["(started)"]));
      }
      return this;
    };

    Class.prototype.logEnd = function() {
      var args, ms, name;
      name = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      ms = +(new Date) - this.logtimers[name];
      this.log.apply(this, ["" + name].concat(__slice.call(args), ["(Done in " + ms + "ms)"]));
      return this;
    };

    return Class;

  })();

  window.Class = Class;

}).call(this);


/* ---- plugins/Sidebar/media/Scrollable.js ---- */


/* via http://jsfiddle.net/elGrecode/00dgurnn/ */

window.initScrollable = function () {

    var scrollContainer = document.querySelector('.scrollable'),
        scrollContentWrapper = document.querySelector('.scrollable .content-wrapper'),
        scrollContent = document.querySelector('.scrollable .content'),
        contentPosition = 0,
        scrollerBeingDragged = false,
        scroller,
        topPosition,
        scrollerHeight;

    function calculateScrollerHeight() {
        // *Calculation of how tall scroller should be
        var visibleRatio = scrollContainer.offsetHeight / scrollContentWrapper.scrollHeight;
        if (visibleRatio == 1)
            scroller.style.display = "none";
        else
            scroller.style.display = "block";
        return visibleRatio * scrollContainer.offsetHeight;
    }

    function moveScroller(evt) {
        // Move Scroll bar to top offset
        var scrollPercentage = evt.target.scrollTop / scrollContentWrapper.scrollHeight;
        topPosition = scrollPercentage * (scrollContainer.offsetHeight - 5); // 5px arbitrary offset so scroll bar doesn't move too far beyond content wrapper bounding box
        scroller.style.top = topPosition + 'px';
    }

    function startDrag(evt) {
        normalizedPosition = evt.pageY;
        contentPosition = scrollContentWrapper.scrollTop;
        scrollerBeingDragged = true;
        window.addEventListener('mousemove', scrollBarScroll);
        return false;
    }

    function stopDrag(evt) {
        scrollerBeingDragged = false;
        window.removeEventListener('mousemove', scrollBarScroll);
    }

    function scrollBarScroll(evt) {
        if (scrollerBeingDragged === true) {
            evt.preventDefault();
            var mouseDifferential = evt.pageY - normalizedPosition;
            var scrollEquivalent = mouseDifferential * (scrollContentWrapper.scrollHeight / scrollContainer.offsetHeight);
            scrollContentWrapper.scrollTop = contentPosition + scrollEquivalent;
        }
    }

    function updateHeight() {
        scrollerHeight = calculateScrollerHeight() - 10;
        scroller.style.height = scrollerHeight + 'px';
    }

    function createScroller() {
        // *Creates scroller element and appends to '.scrollable' div
        // create scroller element
        scroller = document.createElement("div");
        scroller.className = 'scroller';

        // determine how big scroller should be based on content
        scrollerHeight = calculateScrollerHeight() - 10;

        if (scrollerHeight / scrollContainer.offsetHeight < 1) {
            // *If there is a need to have scroll bar based on content size
            scroller.style.height = scrollerHeight + 'px';

            // append scroller to scrollContainer div
            scrollContainer.appendChild(scroller);

            // show scroll path divot
            scrollContainer.className += ' showScroll';

            // attach related draggable listeners
            scroller.addEventListener('mousedown', startDrag);
            window.addEventListener('mouseup', stopDrag);
        }

    }

    createScroller();


    // *** Listeners ***
    scrollContentWrapper.addEventListener('scroll', moveScroller);

    return updateHeight;
};


/* ---- plugins/Sidebar/media/Sidebar.coffee ---- */


(function() {
  var Sidebar,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __hasProp = {}.hasOwnProperty;

  Sidebar = (function(_super) {
    __extends(Sidebar, _super);

    function Sidebar() {
      this.unloadGlobe = __bind(this.unloadGlobe, this);
      this.displayGlobe = __bind(this.displayGlobe, this);
      this.loadGlobe = __bind(this.loadGlobe, this);
      this.animDrag = __bind(this.animDrag, this);
      this.waitMove = __bind(this.waitMove, this);
      this.tag = null;
      this.container = null;
      this.opened = false;
      this.width = 410;
      this.fixbutton = $(".fixbutton");
      this.fixbutton_addx = 0;
      this.fixbutton_initx = 0;
      this.fixbutton_targetx = 0;
      this.frame = $("#inner-iframe");
      this.initFixbutton();
      this.dragStarted = 0;
      this.globe = null;
      this.original_set_site_info = wrapper.setSiteInfo;
      if (false) {
        this.startDrag();
        this.moved();
        this.fixbutton_targetx = this.fixbutton_initx - this.width;
        this.stopDrag();
      }
    }

    Sidebar.prototype.initFixbutton = function() {
      this.fixbutton.on("mousedown", (function(_this) {
        return function(e) {
          e.preventDefault();
          _this.fixbutton.off("click");
          _this.fixbutton.off("mousemove");
          _this.dragStarted = +(new Date);
          return _this.fixbutton.one("mousemove", function(e) {
            _this.fixbutton_addx = _this.fixbutton.offset().left - e.pageX;
            return _this.startDrag();
          });
        };
      })(this));
      this.fixbutton.parent().on("click", (function(_this) {
        return function(e) {
          return _this.stopDrag();
        };
      })(this));
      return this.fixbutton_initx = this.fixbutton.offset().left;
    };

    Sidebar.prototype.startDrag = function() {
      this.log("startDrag");
      this.fixbutton_targetx = this.fixbutton_initx;
      this.fixbutton.addClass("dragging");
      $("<div class='drag-bg'></div>").appendTo(document.body);
      if (navigator.userAgent.indexOf('MSIE') !== -1 || navigator.appVersion.indexOf('Trident/') > 0) {
        this.fixbutton.css("pointer-events", "none");
      }
      this.fixbutton.one("click", (function(_this) {
        return function(e) {
          _this.stopDrag();
          _this.fixbutton.removeClass("dragging");
          if (Math.abs(_this.fixbutton.offset().left - _this.fixbutton_initx) > 5) {
            return e.preventDefault();
          }
        };
      })(this));
      this.fixbutton.parents().on("mousemove", this.animDrag);
      this.fixbutton.parents().on("mousemove", this.waitMove);
      return this.fixbutton.parents().on("mouseup", (function(_this) {
        return function(e) {
          e.preventDefault();
          return _this.stopDrag();
        };
      })(this));
    };

    Sidebar.prototype.waitMove = function(e) {
      if (Math.abs(this.fixbutton.offset().left - this.fixbutton_targetx) > 10 && (+(new Date)) - this.dragStarted > 100) {
        this.moved();
        return this.fixbutton.parents().off("mousemove", this.waitMove);
      }
    };

    Sidebar.prototype.moved = function() {
      this.log("Moved");
      this.createHtmltag();
      $(document.body).css("perspective", "1000px").addClass("body-sidebar");
      $(window).off("resize");
      $(window).on("resize", (function(_this) {
        return function() {
          $(document.body).css("height", $(window).height());
          return _this.scrollable();
        };
      })(this));
      $(window).trigger("resize");
      return wrapper.setSiteInfo = (function(_this) {
        return function(site_info) {
          _this.setSiteInfo(site_info);
          return _this.original_set_site_info.apply(wrapper, arguments);
        };
      })(this);
    };

    Sidebar.prototype.setSiteInfo = function(site_info) {
      this.updateHtmlTag();
      return this.displayGlobe();
    };

    Sidebar.prototype.createHtmltag = function() {
      if (!this.container) {
        this.container = $("<div class=\"sidebar-container\"><div class=\"sidebar scrollable\"><div class=\"content-wrapper\"><div class=\"content\">\n</div></div></div></div>");
        this.container.appendTo(document.body);
        this.tag = this.container.find(".sidebar");
        this.updateHtmlTag();
        return this.scrollable = window.initScrollable();
      }
    };

    Sidebar.prototype.updateHtmlTag = function() {
      return wrapper.ws.cmd("sidebarGetHtmlTag", {}, (function(_this) {
        return function(res) {
          if (_this.tag.find(".content").children().length === 0) {
            _this.log("Creating content");
            morphdom(_this.tag.find(".content")[0], '<div class="content">' + res + '</div>');
            return _this.scrollable();
          } else {
            _this.log("Patching content");
            return morphdom(_this.tag.find(".content")[0], '<div class="content">' + res + '</div>', {
              onBeforeMorphEl: function(from_el, to_el) {
                if (from_el.className === "globe") {
                  return false;
                } else {
                  return true;
                }
              }
            });
          }
        };
      })(this));
    };

    Sidebar.prototype.animDrag = function(e) {
      var mousex, overdrag, overdrag_percent, targetx;
      mousex = e.pageX;
      overdrag = this.fixbutton_initx - this.width - mousex;
      if (overdrag > 0) {
        overdrag_percent = 1 + overdrag / 300;
        mousex = (e.pageX + (this.fixbutton_initx - this.width) * overdrag_percent) / (1 + overdrag_percent);
      }
      targetx = this.fixbutton_initx - mousex - this.fixbutton_addx;
      this.fixbutton.offset({
        left: mousex + this.fixbutton_addx
      });
      if (this.tag) {
        this.tag.css("transform", "translateX(" + (0 - targetx) + "px)");
      }
      if ((!this.opened && targetx > this.width / 3) || (this.opened && targetx > this.width * 0.9)) {
        return this.fixbutton_targetx = this.fixbutton_initx - this.width;
      } else {
        return this.fixbutton_targetx = this.fixbutton_initx;
      }
    };

    Sidebar.prototype.stopDrag = function() {
      var targetx;
      this.fixbutton.parents().off("mousemove");
      this.fixbutton.off("mousemove");
      this.fixbutton.css("pointer-events", "");
      $(".drag-bg").remove();
      if (!this.fixbutton.hasClass("dragging")) {
        return;
      }
      this.fixbutton.removeClass("dragging");
      if (this.fixbutton_targetx !== this.fixbutton.offset().left) {
        this.fixbutton.stop().animate({
          "left": this.fixbutton_targetx
        }, 500, "easeOutBack", (function(_this) {
          return function() {
            if (_this.fixbutton_targetx === _this.fixbutton_initx) {
              _this.fixbutton.css("left", "auto");
            } else {
              _this.fixbutton.css("left", _this.fixbutton_targetx);
            }
            return $(".fixbutton-bg").trigger("mouseout");
          };
        })(this));
        if (this.fixbutton_targetx === this.fixbutton_initx) {
          targetx = 0;
          this.opened = false;
        } else {
          targetx = this.width;
          if (!this.opened) {
            this.onOpened();
          }
          this.opened = true;
        }
        this.tag.css("transition", "0.4s ease-out");
        this.tag.css("transform", "translateX(-" + targetx + "px)").one(transitionEnd, (function(_this) {
          return function() {
            _this.tag.css("transition", "");
            if (!_this.opened) {
              _this.container.remove();
              _this.container = null;
              _this.tag.remove();
              return _this.tag = null;
            }
          };
        })(this));
        this.log("stopdrag", "opened:", this.opened);
        if (!this.opened) {
          return this.onClosed();
        }
      }
    };

    Sidebar.prototype.onOpened = function() {
      this.log("Opened");
      this.scrollable();
      this.tag.find("#checkbox-owned").off("click").on("click", (function(_this) {
        return function() {
          return setTimeout((function() {
            return _this.scrollable();
          }), 300);
        };
      })(this));
      this.tag.find("#button-sitelimit").on("click", (function(_this) {
        return function() {
          wrapper.ws.cmd("siteSetLimit", $("#input-sitelimit").val(), function() {
            wrapper.notifications.add("done-sitelimit", "done", "Site storage limit modified!", 5000);
            return _this.updateHtmlTag();
          });
          return false;
        };
      })(this));
      this.tag.find("#checkbox-owned").on("click", (function(_this) {
        return function() {
          return wrapper.ws.cmd("siteSetOwned", [_this.tag.find("#checkbox-owned").is(":checked")]);
        };
      })(this));
      this.tag.find("#checkbox-autodownloadoptional").on("click", (function(_this) {
        return function() {
          return wrapper.ws.cmd("siteSetAutodownloadoptional", [_this.tag.find("#checkbox-autodownloadoptional").is(":checked")]);
        };
      })(this));
      this.tag.find("#button-identity").on("click", (function(_this) {
        return function() {
          wrapper.ws.cmd("certSelect");
          return false;
        };
      })(this));
      this.tag.find("#checkbox-owned").on("click", (function(_this) {
        return function() {
          return wrapper.ws.cmd("siteSetOwned", [_this.tag.find("#checkbox-owned").is(":checked")]);
        };
      })(this));
      this.tag.find("#button-settings").on("click", (function(_this) {
        return function() {
          wrapper.ws.cmd("fileGet", "content.json", function(res) {
            var data, json_raw;
            data = JSON.parse(res);
            data["title"] = $("#settings-title").val();
            data["description"] = $("#settings-description").val();
            json_raw = unescape(encodeURIComponent(JSON.stringify(data, void 0, '\t')));
            return wrapper.ws.cmd("fileWrite", ["content.json", btoa(json_raw)], function(res) {
              if (res !== "ok") {
                return wrapper.notifications.add("file-write", "error", "File write error: " + res);
              } else {
                wrapper.notifications.add("file-write", "done", "Site settings saved!", 5000);
                return _this.updateHtmlTag();
              }
            });
          });
          return false;
        };
      })(this));
      this.tag.find("#button-sign").on("click", (function(_this) {
        return function() {
          var inner_path;
          inner_path = _this.tag.find("#select-contents").val();
          if (wrapper.site_info.privatekey) {
            wrapper.ws.cmd("siteSign", ["stored", inner_path], function(res) {
              return wrapper.notifications.add("sign", "done", inner_path + " Signed!", 5000);
            });
          } else {
            wrapper.displayPrompt("Enter your private key:", "password", "Sign", function(privatekey) {
              return wrapper.ws.cmd("siteSign", [privatekey, inner_path], function(res) {
                if (res === "ok") {
                  return wrapper.notifications.add("sign", "done", inner_path + " Signed!", 5000);
                }
              });
            });
          }
          return false;
        };
      })(this));
      this.tag.find("#button-publish").on("click", (function(_this) {
        return function() {
          var inner_path;
          inner_path = _this.tag.find("#select-contents").val();
          _this.tag.find("#button-publish").addClass("loading");
          return wrapper.ws.cmd("sitePublish", {
            "inner_path": inner_path,
            "sign": false
          }, function() {
            return _this.tag.find("#button-publish").removeClass("loading");
          });
        };
      })(this));
      return this.loadGlobe();
    };

    Sidebar.prototype.onClosed = function() {
      $(window).off("resize");
      $(document.body).css("transition", "0.6s ease-in-out").removeClass("body-sidebar").on(transitionEnd, (function(_this) {
        return function(e) {
          if (e.target === document.body) {
            $(document.body).css("height", "auto").css("perspective", "").css("transition", "").off(transitionEnd);
            return _this.unloadGlobe();
          }
        };
      })(this));
      return wrapper.setSiteInfo = this.original_set_site_info;
    };

    Sidebar.prototype.loadGlobe = function() {
      if (this.tag.find(".globe").hasClass("loading")) {
        return setTimeout(((function(_this) {
          return function() {
            if (typeof DAT === "undefined") {
              return $.getScript("/uimedia/globe/all.js", _this.displayGlobe);
            } else {
              return _this.displayGlobe();
            }
          };
        })(this)), 600);
      }
    };

    Sidebar.prototype.displayGlobe = function() {
      return wrapper.ws.cmd("sidebarGetPeers", [], (function(_this) {
        return function(globe_data) {
          if (_this.globe) {
            _this.globe.scene.remove(_this.globe.points);
            _this.globe.addData(globe_data, {
              format: 'magnitude',
              name: "hello",
              animated: false
            });
            _this.globe.createPoints();
          } else {
            _this.globe = new DAT.Globe(_this.tag.find(".globe")[0], {
              "imgDir": "/uimedia/globe/"
            });
            _this.globe.addData(globe_data, {
              format: 'magnitude',
              name: "hello"
            });
            _this.globe.createPoints();
            _this.globe.animate();
          }
          return _this.tag.find(".globe").removeClass("loading");
        };
      })(this));
    };

    Sidebar.prototype.unloadGlobe = function() {
      if (!this.globe) {
        return false;
      }
      this.globe.unload();
      return this.globe = null;
    };

    return Sidebar;

  })(Class);

  window.sidebar = new Sidebar();

  window.transitionEnd = 'transitionend webkitTransitionEnd oTransitionEnd otransitionend';

}).call(this);


/* ---- plugins/Sidebar/media/morphdom.js ---- */


(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.morphdom = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var specialElHandlers = {
    /**
     * Needed for IE. Apparently IE doesn't think
     * that "selected" is an attribute when reading
     * over the attributes using selectEl.attributes
     */
    OPTION: function(fromEl, toEl) {
        if ((fromEl.selected = toEl.selected)) {
            fromEl.setAttribute('selected', '');
        } else {
            fromEl.removeAttribute('selected', '');
        }
    },
    /**
     * The "value" attribute is special for the <input> element
     * since it sets the initial value. Changing the "value"
     * attribute without changing the "value" property will have
     * no effect since it is only used to the set the initial value.
     * Similar for the "checked" attribute.
     */
    /*INPUT: function(fromEl, toEl) {
        fromEl.checked = toEl.checked;
        fromEl.value = toEl.value;

        if (!toEl.hasAttribute('checked')) {
            fromEl.removeAttribute('checked');
        }

        if (!toEl.hasAttribute('value')) {
            fromEl.removeAttribute('value');
        }
    }*/
};

function noop() {}

/**
 * Loop over all of the attributes on the target node and make sure the
 * original DOM node has the same attributes. If an attribute
 * found on the original node is not on the new node then remove it from
 * the original node
 * @param  {HTMLElement} fromNode
 * @param  {HTMLElement} toNode
 */
function morphAttrs(fromNode, toNode) {
    var attrs = toNode.attributes;
    var i;
    var attr;
    var attrName;
    var attrValue;
    var foundAttrs = {};

    for (i=attrs.length-1; i>=0; i--) {
        attr = attrs[i];
        if (attr.specified !== false) {
            attrName = attr.name;
            attrValue = attr.value;
            foundAttrs[attrName] = true;

            if (fromNode.getAttribute(attrName) !== attrValue) {
                fromNode.setAttribute(attrName, attrValue);
            }
        }
    }

    // Delete any extra attributes found on the original DOM element that weren't
    // found on the target element.
    attrs = fromNode.attributes;

    for (i=attrs.length-1; i>=0; i--) {
        attr = attrs[i];
        if (attr.specified !== false) {
            attrName = attr.name;
            if (!foundAttrs.hasOwnProperty(attrName)) {
                fromNode.removeAttribute(attrName);
            }
        }
    }
}

/**
 * Copies the children of one DOM element to another DOM element
 */
function moveChildren(from, to) {
    var curChild = from.firstChild;
    while(curChild) {
        var nextChild = curChild.nextSibling;
        to.appendChild(curChild);
        curChild = nextChild;
    }
    return to;
}

function morphdom(fromNode, toNode, options) {
    if (!options) {
        options = {};
    }

    if (typeof toNode === 'string') {
        var newBodyEl = document.createElement('body');
        newBodyEl.innerHTML = toNode;
        toNode = newBodyEl.childNodes[0];
    }

    var savedEls = {}; // Used to save off DOM elements with IDs
    var unmatchedEls = {};
    var onNodeDiscarded = options.onNodeDiscarded || noop;
    var onBeforeMorphEl = options.onBeforeMorphEl || noop;
    var onBeforeMorphElChildren = options.onBeforeMorphElChildren || noop;

    function removeNodeHelper(node, nestedInSavedEl) {
        var id = node.id;
        // If the node has an ID then save it off since we will want
        // to reuse it in case the target DOM tree has a DOM element
        // with the same ID
        if (id) {
            savedEls[id] = node;
        } else if (!nestedInSavedEl) {
            // If we are not nested in a saved element then we know that this node has been
            // completely discarded and will not exist in the final DOM.
            onNodeDiscarded(node);
        }

        if (node.nodeType === 1) {
            var curChild = node.firstChild;
            while(curChild) {
                removeNodeHelper(curChild, nestedInSavedEl || id);
                curChild = curChild.nextSibling;
            }
        }
    }

    function walkDiscardedChildNodes(node) {
        if (node.nodeType === 1) {
            var curChild = node.firstChild;
            while(curChild) {


                if (!curChild.id) {
                    // We only want to handle nodes that don't have an ID to avoid double
                    // walking the same saved element.

                    onNodeDiscarded(curChild);

                    // Walk recursively
                    walkDiscardedChildNodes(curChild);
                }

                curChild = curChild.nextSibling;
            }
        }
    }

    function removeNode(node, parentNode, alreadyVisited) {
        parentNode.removeChild(node);

        if (alreadyVisited) {
            if (!node.id) {
                onNodeDiscarded(node);
                walkDiscardedChildNodes(node);
            }
        } else {
            removeNodeHelper(node);
        }
    }

    function morphEl(fromNode, toNode, alreadyVisited) {
        if (toNode.id) {
            // If an element with an ID is being morphed then it is will be in the final
            // DOM so clear it out of the saved elements collection
            delete savedEls[toNode.id];
        }

        if (onBeforeMorphEl(fromNode, toNode) === false) {
            return;
        }

        morphAttrs(fromNode, toNode);

        if (onBeforeMorphElChildren(fromNode, toNode) === false) {
            return;
        }

        var curToNodeChild = toNode.firstChild;
        var curFromNodeChild = fromNode.firstChild;
        var curToNodeId;

        var fromNextSibling;
        var toNextSibling;
        var savedEl;
        var unmatchedEl;

        outer: while(curToNodeChild) {
            toNextSibling = curToNodeChild.nextSibling;
            curToNodeId = curToNodeChild.id;

            while(curFromNodeChild) {
                var curFromNodeId = curFromNodeChild.id;
                fromNextSibling = curFromNodeChild.nextSibling;

                if (!alreadyVisited) {
                    if (curFromNodeId && (unmatchedEl = unmatchedEls[curFromNodeId])) {
                        unmatchedEl.parentNode.replaceChild(curFromNodeChild, unmatchedEl);
                        morphEl(curFromNodeChild, unmatchedEl, alreadyVisited);
                        curFromNodeChild = fromNextSibling;
                        continue;
                    }
                }

                var curFromNodeType = curFromNodeChild.nodeType;

                if (curFromNodeType === curToNodeChild.nodeType) {
                    var isCompatible = false;

                    if (curFromNodeType === 1) { // Both nodes being compared are Element nodes
                        if (curFromNodeChild.tagName === curToNodeChild.tagName) {
                            // We have compatible DOM elements
                            if (curFromNodeId || curToNodeId) {
                                // If either DOM element has an ID then we handle
                                // those differently since we want to match up
                                // by ID
                                if (curToNodeId === curFromNodeId) {
                                    isCompatible = true;
                                }
                            } else {
                                isCompatible = true;
                            }
                        }

                        if (isCompatible) {
                            // We found compatible DOM elements so add a
                            // task to morph the compatible DOM elements
                            morphEl(curFromNodeChild, curToNodeChild, alreadyVisited);
                        }
                    } else if (curFromNodeType === 3) { // Both nodes being compared are Text nodes
                        isCompatible = true;
                        curFromNodeChild.nodeValue = curToNodeChild.nodeValue;
                    }

                    if (isCompatible) {
                        curToNodeChild = toNextSibling;
                        curFromNodeChild = fromNextSibling;
                        continue outer;
                    }
                }

                // No compatible match so remove the old node from the DOM
                removeNode(curFromNodeChild, fromNode, alreadyVisited);

                curFromNodeChild = fromNextSibling;
            }

            if (curToNodeId) {
                if ((savedEl = savedEls[curToNodeId])) {
                    morphEl(savedEl, curToNodeChild, true);
                    curToNodeChild = savedEl; // We want to append the saved element instead
                } else {
                    // The current DOM element in the target tree has an ID
                    // but we did not find a match in any of the corresponding
                    // siblings. We just put the target element in the old DOM tree
                    // but if we later find an element in the old DOM tree that has
                    // a matching ID then we will replace the target element
                    // with the corresponding old element and morph the old element
                    unmatchedEls[curToNodeId] = curToNodeChild;
                }
            }

            // If we got this far then we did not find a candidate match for our "to node"
            // and we exhausted all of the children "from" nodes. Therefore, we will just
            // append the current "to node" to the end
            fromNode.appendChild(curToNodeChild);

            curToNodeChild = toNextSibling;
            curFromNodeChild = fromNextSibling;
        }

        // We have processed all of the "to nodes". If curFromNodeChild is non-null then
        // we still have some from nodes left over that need to be removed
        while(curFromNodeChild) {
            fromNextSibling = curFromNodeChild.nextSibling;
            removeNode(curFromNodeChild, fromNode, alreadyVisited);
            curFromNodeChild = fromNextSibling;
        }

        var specialElHandler = specialElHandlers[fromNode.tagName];
        if (specialElHandler) {
            specialElHandler(fromNode, toNode);
        }
    }

    var morphedNode = fromNode;
    var morphedNodeType = morphedNode.nodeType;
    var toNodeType = toNode.nodeType;

    // Handle the case where we are given two DOM nodes that are not
    // compatible (e.g. <div> --> <span> or <div> --> TEXT)
    if (morphedNodeType === 1) {
        if (toNodeType === 1) {
            if (morphedNode.tagName !== toNode.tagName) {
                onNodeDiscarded(fromNode);
                morphedNode = moveChildren(morphedNode, document.createElement(toNode.tagName));
            }
        } else {
            // Going from an element node to a text node
            return toNode;
        }
    } else if (morphedNodeType === 3) { // Text node
        if (toNodeType === 3) {
            morphedNode.nodeValue = toNode.nodeValue;
            return morphedNode;
        } else {
            onNodeDiscarded(fromNode);
            // Text node to something else
            return toNode;
        }
    }

    morphEl(morphedNode, toNode, false);

    // Fire the "onNodeDiscarded" event for any saved elements
    // that never found a new home in the morphed DOM
    for (var savedElId in savedEls) {
        if (savedEls.hasOwnProperty(savedElId)) {
            var savedEl = savedEls[savedElId];
            onNodeDiscarded(savedEl);
            walkDiscardedChildNodes(savedEl);
        }
    }

    if (morphedNode !== fromNode && fromNode.parentNode) {
        fromNode.parentNode.replaceChild(morphedNode, fromNode);
    }

    return morphedNode;
}

module.exports = morphdom;
},{}]},{},[1])(1)
});