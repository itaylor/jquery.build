if(typeof window === "undefined"){
  require("./setupWindow.js");
}
suite("$.build.docFrag tests");

test("Simple base case with three elements in an array", 1, function() {
  var elem1 = document.createElement("div");
  var elem2 = document.createElement("div");
  var elem3 = document.createElement("div");

  var tgt = document.createElement("div");
  var df = $.build.docFrag([ elem1, elem2, elem3 ]);
  tgt.appendChild(df);
  htmlCompare(tgt.innerHTML, "<div></div><div></div><div></div>");
});

test("Non array (single element) input", 1, function() {
  var elem1 = document.createElement("div");
  var tgt = document.createElement("div");
  var df = $.build.docFrag(elem1);
  tgt.appendChild(df);
  htmlCompare(tgt.innerHTML, "<div></div>");
});

test("Non array (single element) literal string input", 1, function() {
  var tgt = document.createElement("div");
  var df = $.build.docFrag("this <p>is cool</p>");
  tgt.appendChild(df);
  htmlCompare(tgt.innerHTML, "this &lt;p&gt;is cool&lt;/p&gt;");
});

test("Non array (single element) html string input", 1, function() {
  var tgt = document.createElement("div");
  var df = $.build.docFrag($.build.html("this <p>is cool</p>"));
  tgt.appendChild(df);
  htmlCompare(tgt.innerHTML, "this <p>is cool</p>");
});


test("Mixing strings with elements", 1, function() {
  var elem1 = document.createElement("div");
  var elem2 = "this is a string";
  var elem3 = document.createElement("div");

  var tgt = document.createElement("div");
  var df = $.build.docFrag([ elem1, elem2, elem3 ]);
  tgt.appendChild(df);
  htmlCompare(tgt.innerHTML, "<div></div>this is a string<div></div>");
});

test("Mixing strings with elements and nested DocFrags", 1, function() {
  var elem1 = document.createElement("div");
  var elem2 = "this is a string";
  var elem3 = $.build.docFrag([ "test" ]);

  var tgt = document.createElement("div");
  var df = $.build.docFrag([ elem1, elem2, elem3 ]);
  tgt.appendChild(df);
  htmlCompare(tgt.innerHTML, "<div></div>this is a stringtest");
});

test("Nested arrays with nested docFrags", 1, function() {
  var elem1 = document.createElement("div");
  var elem2 = "this is a string";
  var elem3 = [ "test", $.build.docFrag(" cool") ];

  var tgt = document.createElement("div");
  var df = $.build.docFrag([ elem1, elem2, elem3 ]);
  tgt.appendChild(df);
  htmlCompare(tgt.innerHTML, "<div></div>this is a stringtest cool");
});

test("TextNodes appended properly", 1, function() {
  var elem1 = document.createElement("div");
  var elem2 = "this is a string";
  var elem3 = document.createTextNode(" it was made with a textnode");

  var tgt = document.createElement("div");
  var df = $.build.docFrag([ elem1, elem2, elem3 ]);
  tgt.appendChild(df);
  htmlCompare(tgt.innerHTML, "<div></div>this is a string it was made with a textnode");
});

test("Strings with html in them using $.build.html",1,function() {
  var elem1 = document.createElement("div");
  var elem2 = $.build.html("this is a <b>string</b>");

  var tgt = document.createElement("div");
  var df = $.build.docFrag([ elem1, elem2 ]);
  tgt.appendChild(df);
  htmlCompare(tgt.innerHTML, "<div></div>this is a <b>string</b>");
});

test("Strings with html in them using literals",1,function() {
  var elem1 = document.createElement("div");
  var elem2 = "this is a <b>string</b>";

  var tgt = document.createElement("div");
  var df = $.build.docFrag([ elem1, elem2 ]);
  tgt.appendChild(df);
  htmlCompare(tgt.innerHTML, "<div></div>this is a &lt;b&gt;string&lt;/b&gt;");
});


test("Strings with no html, but html entities in created using $.build.html", 1, function() {
  var elem1 = document.createElement("div");
  var elem2 = $.build.html("this is ian's \"test & string\"");

  var tgt = document.createElement("div");
  var df = $.build.docFrag([ elem1, elem2 ]);
  tgt.appendChild(df);
  
  htmlCompare(tgt.innerHTML, "<div></div>this is ian's \"test &amp; string\"");
});


test("Strings with no html, but html entities in created using literals", 1, function() {
  var elem1 = document.createElement("div");
  var elem2 = "this is ian's \"test & string\"";

  var tgt = document.createElement("div");
  var df = $.build.docFrag([ elem1, elem2 ]);
  tgt.appendChild(df);
  
  htmlCompare(tgt.innerHTML, "<div></div>this is ian's \"test &amp; string\"");
});

test("Strings with html and html entities in using literals",1, function() {
  var elem1 = document.createElement("div");
  var elem2 = "<p>this is ian's \"test & string\"</p>";

  var tgt = document.createElement("div");
  var df = $.build.docFrag([ elem1, elem2 ]);
  tgt.appendChild(df);
  htmlCompare(tgt.innerHTML, "<div></div>&lt;p&gt;this is ian's \"test &amp; string\"&lt;/p&gt;");
});

test("Strings with html and html entities in using $.build.html",1, function() {
  var elem1 = document.createElement("div");
  var elem2 = $.build.html("<p>this is ian's \"test & string\"</p>");

  var tgt = document.createElement("div");
  var df = $.build.docFrag([ elem1, elem2 ]);
  tgt.appendChild(df);
  htmlCompare(tgt.innerHTML, "<div></div><p>this is ian's \"test &amp; string\"</p>");
});

test("String with lots of foreign characters in using $.build.html", 1, function() {
  var elem1 = document.createElement("div");
  var elem2 = $.build.html("<p>&iexcl;dios mio iañ &atilde; &#227;!</p>");

  var tgt = document.createElement("div");
  var df = $.build.docFrag([ elem1, elem2 ]);
  tgt.appendChild(df);
  htmlCompare(tgt.innerHTML, "<div></div><p>¡dios mio iañ ã ã!</p>");
});

test("String with lots of foreign characters in using literals", 1, function() {
  var elem1 = document.createElement("div");
  var elem2 = "<p>&iexcl;dios mio iañ &atilde; &#227;!</p>";

  var tgt = document.createElement("div");
  var df = $.build.docFrag([ elem1, elem2 ]);
  tgt.appendChild(df);
  htmlCompare(tgt.innerHTML, "<div></div>&lt;p&gt;&amp;iexcl;dios mio iañ &amp;atilde; &amp;#227;!&lt;/p&gt;");
});

test("Spaces in strings test",1, function() {
  var elem1 = document.createElement("div");
  var elem2 = " this is a string ";
  var elem3 = [ " test ", $.build.docFrag(" cool ") ];

  var tgt = document.createElement("div");
  var df = $.build.docFrag([ elem1, elem2, elem3 ]);
  tgt.appendChild(df);
  htmlCompare(tgt.innerHTML, "<div></div> this is a string  test  cool ");
});

test("Spaces in strings test using $.build.html",1, function() {
  var elem1 = document.createElement("div");
  var elem2 = $.build.html(" this is a string ");
  var elem3 = [ $.build.html(" test "), $.build.docFrag($.build.html(" cool ")) ];

  var tgt = document.createElement("div");
  var df = $.build.docFrag([ elem1, elem2, elem3 ]);
  tgt.appendChild(df);
  htmlCompare(tgt.innerHTML, "<div></div> this is a string  test  cool ");
});
        