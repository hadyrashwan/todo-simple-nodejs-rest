bcrypt=require("bcrypt")
var _ = require('underscore')

module.exports=function (sequelize,DataTypes) {
	// body...
	return sequelize.define('/user',{
		email:{
			type:DataTypes.STRING,
			allowNull:false,
			unique:true,
			validates:{
				isEmail:true
			}
		},salt:{
			type:DataTypes.STRING

		},password_hashed:{
						type:DataTypes.STRING
		},password:{
			type:DataTypes.VIRTUAL,
			allowNull:false,
			validates:{
				len:[7,50]
			},
			set:function(value){
				var salt = bcrypt.genSaltSync(10)
				var hashedPassword=bcrypt.hashSync(value,salt)

				this.setDataValue('password',value)
				this.setDataValue('salt',value)
				this.setDataValue('password_hashed',hashedPassword)


			}
		}
	},{
		hooks : {
			beforeValidate:function(user,options){
			if(typeof user.email === "string" )
			user.email=user.email.toLowerCase()
		}},

		instanceMethods:{
		toPublicJson : function(){
				var json = this.toJSON()
				return  _.pick(json, "email", "updatedAt","createdAt")
			}
		}
	})
}