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
		},
		password:{
			type:DataTypes.STRING,
			allowNull:false,
			validates:{
				len:[7,50]
			}
		}
	})
}