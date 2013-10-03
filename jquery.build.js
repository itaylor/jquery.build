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
(function (){
    var ctor = function ($, document){
      /** Capability detection **/
      
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
      //IE < 9 can't create stylesheets like normal elements, it has to use 
      //a funky cssText property on its proprietary styleSheet object.
      var tempStyle = document.createElement("style");
      tempStyle.type = "text/css";
      var funkyStylesheetCreate = tempStyle.styleSheet && ('cssText' in tempStyle.styleSheet);

      
      //Many versions of IE will eat spaces off the front and back of text nodes
      var spaceTestElem = document.createElement("div");
      spaceTestElem.innerHTML = " s ";
      var spaceTestValue = spaceTestElem.childNodes[0].nodeValue;
      var requiresLeadingSpace = spaceTestValue.indexOf(" ") != 0;
      var requiresTrailingSpace = spaceTestValue.lastIndexOf(" ") != 2; 
      /** End Capability detection  */

      /** Support functions */

      //Regex Caching
      var regexApos = /&apos;/g;
      var regexLt = /</g;
      var regexGt = />/g;
      // These selector expressions were ripped from the Sizzle code.
      var elemExpr = /^((?:[\w\u00c0-\uFFFF\*_-]|\\.)+)/;
      var idExpr = /#((?:[\w\u00c0-\uFFFF_-]|\\.)+)/;
      var classExpr = /\.((?:[\w\u00c0-\uFFFF_-]|\\.)+)/g;
      var attrExpr = /\[\s*((?:[\w\u00c0-\uFFFF_-]|\\.)+)\s*(?:(\S?=)\s*(['"]*)(.*?)\3|)\s*\]/g;
      var attrPart = /[\[\]]/g;


      /**
       * Creates a shallow clone of an array.
       */
      var arrayClone = function (arr){
        var a = [];
        $.each(arr, function (i, o){a.push(o);});
        return a;
      };
      
      var addHtmlTextToFrag = function (f, text){
       
      };
      var addPlainTextToFrag = function (f, text){
        if(requiresLeadingSpace && text.charAt(0) === " "){
          f.appendChild(document.createTextNode(" "));
        }
        f.appendChild(document.createTextNode(text));
        if(requiresTrailingSpace && text.charAt(text.length -1) === " "){
          f.appendChild(document.createTextNode(" "));
        }
      };
      
      
      var addFx =  function (f, item){
        if(!item){
          return;
        }
        if (item.jquery){
          f.appendChild(item.get(0));
        }
        else if (item.nodeType == 1 || item.nodeType == 3 || item.nodeType == 11){ 
          /* Element, Text, and DocumentFragment nodes get appended */
          f.appendChild(item);
        }
        else if ($.isArray(item)){
          var i = 0;
          var l = item.length;
          for(i = 0; i < l; i++){
             addFx(f, item[i]);
          }
        }
        else{
          addPlainTextToFrag(f, item.toString());
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
            for(i = 0; i < l; i++){
              addFx(f, children[i]);
            }
          }
          else {
            addFx(f,children);
          }
        }
        return f;
      };
      
      /**
       * @function This function converts a HTML string to a DocumentFragment.
       * It uses Element.innerHTML to do the parsing, so it's as fast as possible.
       * 
       * Basically, if you want HTML to pass through $.build without it being HTMLEncoded,
       * you must wrap the text with a call to this function.
       * 
       * 
       * @example: 
       *  $.build("div", [ 
       *    $.build.html("This is a <em>HTML</em> string!"),
       *    "This is a <em>Plain Text</em> string!
       *   ]);
       *  result:
       *  <div>
       *    This is a <em>HTML</em> string!
       *    This is a &lt;em&gt;Plain Text&lt;/em&gt; string!
       *  </div>
       */
      var html = function (text){
        var f = document.createDocumentFragment();
        if(text){
          //Browsers/DOM impls supporting DocumentFragment.innerHTML get a fast track. 
          if(typeof f.innerHTML != "undefined"){
            f.innerHTML = text;
          }else{
            var tempElem = document.createElement("div");
            tempElem.innerHTML = text.replace(regexApos, "'");
            if(requiresLeadingSpace && text.indexOf(" ") == 0){
              f.appendChild(document.createTextNode(" "));
            }
            while(tempElem.hasChildNodes()){
              //appending to a new parent removes the item from the old parent, 
              //thus this operation is safe and fast.
              f.appendChild(tempElem.firstChild);
            }
            if(requiresTrailingSpace && text.lastIndexOf(" ") == (text.length -1)){
              f.appendChild(document.createTextNode(" "));
            }
          }
        }
        return f;
      };

      /* End support functions */

      $.build = function (selector, attributes, children){
        if(arguments.length == 2 && attributes!=null &&
            (typeof attributes == "string" || $.isArray(attributes) || attributes.nodeType || attributes.jquery)){
          children = attributes;
          attributes = null;
        }
        selector = selector || "";

        var elemTag;
        elemTag = selector.match(elemExpr);
        if(elemTag){
          elemTag = elemTag[0];
        }
        var id = null;
        if(selector.indexOf("#") != -1){
          var id = selector.match(idExpr);
          if (id){
              id = id[1];
          }
          else{
            id = null;
          } 
        }
        var className;
        if(selector.indexOf(".") != -1){
          className = selector.match(classExpr);
        }
        var attrs;
        if(selector.indexOf("[") != -1){
          attrs = selector.match(attrExpr);
        }
        elemTag = elemTag || "div";
        if (attrs){
          attributes = attributes || {};
          $.each(attrs, function (i, attr){
            var parts = attr.replace(attrPart, "").split("=");
            if (parts && parts.length ==2){
              attributes[parts[0]] = parts[1];
            }
          });
        }
        attributes = attributes || {};
        var elem;
        if(!hasNormalInputButtonCreate && (elemTag === "input" || elemTag ==="button")){
          // In IE versions before IE 9, an input or button type can only be set
          // once, at creation. If you try to set it
          // after the fact, you get exceptions
          var type = attributes.type ? "type=\""+attributes.type+"\"" : ""; 
          // Name has to be set at creation time for radio buttons only, but
          // doesn't hurt for any other input/buttons.
          var name = attributes.name ? "name=\""+attributes.name+"\"" : "";
          elem = document.createElement("<"+elemTag+" " +type+" " +name+">");

          delete attributes["type"];
          delete attributes["name"];
        }
        else{
          elem = document.createElement(elemTag);
        }

        var jqElem = $(elem);
        
        // Set the attributes using jQuery.
        if(attributes){
          jqElem.attr(attributes);
        }
        if(id){
          elem.id = id;
        }
        
        
        if(elemTag === "img"){
          // IE 8 bug with image elements in IE 8 standards mode.
          // IE 8 will automatically add in width and height attributes to 'help'
          // you if it has the image already in its cache.
          // in doing so, it craps up it's own rendering if there is a max-height
          // or max-width style applied.
          // we will remove any unrequested height and width attributes here.
          if(!attributes.width){
            jqElem.removeAttr("width");
          }
          if(!attributes.height){
            jqElem.removeAttr("height");
          }       
        }
        if (className){
          var cls ="";
          $.each(className, function (i, str) { cls+= str.replace(".", "") + " ";});
          elem.className = $.trim(elem.className + " " + cls);
        }    

        if(funkyStylesheetCreate && elemTag == "style" && typeof children === "string"){
          //IE < 9 has a weird implementation of stylesheets, 
          //You can't just append a normal text node of styles to a style element,
          //You have to first give the stylesheet a type of "text/css", then add the string
          //as the cssText property.
          if(!jqElem.attr("type")){
            jqElem.attr("type", "text/css");
          }
          elem.styleSheet.cssText = children;
        }else if (children){
          if(children.nodeType == 11)
            // Already a document fragment.
            elem.appendChild(children);
          else
            elem.appendChild(docFrag(children));
        }
        return jqElem;
      };
      
      //expose docFrag and html children of $.build 
      $.build.docFrag = docFrag;
      $.build.html = html;
      return $.build;
    };
    
    if(typeof module !== "undefined" && module.exports){
      module.exports = ctor;
    }
    if(typeof window !== "undefined" && window.jQuery && window.document) {
      ctor(window.jQuery, window.document);
    }
}
)();

