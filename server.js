var express = require('express')
var app=express()
var PORT= process.env.PORT || 3000

var todos=[{
	id:1,
	description:'study node',
	completed:false

},{
	id:2,
	description:'study mongo',
	completed:false
},
{
	id:3,
	description:'see whats next',
	completed:true
}]

app.get('/todos/:id',function(req,res){
	//res.send('todos id is : ' +req.params.id)
	//res.json(todos[req.params.id]) try with just the index
	todos.forEach(function(todo){
		if(todo.id==req.params.id)
			res.json(todo)
	})
	res.status(404).send()

})

app.get('/',function(req,res){
	res.send("the todo thing")
})

app.get('/todos',function(req,res){
	res.json(todos)
})
app.listen(PORT,function(){
	console.log('running on port : ',PORT)
})