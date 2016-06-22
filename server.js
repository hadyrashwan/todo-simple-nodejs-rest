var express = require('express')
var app=express()
var PORT= process.env.PORT || 3000

app.get('/',function(req,res){
	res.send("the todo thing")
})

app.listen(PORT,function(){
	console.log('running on port : ',PORT)
})