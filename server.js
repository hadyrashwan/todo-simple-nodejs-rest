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
        if (numberOfItems === 0)
            return res.status(404).send('the id isnt found')
        res.send(numberOfItems + " items has been  deleted!")
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
    body = _.pick(body, "description", "completed")

    db.todo.create(body).then(function() {
        res.send("item has been added ")
    }, function(e) {
        res.status(400).json(e);
        console.log(e);
    })


})


app.put('/todos/:id', function(req, res) {
    var body = req.body
    var todoId = parseInt(req.params.id, 10)


    body = _.pick(body, "description", "completed")
    attributes = {}

    if (body.hasOwnProperty("completed"))

        attributes.completed = body.completed

    if (body.hasOwnProperty("description") && _.isString(body.description) && body.description.trim().length > 0)
        attributes.description = body.description


    db.todo.findById(todoId).then(function(todo) {

        if (todo)
            return todo.update(attributes).then(function(todo) {
        res.json(todo.toJSON());
    }, function(e) {
        res.status(400).send(e);
    })

        else
            res.status(404).send();
    }, function() {
        res.status(500).send();
    })
})

app.post('/users',function(req,res){
	var body = req.body
    body = _.pick(body, "email", "password")

    db.user.create(body).then(function(newUser) {
        res.json(newUser.toPublicJson())
    }, function(e) {
        res.status(400).json(e);
        console.log(e);
    })

})

db.sequelize.sync()
app.listen(PORT, function() {
    console.log('running on port : ', PORT)
})