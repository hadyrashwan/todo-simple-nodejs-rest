module.exports=function (sequelize,DataTypes) {
	// body...
	return sequelize.define('/todo',{
		description:{
			type:DataTypes.STRING,
			allowNull:false,
			validates:{
				len:[1,250]
			}
		},
		completed:{
			type:DataTypes.BOOLEAN,
			allowNull:false,
			defaultValue:false
		}
	})
}