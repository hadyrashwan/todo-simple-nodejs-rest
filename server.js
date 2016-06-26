var express = require('express')
var bodyParser = require('body-parser')
var _ = require('underscore')
var app = express()
var PORT = process.env.PORT || 3000
db = require('./db.js')
middleware = require('./middleware.js')(db)
app.use(bodyParser.json())
var todos = []
var todoIdNext = 1


app.get('/', function(req, res) {
    return res.send("WELCOME TO HODZ->TODO-simple-Node.js")

})

app.get('/todos/:id', middleware.requireAuthentication, function(req, res) { // findy by Id function

    todoId = parseInt(req.params.id, 10)
    req.user.getTodos({
        where: {
            id: todoId
        }
    }).then(function(todo) {
        if (todo)
            return res.json(todo)
        else
            return res.status(404).send()
    }, function(e) {
        res.status(404).send("item isn't found")
    })
})



app.get('/todos', middleware.requireAuthentication, function(req, res) { // Search function
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

    req.user.getTodos({
        where: where
    }).then(function(todos) {
        if (todos.length > 0)
            res.json(todos)
        else
            res.status(404).send("no item found")
    }, function(e) {
        res.status(500).send(e);
    })


})

app.delete('/todos/:id', middleware.requireAuthentication, function(req, res) { // del by Id function
    var todoId = parseInt(req.params.id, 10)

            db.todo.destroy({
            where: {
                id: todoId,
                userId:req.user.id
            }
        }).then(function(todo) {
            res.send("Item has been deleted")
        }, function() {
            res.status(500).send();
        })

})

app.post('/todos', middleware.requireAuthentication, function(req, res) { // add todo function
    var body = req.body
    body = _.pick(body, "description", "completed")


    db.todo.create(body).then(function(todo) {
        req.user.addTodo(todo).then(function() {
            return todo.reload();
        }).then(function(todo) {
            res.send(todo.toJSON())
        })
    }, function() {
        res.status(400).json(e);
    })


})


app.put('/todos/:id', middleware.requireAuthentication, function(req, res) { // update function
    var body = req.body
    var todoId = parseInt(req.params.id, 10)


    body = _.pick(body, "description", "completed")
    attributes = {}

    if (body.hasOwnProperty("completed"))

        attributes.completed = body.completed

    if (body.hasOwnProperty("description") && _.isString(body.description) && body.description.trim().length > 0)
        attributes.description = body.description


    db.todo.findOne({
        where: {
            id: todoId,
            userId:req.user.id
        }
    }).then(function(todo) {

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

app.post('/users', function(req, res) { // create account function
    var body = req.body
    body = _.pick(body, "email", "password")

    db.user.create(body).then(function(newUser) {
        res.json(newUser.toPublicJson())
    }, function(e) {
        res.status(400).json(e);
        console.log(e);
    })

})


app.post('/users/login', function(req, res) { // login function
    var body = req.body
    body = _.pick(body, "email", "password")

    db.user.authenticate(body).then(function(userData) {
        token = userData.generateToken('authentication')
        if (token) {
            res.header('Auth', token).json(userData.toPublicJson());
        } else
            res.status(500).send();
        //res.json(userData.toPublicJson());
    }, function(e) {
        console.error(e)
        res.status(401).send();

    })

})

db.sequelize.sync(
    //{force:true} this restarts the server for development option DON'T DO IT IN PRODUCTION
)
app.listen(PORT, function() {
    console.log('running on port : ', PORT)
})