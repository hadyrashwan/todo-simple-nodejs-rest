var Sequelize = require('sequelize')
var sequelize= new Sequelize(undefined,undefined,undefined,{
	'dialect':'sqlite',
	'storage':__dirname+'/basic-sqllite-db.sqlite'
})

var Todo345=sequelize.define('todo',{
	description:{
		type:Sequelize.STRING,
		allowNull:false,
		validate:{
			len:[1,250]
		}
	},
	completed:{
		type:Sequelize.BOOLEAN,
		allowNull:false,
		defaultValue:false
	}
})


var User=sequelize.define('/user',{
	email:Sequelize.STRING,
})


Todo345.belongsTo(User)
User.hasMany(Todo345)

sequelize.sync({
	force:true
}).then(function () {
	// body...
	console.log('Everthing is synced and working !')



// User.findById(1).then(function(user){
// 	user.getTodos({
// 		where:{completed:true}
// 	}).then(function(todos){
// 		todos.forEach(function(todo){
// 			console.log(todo.toJSON())
// 		})
// 	})
// })



	User.create({
	email:'email 1',
}).then(function(){
	return Todo345.create({
		description:"clean ur *"
	})
}).then(function(todo){
	User.findById(1).then(function(user){  /// the matched user id will be returned I think with findOne
		user.addTodo(todo);
	})
})


})

