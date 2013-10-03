if(typeof window === "undefined"){
  require("./setupWindow.js");
}
suite("$.build tests");

test("$.build selector defaults to div", 1, function() {
  var elem1 = $.build();
  var tgt = $.build("div");
  tgt.append(elem1);
  htmlCompare(tgt.html(), "<div></div>");
})

test("$.build selector nodeType", 1, function() {
  var elem1 = $.build("div");
  var tgt = $.build("div");
  tgt.append(elem1);
  htmlCompare(tgt.html(), "<div></div>");
});

test("$.build selector with class set css style", 2, function() {
  var elem1 = $.build("span.cool");
  var tgt = $.build("div");
  tgt.append(elem1);
  ok(elem1.hasClass("cool"));
  htmlCompare(tgt.html(), "<span class=\"cool\"></span>");
});

test("$.build selector with multiple classes set css style", 3, function() {
  var elem1 = $.build("span.cool.rad");
  var tgt = $.build("div");
  tgt.append(elem1);
  ok(elem1.hasClass("cool"));
  ok(elem1.hasClass("rad"));
  htmlCompare(tgt.html(), "<span class=\"cool rad\"></span>");
});

test("$.build selector with id set css style", 2, function() {
  var elem1 = $.build("span#nice");
  var tgt = $.build("div");
  tgt.append(elem1);
  equal(elem1.attr("id"), "nice");
  htmlCompare(tgt.html(), "<span id=\"nice\"></span>");
});

test("$.build selector with attr set css style", 2, function() {
  var elem1 = $.build("span[foo=bar]");
  var tgt = $.build("div");
  tgt.append(elem1);
  equal(elem1.attr("foo"), "bar");
  htmlCompare(tgt.html(), "<span foo=\"bar\"></span>");
});

test("$.build selector with attr set css style", 2, function() {
  var elem1 = $.build("span[foo=bar][this=that]");
  var tgt = $.build("div");
  tgt.append(elem1);
  equal(elem1.attr("foo"), "bar");
  equal(elem1.attr("this"), "that");
});

test("$.build selector with class, id, attr set css style", 5, function() {

  var elem1 = $.build("span#nice.cool.rad[foo=bar]");
  var tgt = $.build("div");
  tgt.append(elem1);
  equal(elem1.attr("foo"), "bar");
  equal(elem1.attr("id"), "nice");
  ok(elem1.hasClass("cool"));
  ok(elem1.hasClass("rad"));
  equal(elem1.get(0).tagName.toLowerCase(), "span");
});

test("$.build unset selector type results in div", 5, function() {
  var elem1 = $.build("#nice.cool.rad[foo=bar]");
  var tgt = $.build("div");
  tgt.append(elem1);
  equal(elem1.attr("foo"), "bar");
  equal(elem1.attr("id"), "nice");
  ok(elem1.hasClass("cool"));
  ok(elem1.hasClass("rad"));
  //can't use .html(), order of attributes is nondeterministic
  equal(elem1.get(0).tagName.toLowerCase(), "div");
});

test("$.build add attributes via object", 2, function() {
  var elem1 = $.build("span", { foo : "bar" });
  var tgt = $.build("div");
  tgt.append(elem1);
  equal(elem1.attr("foo"), "bar");
  htmlCompare(tgt.html(), "<span foo=\"bar\"></span>");
});

test("$.build add attributes via object and selector", 2, function() {
  var elem1 = $.build("span[this=that]", { foo : "bar" });
  var tgt = $.build("div");
  tgt.append(elem1);
  equal(elem1.attr("foo"), "bar");
  equal(elem1.attr("this"), "that");
});

test("$.build add attributes via selector trumps same attribute from object", 3, function() {
  var elem1 = $.build("span[this=that][flux=rad]", { foo : "bar", "this" : "theother" });
  var tgt = $.build("div");
  tgt.append(elem1);
  equal(elem1.attr("foo"), "bar");
  equal(elem1.attr("flux"), "rad");
  equal(elem1.attr("this"), "that");
});

test("$.build add classname via selector adds to className from object", 2, function() {
  var elem1 = $.build("span.rad", { "class" : "cool" });
  var tgt = $.build("div");
  tgt.append(elem1);
  ok(elem1.hasClass("rad"));
  ok(elem1.hasClass("cool"));
});

test("$.build add id via selector trumps id from object", 2, function() {
  var elem1 = $.build("span#sweet", { id : "neat" });
  var tgt = $.build("div");
  tgt.append(elem1);
  equal(elem1.attr("id"), "sweet");
  htmlCompare(tgt.html(), "<span id=\"sweet\"></span>");
});

test("$.build add children with no attributes", 1, function() {
  var elem1 = $.build("span", [ $.build("div"), "cool" ]);
  var tgt = $.build("div");
  tgt.append(elem1);
  htmlCompare(tgt.html(), "<span><div></div>cool</span>");
});

test("$.build add children with attributes object", 1, function() {
  var elem1 = $.build("span", { nice : "test" }, [ $.build("div"), "cool" ]);
  var tgt = $.build("div");
  tgt.append(elem1);
  htmlCompare(tgt.html(), "<span nice=\"test\"><div></div>cool</span>");
});

test("$.build add children from double nested array",1,
    function() {
      var arr = [ $.build("input[type=button]"), $.build.html("<span>A html string</span>") ]

      var elem1 = $.build(".foo", [ $.build(".bar", "sometext"), arr ]);
      var tgt = $.build("div", elem1);
      htmlCompare(tgt.html(),
          "<div class=\"foo\"><div class=\"bar\">sometext</div><input type=\"button\"><span>A html string</span></div>")
    });

test("$.build XSS attacks are not possible (html is escaped) when using text strings", function (){
  var userdata = {username:"hackbot", comment:"here's my attack!<script> alert('xss') </script>" }
  var elem = $.build(".comment", [
    $.build(".author", userdata.username),
    $.build(".comment", userdata.comment)
  ]);
  var tgt = $.build("div");
  tgt.append(elem);
  htmlCompare(tgt.html(), "<div class=\"comment\"><div class=\"author\">hackbot</div><div class=\"comment\">here's my attack!&lt;script&gt; alert('xss') &lt;/script&gt;</div></div>");
});

test("$.build XSS attacks ARE possible (html is NOT escaped) when using HTML blocks", function (){
  window.hackcount = 0;
  var userdata = {username:"hackbot", comment:"here's my attack!<script> window.hackcount++;</script>" }
  var elem = $.build(".comment", [
    $.build(".author", userdata.username),
    $.build(".comment", $.build.html(userdata.comment))
  ]);
  $("body").append(elem);
  ok(elem.html().indexOf("window.hackcount++") != -1);
  equal(window.hackcount, 1)
});

test("style elements affect the DOM", function (){
  var $b = $.build;
  var elem = $b(".styleTest", [
    $b("style", ".styleTest p {color:green;}"),
    $b("p", "This text should be green.")
  ]);
  var tempElem = $b("div").css("color", "green");
  $("body").append(elem).append(tempElem);
  equal($(".styleTest p").css("color"), tempElem.css("color"));
});
