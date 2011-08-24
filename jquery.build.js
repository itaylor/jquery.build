/**
 * The JQuery.node plugin. A DOM builder in the spirit of the Scriptaculous
 * Builder.Node.
 * 
 * Copyright (c) 2011 Ian Taylor
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

(function ($){
  /** Support functions */

  /**
   * Creates a shallow clone of an array.
   */
  var arrayClone = function (arr){
    var a = [];
    $.each(arr, function (i, o){a.push(o);});
    return a;
  };
  
  var htmlDecode = function(str){
    str = str.replace(/&apos;/g, "'"); //IE doesn't render &apos; but really, no browser should so we turn it into an apostrophe for all browsers.
    if (str.indexOf("<") == -1){
      return $("<div/>").html(str).text();
    }
    var ta=$.build("textarea");
    ta.html(str.replace(/</g,"&lt;").replace(/>/g,"&gt;"));
    return ta.val();
  };

  var addHtmlTextToFrag = function (f, text){
    var decodedTxt = htmlDecode(text);
    // Fast case for no tags.
    if (decodedTxt.indexOf("<") === -1){
      f.appendChild(document.createTextNode(decodedTxt));
      return;
    }        
    var tempElem = document.createElement("div");
    tempElem.innerHTML = decodedTxt;
    var c = arrayClone(tempElem.childNodes);
    var len = c.length;
    for(var i = 0; i < len; i++){
      f.appendChild(c[i]);
    }
  };
  var addFx =  function (f, item){
    if (item.jquery){
      f.appendChild(item.get(0));
    }
    else if (item.nodeType == 1 || item.nodeType == 3 || item.nodeType == 11){ 
      /* Element, Text, and DocumentFragment nodes get appended */
      f.appendChild(item);
    }
    else{ 
      addHtmlTextToFrag(f, item);
    }
  };
  /**
   * @function Allows you to create a new DocumentFragment node by passing in
   *           jQuery objects, Dom Nodes, or text strings, either inside of an
   *           array or as a single item.
   * 
   * See: http://ejohn.org/blog/dom-documentfragments/ for more on why to use
   * documentfragments.
   */
  var docFrag = function (children){
    var f = document.createDocumentFragment();
    if (children){
      if ($.isArray(children)) {
        var i =0;
        var l = children.length;
        for(i = 0; i < l; i++)
          addFx(f, docFrag(children[i]));
      }
      else {
        addFx(f,children);
      }
    }
    return f;
  };

  /* End support functions */


  // IE Pre 9 has a weird bug with buttons and input tags that
  // causes it to throw exceptions when trying to set type
  // After the element has been created.
  var hasNormalInputButtonCreate = true;
  try{
    var btn = document.createElement("button");
    btn.type = "button";
  }
  catch (e){
    hasNormalInputButtonCreate = false;
  }

  // These selector expressions were ripped from the Sizzle code.
  // We cache them here via closure.
  var elemExpr = /^((?:[\w\u00c0-\uFFFF\*_-]|\\.)+)/;
  var idExpr = /#((?:[\w\u00c0-\uFFFF_-]|\\.)+)/;
  var classExpr = /\.((?:[\w\u00c0-\uFFFF_-]|\\.)+)/g;
  var attrExpr = /\[\s*((?:[\w\u00c0-\uFFFF_-]|\\.)+)\s*(?:(\S?=)\s*(['"]*)(.*?)\3|)\s*\]/g;
  var attrPart = /[\[\]]/g;

  $.build = function (selector, attributes, children){
    if(arguments.length == 2 && attributes!=null &&
        (typeof attributes == "string" || $.isArray(attributes) || attributes.tagName || attributes.jquery)){
      children = attributes;
      attributes = {};
    }
    attributes = attributes || {};
    selector = selector || "";

    var elemTag;
    elemTag = selector.match(elemExpr);
    if(elemTag){
      elemTag = elemTag[0];
    }
    var id = selector.match(idExpr);
    var className = selector.match(classExpr);
    var attrs = selector.match(attrExpr);
    elemTag = elemTag || "div";
    if (id){
      attributes.id = id[1];
    }
    if (attrs){
      $.each(attrs, function (i, attr){
        var parts = attr.replace(attrPart, "").split("=");
        if (parts && parts.length ==2){
          attributes[parts[0]] = parts[1];
        }
      });
    }
    var elem;
    if(!hasNormalInputButtonCreate && (elemTag === "input" || elemTag ==="button")){
      // In IE versions before IE 9, an input or button type can only be set
      // once, at creation. If you try to set it
      // after the fact, you get exceptions
      var type = attributes.type ? "type=\""+attributes.type+"\"" : ""; 
      // Name has to be set at creation time for radio buttons only, but
      // doesn't hurt for any other input/buttons.
      var name = attributes.name ? "name=\""+attributes.name+"\"" : "";
      elem = $(document.createElement("<"+elemTag+" " +type+" " +name+">"));

      delete attributes["type"];
      delete attributes["name"];
    }
    else{
      elem = $(document.createElement(elemTag));
    }
    // Set the attributes using jQuery.
    elem.attr(attributes);

    if(elemTag === "img"){
      // IE 8 bug with image elements in IE 8 standards mode.
      // IE 8 will automatically add in width and height attributes to 'help'
      // you if it has the image already in its cache.
      // in doing so, it craps up it's own rendering if there is a max-height
      // or max-width style applied.
      // we will remove any unrequested height and width attributes here.
      if(!attributes.width){
        elem.removeAttr("width");
      }
      if(!attributes.height){
        elem.removeAttr("height");
      }        
    }
    if (className){
      var cls ="";
      $.each(className, function (i, str) { cls+= str.replace(".", "") + " ";});
      elem.addClass($.trim(cls));
    }    

    if (children){
      if(children.nodeType == 11)
        // Already a document fragment.
        elem.append(children);
      else
        elem.append(docFrag(children));
    }
    return elem;
  };
  
  //expose docFrag as a child of $.build (mostly for testing purposes, but still useful in its own right)
  $.build.docFrag = docFrag;
})(jQuery);
