           _ ____                           __          _ __     __
          (_) __ \__  _____  _______  __   / /_  __  __(_) /____/ /
         / / / / / / / / _ \/ ___/ / / /  / __ \/ / / / / // __  / 
        / / /_/ / /_/ /  __/ /  / /_/ /_ / /_/ / /_/ / / // /_/ /  
     __/ /\___\_\__,_/\___/_/   \__, /(_)_.___/\__,_/_/_/ \__,_/    v1_0_2  
    /___/                      /____/                              
    -----------------------------------------------------------------------

A DOM Node builder for jQuery in the spirit of Scriptaculous Builder.node

##Features:
* Flexible syntax enables chaining and nesting of DOM nodes and bindings, inline assignments.
* Elminates the need to re-query the DOM for dynamically created nodes.
* Uses standard CSS conventions for classNames, ids, attributes.
* Works well in IE 6+ and all modern browsers.  Contains no browser version sniffing, only capability testing.
* Good set of tests that can be run from either browsers or node.js.
* MIT Licensed.

##Example syntax:
```javascript
    var $b = $.build;
	  var elem = $b("#usernameWrapper", [
  		$b("label[for=username]", "Enter your username"),
  		$b("input#username[type=text]"),
  		$b("button[type=button]", "Save")
  		  .click(function (){
  		    alert("hey");
  		  })
	  ]);
```
This generates a jQuery wrapped DOM node in the elem variable with the HTML content:
```html
    <div id="usernameWrapper">
      <label for="username">Enter your username</label>
      <input id="username" type="text">
      <button type="button">Save<button>
    </div>
```
Additionally, the button element has a click handler bound to to it.

The return of each call to $.build is a jQuery object, which makes all kinds of fun function chaining possible.  This is an overly simple example, though, and doesn't show much of the power and flexibility of the syntax.  For more in-depth code samples and use cases see the examples and tests folders.

##Using in the browser
 1. Make sure you have jQuery inlcuded on your page
 2. Include a `<script src="/your/path/to/jquery.build.js"></script>`
 3. The jQuery.build function can be accessed from then on.
 For an example, see `/examples/simple.html`
 
##Using inside of Node.js    
At present, it's not particularly useful to include jQuery.build in node.js, however, I've got another project in the pipeline that will seek to fix that :-) 
That said, you can definitely do it today using jsdom and jquery to provide the DOM manipulation support it needs.  There some is code that does this in `/test/setup.js` that is used to run the unit tests under node.js/jsdom if you're interested. 

You can install with `npm install jquery.build`
You can run the tests with `npm test`  

##History:
I fell in love with the Builder.node syntax back in 2007.  Since then I've written several versions of node builders for different JS frameworks.  This is the one that I've eventually settled on as being my go-to way for creating markup from JavaScript.  I find it preferable to templating solutions, as it can intermingled with code in a way that is difficult to do with templates.

##License:
Copyright (c) 2011 Ian Taylor

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
