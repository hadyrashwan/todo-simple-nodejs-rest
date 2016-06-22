var express = require('express')
var bodyParser=require('body-parser')
var app=express()
var PORT= process.env.PORT || 3000
app.use(bodyParser.json())

var todos=[]
var todoIdNext=1

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

app.post('/todos',function(req,res){
	var todoItem=req.body
	todoItem.id=todoIdNext
	todos.push(todoItem)
	console.log(todos[todoIdNext-1])
	todoIdNext++
	res.send('item with description : '+todos[todoIdNext-2].description+' \n and id : '+todos[todoIdNext-2].id +' has been added')

})

app.listen(PORT,function(){
	console.log('running on port : ',PORT)
})