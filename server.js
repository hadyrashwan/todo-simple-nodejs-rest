var express = require('express')
var bodyParser=require('body-parser')
var _=require('underscore')
var app=express()
var PORT= process.env.PORT || 3000
app.use(bodyParser.json())

var todos=[]
var todoIdNext=1


app.get('/',function(req,res){
	res.send("the todo thing")
})

app.get('/todos/:id',function(req,res){
	//res.send('todos id is : ' +req.params.id)
	//res.json(todos[req.params.id]) try with just the index
	todoId=parseInt(req.params.id,10)
	var isFound=_.findWhere(todos,{id:todoId })
	if(isFound){
			res.json(isFound)
	}else{
	res.status(404).send()
}

})



app.get('/todos',function(req,res){
	res.json(todos)
})

app.post('/todos',function(req,res){
	var body=req.body
	body=_.pick(body,"description", "completed")
	if(!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0 ){
		return res.status(400).send();
	}

	body.description=body.description.trim()
	var todoItem=body
	todoItem.id=todoIdNext
	todos.push(todoItem)
	console.log(todos[todoIdNext-1])
	todoIdNext++
	res.send('item with description : '+todos[todoIdNext-2].description+' \n and id : '+todos[todoIdNext-2].id +' has been added')

})

app.listen(PORT,function(){
	console.log('running on port : ',PORT)
})