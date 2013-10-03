/**	
 Each of these benchmark runs renders the same HTML, a series of nested divs, images, inputs and buttons
 that represent a simple voting  application, where you vote for the best Bomberman 94 character.
 The goal is to prove that $.build has similar performance to using jQuery, while having a nicer syntax.
 Hand building the dom is probably always going to be fastest, but has radically more complexity. 
*/

/*
  Here is the reference HTML that is rendered by each of these
  
  
  <div class='votetest'>
	<div class='voteheader'>Pick your favorite Bomberman 94 character</div>
	<div class='voteitem'>
		<img src="char-bomberman.png">
		<div class='picker'>
			<label for='bombermanRb'>Standard Bomberman</label>
			<input type='radio' id='bombermanRb' name='choice'>
		</div>
		<div class='picked' style='display:none;'>
			You selected Standard Bomberman!
		</div>
	</div>
	<div class='voteitem'>
		<img src="../images/char-construct.png">
		<label for='constructRb'>Construction Bomberman</label>
		<input type='radio' id='constructRb' name='choice'>
		<div class='picked' style='display:none;'>
			You selected Construction Bomberman!
		</div>
	</div>
	<div class='voteitem'>
		<img src="char-construct.png">
		<label for='constructRb'>Construction Bomberman</label>
		<input type='radio' id='constructRb' name='choice'>
		<div class='picked' style='display:none;'>
			You selected Construction Bomberman!
		</div>
	</div>
	<div class='votebuttonHolder'>
		<button type='button'>Vote</button>
	</div>
</div>
 */

if(typeof window === "undefined"){
  require("./setupWindow.js");
}

suite("Benchmark test")

