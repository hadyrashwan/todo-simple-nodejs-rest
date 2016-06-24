var Sequelize = require('sequelize')
var sequelize= new Sequelize(undefined,undefined,undefined,{
	'dialect':'sqlite',
	'storage':__dirname+'/basic-sqllite-db.sqlite'
})

var Todo=sequelize.define('todo',{
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

sequelize.sync().then(function () {
	// body...
	console.log('Everthing is synced and working !')


	Todo.findById(8).then(function(todo){
		if(todo){
			console.log(todo.toJSON())
		}else{
			console.log('todo with id 1 wasnt found')
		}
	})
	// Todo.create({
	// 	description:'hey 3',
	// 	completed:false
	// }).then(function(todo){
	// 	return Todo.create({
	// 		description:"another description"
	// 	})
	// }).then(function(){
	// 	return Todo.findAll({
	// 		where:{
	// 			description:{
	// 				$like:"%3%"
	// 			}
	// 		}
	// 	})
	// }).then(function(todoFounds){
	// 	if(todoFounds){
	// 		todoFounds.forEach(function(todo){
	// 			console.log(todo.toJSON())
	// 		})
	// 	}else{
	// 		console.log('item with this id isnt found ')
	// 	}
		
	// }).catch(function(e){
	// 	console.log(e);
	// })
})