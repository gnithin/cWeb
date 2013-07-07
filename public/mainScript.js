var tabCode=9;
var newline=13;
var enterHit=false;
var tabCount=0;
var backSpaceCode=8;
$(document).ready(function(){
	$("#codeArea").bind("keydown",stringManipulation);
	$("#runProgram").bind("click",runAjax);
});
function runAjax(){
	//alert($("#codeArea").val());
	$.ajax({
		url:		"/",
		type:		"POST",
		dataType:	"json",
		data:		JSON.stringify({
						"prog":	$("#codeArea").val(),
						"input": $("#inputArea").val()
						}),
		contentType:	"application/json",
		cache:		false,
		timeout:	5000,
		complete:	function(){
					//alert("call Complete");
				},
		success:	function(data){
					var temp=JSON.parse(data["ajaxData"]);
					//alert(JSON.stringify(temp));
					$("#result").html(temp[0]);
				},
		error:		function(){
					//alert("Error in Ajax");
				}
	});
}
function stringManipulation(e){
		var keyCode=e.keyCode || e.which;
		var str;
		//alert(keyCode);
		/*This is for counting the number of tabs*/
		if(enterHit===true){
			switch(keyCode){
				case tabCode:
						tabCount++;
						break;
				case backSpaceCode:
						if(tabCount>0){
							tabCount--;
						}
						break;
				default:
						enterHit=false;
						break;
			}
		}
		/*This is for aligning a newline to the number of tabs*/
		if(keyCode===newline){
			str=this.value;
			enterHit=true;
			var tempStr="\n";
			for(i=tabCount;i>0;i--){
				tempStr+="\t";
			}
			var startPoint =  this.selectionStart;
			var endPoint = this.selectionEnd;
			this.value=str.substring(0,startPoint)+tempStr+str.substring(endPoint+1,str.length);
			return false;	
		}
		
		/*This piece of code is for enabling tabs.*/
		if(keyCode===tabCode){
			str=this.value;
			var startPoint =  this.selectionStart;
			var endPoint = this.selectionEnd;
			//alert("selectionStart:"+ startPoint+" SelectionEnd: "+endPoint);
			this.value=str.substring(0,startPoint)+"\t"+str.substring(endPoint,str.length);
			return false;
		}		
}
