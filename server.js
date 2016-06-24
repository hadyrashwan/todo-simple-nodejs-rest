var express = require('express')
var bodyParser = require('body-parser')
var _ = require('underscore')
var app = express()
var PORT = process.env.PORT || 3000
db=require('./db.js')
app.use(bodyParser.json())

var todos = []
var todoIdNext = 1


app.get('/', function(req, res) {
    return res.json(todos)

})

app.get('/todos/:id', function(req, res) {

    todoId = parseInt(req.params.id, 10)
	db.todo.findById(todoId).then(function(todo){
		if(todo){
			console.log(todo.toJSON())
			res.json(todo)
		}else{
			console.log('todo with this id  wasnt found')
			res.status(404).send();
		}

}).catch(function(e){
	console.log(e);
	res.status(400).send(e);
})

})



app.get('/todos', function(req, res) {
    var queryPram = req.query;
   //  validAttributes={}
   //  if(queryPram.hasOwnProperty('q') && queryPram.q.trim().length > 0 && _.isString(queryPram.q)){
   //  	matchedItems=_.filter(todos,function(todo){
   //  		return todo.description.indexOf(queryPram.q) > -1
   //  	})
   // 		 if(matchedItems.length === 0)
   //  	 res.status(404).send("keyword not found so the rest of the pars didn't continue to search on")

   //  }
   // if(!queryPram)
   // 		return res.json(todos)
   //  if (queryPram.completed)
   //      validAttributes.completed = Boolean(queryPram.completed)
   //  if (queryPram.id)
   //      validAttributes.id = parseInt(queryPram.id, 10)
   //  if(matchedItems.length === 0)
   //  	matchedItems=todos
   //  matchedItems = _.where(matchedItems, validAttributes);
   //  if (matchedItems.length > 0) {
   //      return res.json(matchedItems)
   //  } else {
   //      return res.status(404).send("the item wasnt found!")
   //  }



   //  console.log("get all todo request  with matched with " + queryPram)

    var queryPram = req.query;
     validAttributes={

     }

    if (queryPram.completed)
        validAttributes.completed = Boolean(queryPram.completed)
    if (queryPram.id)
        validAttributes.id = parseInt(queryPram.id, 10)
    if(queryPram.q)
    	validAttributes.q=q


   		 db.todo.findAll({
			where:{
				description:{
					$like:"%3%"
				}
			}
		})

})

app.delete('/todos/:id', function(req, res) {
    var todoId2 = parseInt(req.params.id, 10)
        // console.log(todoId )
    var isFound2 = _.findWhere(todos, {
        id: todoId2
    })
    if (isFound2) {
        todos = _.without(todos, isFound2)
        console.log("todo with id : " + isFound2.id + " is deleted")
        return res.send("todo with id : " + isFound2.id + " is deleted")
    } else {
        console.log("Iteam with id :" + todoId2 + " wasnt found ")
        res.status(404).send("Iteam wasn't found")
    }
})

app.post('/todos', function(req, res) {
    var body = req.body


   db.todo.create(body).then(function(){
		res.send("item has been added ")
	},function(e){
		res.status(400).json(e);
		console.log(e);
	})


})

app.put('/todos/:id', function(req, res) {
    //var body = req.body
    //var todoId3 = parseInt(req.params.id, 10)
    // var isFound3 = _.findWhere(todos, {
    //     id: todoId3
    // })
    // body = _.pick(body, "description", "completed")
    // validAttributes = {}
    // if (!isFound3) {
    //     return res.status(404).send("no match found")
    // }
    // if (body.hasOwnProperty("completed") && _.isBoolean(body.completed)) {

    //     validAttributes.completed = body.completed
    // } else if (body.hasOwnProperty("completed")) {
    //     return res.status(400).send()
    // }

    // if (body.hasOwnProperty("description") && _.isString(body.description) && body.description.trim().length > 0) {
    //     validAttributes.description = body.description
    // } else if (body.hasOwnProperty('description')) {
    //     return res.status(400).send()
    // }

    // _.extend(isFound3, validAttributes)
    // console.log("item with  id : " + isFound3.id + "has been updated")
    // return res.json(isFound3)





})
db.sequelize.sync()
app.listen(PORT, function() {
    console.log('running on port : ', PORT)
})