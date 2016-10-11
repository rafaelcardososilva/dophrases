$(function(){

	// Substitui o alert padrao pelo customizado
	window.alert = alerta;

	// Send enter
	$(".word").keydown(function(e){
		if(e.keyCode == 13){
			// Get phrases
			var word = $(".word").val().trim();
			if( word.length > 0 ){
				getPhrase(word);
			}
		}
	})

	// Click no enviar
	$(".bt").click(function(){
		// Get phrases
		var word = $(".word").val().trim();
		if( word.length > 0 ){
			getPhrase(word);
		}
	});

	function getPhrase(word){

		document.activeElement.blur();

		// clear result
		$(".result").html("");

		// spinner
		$(".spinner").show();
		
		$.ajax({
			url: "api.php",
			type: "POST",
	        data:{
	        	url: "http://www.dictionary.com/browse/"+word
	        },
	        success: function(data){
    			var div = $("<div></div>").html(data);

    			// phrases
    			var items = div.find("#source-example-sentences p.partner-example-text");
    			var limit = 3;

    			// Find phrases
    			if( items.length > 0 ){
	    			for(var i = 0; i < limit; i++){
	    				getTranslation(items.eq(i).html().trim());
	    			}
    			}else{
		        	// spinner
		        	$(".spinner").hide();    	
		        	
		        	alert("<strong>Not found</strong> <br> Change your search!");
    			}
	        }
		});
	}

	function getTranslation(phrase){
		// Get translation phrases
		var key = "trnsl.1.1.20161006T201314Z.7f3e6c570406bdf7.638dc44c7d2e99f528c321047802611f80a5f529";

		$.ajax({
			url: "api.php",
			type: "POST",
	        data:{
	        	url: "https://translate.yandex.net/api/v1.5/tr.json/translate?key="+key+"&text="+phrase+"&lang=en-pt"
	        },
	        success: function(data){
	        	data = JSON.parse(data);

	        	var translation = data.text[0];

	        	var item = ""+
		        	"<div>"+
		        		"<p>"+phrase+"</p>"+
		        		"<p>"+translation+"</p>"+
		        	"</div>";

	        	// show result
	        	$(".result").append(item);
	        	$(".result").show();

	        	// spinner
	        	$(".spinner").hide();
	        }
		})
	}

	function alerta(msg){

		// remove if exists
		if ( $(".custom-alert").length > 0 ){
			$(".custom-alert").remove();
			$(".custom-alert").remove();
		}

		var divAlert = $(""+
			"<div class='custom-alert'>"+
				"<div class='alert'>"+
					"<div class='bt-close'>X</div>"+
						"<p>" + msg + "</p>"+
						"<div class='bt-ok'>OK</div>"+
					"</div>"+
				"</div>"+
			"</div>");
		
		$("body").append(divAlert);	
	}

	// close alert
	$("body").delegate(".custom-alert, .alert .bt-ok", "click", function (){
		$(".custom-alert").remove();
	});
})

