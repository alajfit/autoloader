// adiRVO must be set to false
rtAuto.load = (function(){
	$(window).load(function() {
		// Data from the customer
		if ( rtAuto.num !== null && rtAuto.ele !== null && rtAuto.co !== null ) {
			var countryC = true;
			switch (rtAuto.co) {
				case 'es':
					var $country = new RegExp("([0-9]{2}( |-|\\.)?[0-9]{3}( |-|\\.)?[0-9]{2}( |-|\\.)?[0-9]{2})\\b|([0-9]{2,}( |-|\\.)?[0-9]{3,}( |-|\\.)?[0-9]{2,})\\b","g");
					break;
				default:
					countryC = false;
					break;
			}
			if (countryC) {
				var start = performance.now();
				var $rL = rtAuto.num;
				var $searchList = rtAuto.ele; // Where to search from, this can be a class, id or element e.g. body

				var $AA=[]; // Active array for numbers found
		    	var $cache = $("*").text();
				var $remover = new RegExp("'num[^]*}", "g");
				$cache = $cache.replace($remover, "");
		    	var $allElements = $cache.match($country);
				if($allElements) { // checking elements have been found
					$.each($allElements, function( key, value ) {
						var $content = $allElements[key].split(' ').join('');
						Object.keys($rL).forEach(function(key) { // get dest and rt num
							var $num = key.split(' ').join(''), $rlK = $rL[key]; var $check = true;
						    if($content == $num) {
								if(jQuery.isEmptyObject($AA)) {
									$AA.push({$tNum:$num, $rt:$rlK});
								} else {
									Object.keys($AA).forEach(function(key) {
										if($AA[key].$tNum == $content) {
										$check = false;
									}
									});
								if($check === true) {
									$AA.push({$tNum:$num, $rt:$rlK});
								}
								}
							}
						});
					});
				}
				console.log("Initial Number Search : "+(Math.round(performance.now() - start))+ "ms");

				start = performance.now();
				// create and hide the placeholders of all required numbers
				$(document.body).append('<span id="rt"></span>'); var $hold = $("#rt"), $checkExist = [];
				Object.keys($AA).forEach(function(key) { // get dest and rt num
					var check = false;
        			var checKey = key;
					if($checkExist!==null) {
            			$.each($checkExist, function( key, value ) {
            				if($checkExist[key] == $AA[checKey].$rt) {
                				check = true;
            				}
            			});
            			if(check === false) {
							$hold.append('<span class="'+$AA[key].$rt+'" style="display:none;"></span>');
							$checkExist.push($AA[key].$rt);
						}
        			}
				});
				console.log("Build Elements : "+(Math.round(performance.now() - start))+ "ms");
				start = performance.now();
				// Get all required numbers from the server
				rTapNotifyDOMChange(document.getElementById("rt"));

				// Gather up all the numbers returned
				var $xRT = 0, $run = $checkExist.length*2, $ran = false;
				$("#rt").bind("DOMSubtreeModified", function() {
					$xRT++;
					if($xRT>=$run && $ran === false) {
						Object.keys($AA).forEach(function(key) {
            				var $catcher = $('.'+$AA[key].$rt+'').text();
            				if($catcher != "t" && $catcher !== "" && $catcher != " ") {
								$AA[key].$new = $catcher;
            				}
						});
            			// need to do a check for not null
            			var $runCatch = true;
            			Object.keys($AA).forEach(function(key) {
            				if($AA[key].$new === undefined) {
            					$runCatch=false;
            				}
            			});
            			if($runCatch === true) {
							console.log("Numbers Gathered For Deployment : "+(Math.round(performance.now() - start))+ "ms");
            				$finishAndReplace();
            				$ran = true;
            			}
					}
				});

				// Replace all numbers on the page
				var $finishAndReplace = function() {
					start = performance.now();
					$.each($searchList, function( key, value ){
						var $search = $searchList[key];
						$($search).each(function() {
							var $cache = $(this);
							var $allElements = $cache.text().match($country);
							if($allElements) { // checking elements have been found
								$.each($allElements, function( key, value ) {
									var $replace = $allElements[key];
									var $found = $allElements[key].split(' ').join('');
									Object.keys($AA).forEach(function(key) {
										if($found == $AA[key].$tNum) {
											var $re = new RegExp($replace,"g");
					            			var replaced = $cache.html().replace($re, $AA[key].$new);
					            			$cache.html(replaced);
										}
									});
								});
							}
						});
					});
					console.log("Replacement complete : "+(Math.round(performance.now() - start))+ "ms");
					if (typeof rtAutoCallback == 'function') { rtAutoCallback(); }
				};
			} else { window.console && console.log("Error: Country N/A");  }
		} else { window.console && console.log("Error: Var Err"); }
	});
})();