asyncTest("Benchmark.js run of three implementations of the same UI", 1, function (){
  this.timeout(50000);

 	var bombermanCharacters = [ 
		{name:"Construction Bomberman", id:"construct"}, 
		{name:"Standard Bomberman", id:"bomberman"},
		{name:"Kamikaze Bomberman", id:"kamikaze"},
		{name:"Bookworm Bomberman", id:"bookworm"}	
	]
	

  //Using $.build 
  var builder = function (appendTo){
    var $b = $.build;
    var voteTest = $b(".votetest", [
      $b(".voteheader", "Pick your favorite Bomberman 94 character ($.build)"),
      $.map(bombermanCharacters, function (bm){
          return $b(".voteitem#"+bm.id, [
             $b("img", {src:"../images/char-"+bm.id+".png"}),
             $b(".picker", [
               $b("label", {'for':bm.id+"Rb"}, bm.name),
               $b("input[type=radio]#"+bm.id+"Rb", {value:bm.id, name:"builderRadio"}),
             ]),
            $b(".picked", ["You selected ",  bm.name, "!"]).hide()
          ])
      }),
      $b(".votebuttonHolder", 
        $b("button[type=button]", "Vote").click(function(){
         var selection = appendTo.find("input:radio[name=builderRadio]:checked").val()
  				if(selection){
  					appendTo.find("#"+selection +" .picked").show();
  					appendTo.find(".picker").hide();
  				}
        })
      )
    ]);
    appendTo.append(voteTest);
  }
	
  //using jQuery's dom creation from HTML strings.
  var jqDom = function (appendTo){
		var elem = $("<div class='votetest'></div>");
    elem.append($("<div class='voteheader'>Pick your favorite Bomberman 94 character (JQ DOM)</div>"));
    $.each(bombermanCharacters, function(i, bm){
			var voteitem = $("<div class='voteitem'></div>").attr("id", bm.id);
			elem.append(voteitem);
			voteitem.append($("<img>").attr("src", "../images/char-" + bm.id + ".png"));
			var picker = $("<div class='picker'></div>");
			voteitem.append(picker);
			picker.append($("<label for='"+bm.id+"Rb'>"+bm.name+"</label>"));
			picker.append($("<input type='radio' name='jQDomRadio' id='" + bm.id + "Rb' value='"+bm.id+"'>"));
			voteitem.append($("<div class='picked'>You selected " + bm.name +  "!</div>").hide());
		});	
		var voteBtnHolder = $("<div class='votebuttonHolder'></div>");
		elem.append(voteBtnHolder);
		voteBtnHolder.append($("<button type='button'>Vote</button>").click(function (){
				var selection = appendTo.find("input:radio[name=jQDomRadio]:checked").val()
				if(selection){
					appendTo.find("#"+selection +" .picked").show();
					appendTo.find(".picker").hide();
				}
			}));
		appendTo.append(elem);
   };
    
   
  var straightDom = function (appendTo){
    
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
    
    var voteTest = document.createElement("div");
    voteTest.className = "votetest";
    appendTo.get(0).appendChild(voteTest);
    var voteheader = document.createElement("div");
    voteheader.innerHTML = "Pick your favorite Bomberman 94 character (Basic DOM)";
    voteTest.appendChild(voteheader);
    for(var i = 0; i < bombermanCharacters.length; i++){
      var bm = bombermanCharacters[i];
      var voteitem = document.createElement("div");
      voteitem.id = bm.id;
      voteitem.className = "voteitem";
      var img = document.createElement("img");
      img.src = "../images/char-"+bm.id+".png";
      voteitem.appendChild(img);
      var picker = document.createElement("div");
      picker.className = "picker";
      var label = document.createElement("label");
      label.setAttribute("for", bm.id+"Rb");
      label.innerHTML = bm.name;
      picker.appendChild(label);
      var radio;
      if(hasNormalInputButtonCreate){
        radio = document.createElement("input");
        radio.type = "radio";
        radio.name = "builderRadio";
      }
      else{
        //IE Specific version...
        radio = document.createElement("<input type='radio' name='builderRadio'>");
      }
      radio.setAttribute("value",bm.id);
      picker.appendChild(radio);
      voteitem.appendChild(picker);
      var picked = document.createElement("div");
      picked.className = "picked";
      picked.innerHTML = "You selected " + bm.name + "!";
      picked.style.display = "none";
      voteitem.appendChild(picked);
      voteTest.appendChild(voteitem);
    }
    var votebuttonHolder = document.createElement("div");
    votebuttonHolder.className = "votebuttonHolder";
    var button;
    if(hasNormalInputButtonCreate){
       button = document.createElement("button");
       button.type = "button";
     }
     else{
       //IE Specific version...
       button = document.createElement("<button type='button'>");
     }
     button.innerHTML = "Vote";
     votebuttonHolder.appendChild(button);
     voteTest.appendChild(votebuttonHolder);
     
     //I know this is not supposed to use JQuery, 
     //but this sort of thing is such a pain without it!
     // couldn't stand to do this wiring without jQuery...
     appendTo.find(".votebuttonHolder").click(function(){
         var selection = appendTo.find("input:radio[name=builderRadio]:checked").attr("value")
  				if(selection){
  					appendTo.find("#"+selection +" .picked").show();
  					appendTo.find(".picker").hide();
  				}
        });
  };
  
  
  //Set up the divs that will be written into.  
  $("body").append($.build(".benchmark", [
    $.build("ul#output"),
    $.build("div#builder"),
    $.build("div#native"),
    $.build("div#jQDom")  
  ]));

  var s = new Benchmark.Suite;
  // add tests
  s.add('$.build DOM UI Building', function() {
    var holder = $("#builder").empty();
    builder(holder);
  });
  s.add("Straight DOM APIs", function (){
    var holder = $("#native").empty();
    straightDom(holder);
  });
  s.add('JQuery DOM UI Building', function() {
    var holder = $("#jQDom").empty();
    jqDom(holder);
  });

  s.on('start', function (){
    $("#output").empty();
    console.log("Started benchmark run...");
    $("#output").append($.build("li", "Started benchmark run…"));
  })
  // add listeners
  .on('cycle', function(event, bench) {
    console.log(String(bench));
    $("#output").append($.build("li", String(bench)));
  })
  .on('complete', function() {
    console.log("Benchmark run complete: "+'Fastest is ' + this.filter('fastest').pluck('name'));
    $("#output").append($.build("li", 'Fastest is ' + this.filter('fastest').pluck('name')));
    ok(true);
    start();
  });
  s.run({async:true});
})