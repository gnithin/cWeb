var express=require("express");
var exec=require('child_process').exec;
var app=express();
var fs=require('fs');

var timeStamp=function(){var date=new Date();return ('0'+date.getHours()).slice(-2)+':'+('0'+date.getMinutes()).slice(-2)+':'+('0'+date.getSeconds()).slice(-2)+' '+('0'+date.getDate()).slice(-2)+'/'+('0'+(date.getMonth()+1)).slice(-2)+'/'+date.getFullYear()+':  ';};
function write(str){
	console.log(timeStamp()+str);
}

app.configure(function(){
	app.use(function(req,res,next){
		console.log(timeStamp()+req.method+req.url);
		next();
	});
	app.use(express.bodyParser());
	app.use(express.static(__dirname+'/public'));
});
app.get("/",function(req,res){
	res.render('home.ejs',{
		layout:	false
	});
});
app.post("/",function(req,res){
	var program=req.body.prog;
	//trim input as well.
	var input=req.body.input;
	write("input"+input);
	fs.writeFile('main.c',program,function(err){
		if(err){
			write(err);
		}
		else{
			fs.writeFile('input.txt',input,function(err){
				if(err){
					write(err);
				}
				else{
					write("Program file was written and saved!");
					child=exec('gcc main.c -o main.out && ./main.out < input.txt',function(err,stdout,stderr){
						var outputString;
						var error=0;
						if(err != null){
							write("Exec error:"+err);
							outputString="<h2><span id='error'>ERROR</span></h2><div id='outputContent'>"+err.message.toString()+"</div>";
							error=1;
						}
						else{
							write("stdout: "+stdout);
							outputString="<h2><span id='output'>OUTPUT</span></h2><div id='outputContent'>"+stdout+"</div>";
						}
						res.contentType('json');
						res.send({ajaxData: JSON.stringify([outputString])});
					});
				}
			});
		}
	});
});
app.get("*",function(req,res){
	res.render('invalid.ejs',{layout: false});
});
app.listen(9000);
write("Server Started");
write("listening to port 9000");
