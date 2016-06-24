var express = require('express')
var bodyParser = require('body-parser')
var _ = require('underscore')
var app = express()
var PORT = process.env.PORT || 3000
db = require('./db.js')
app.use(bodyParser.json())

var todos = []
var todoIdNext = 1


app.get('/', function(req, res) {
    return res.json(todos)

})

app.get('/todos/:id', function(req, res) {

    todoId = parseInt(req.params.id, 10)
    db.todo.findById(todoId).then(function(todo) {
        if (todo) {
            console.log(todo.toJSON())
            res.json(todo)
        } else {
            console.log('todo with this id  wasnt found')
            res.status(404).send();
        }

    }, function(e) {
        console.log(e);
        res.status(500).send(e);

    }).catch(function(e) {
        res.status(500).send(e)
        console.log(e);
    })

})



app.get('/todos', function(req, res) {
    var queryPram = req.query;
    where = {}

    if (queryPram.completed && queryPram.completed === "true")
        where.completed = true;
    else if (queryPram.completed && queryPram.completed === "false")
        where.completed = false;
    if (queryPram.q && queryPram.q.trim().length > 0) {
        where.description = {
            $like: "%" + queryPram.q + "%"
        }
    }

    db.todo.findAll({
        where: where
    }).then(function(todos) {
        if (todos)
            res.json(todos)
        else
            res.status(404).send("no item found")
    }, function(e) {
        res.status(500).send(e);
    })
})

app.delete('/todos/:id', function(req, res) {
    var todoId2 = parseInt(req.params.id, 10)


    db.todo.destroy({
        where: {
            id: todoId2
        }
    }).then(function(numberOfItems) {
    	  if(numberOfItems ===0)
    		return res.status(404).send('the id isnt found')
        res.send(numberOfItems+" items has been  deleted!")
    }, function(e) {
        console.log(e)
        res.status(404).send(e)
    }).catch(function(e) {
        console.log(e)
        res.status(500).send(e)
    })
})

app.post('/todos', function(req, res) {
    var body = req.body


    db.todo.create(body).then(function() {
        res.send("item has been added ")
    }, function(e) {
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