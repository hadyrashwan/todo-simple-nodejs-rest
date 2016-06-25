bcrypt = require("bcrypt")
var _ = require('underscore')

module.exports = function(sequelize, DataTypes) {
    // body...
    var user = sequelize.define('/user', {
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validates: {
                isEmail: true
            }
        },
        salt: {
            type: DataTypes.STRING

        },
        password_hashed: {
            type: DataTypes.STRING
        },
        password: {
            type: DataTypes.VIRTUAL,
            allowNull: false,
            validates: {
                len: [7, 50]
            },
            set: function(value) {
                var salt = bcrypt.genSaltSync(10)
                var hashedPassword = bcrypt.hashSync(value, salt)

                this.setDataValue('password', value)
                this.setDataValue('salt', salt)
                this.setDataValue('password_hashed', hashedPassword)


            }
        }
    }, {
        hooks: {
            beforeValidate: function(user, options) {
                if (typeof user.email === "string")
                    user.email = user.email.toLowerCase()
            }
        },
        classMethods: {
            authenticate: function(body) {
                return new Promise(function(reslove, reject) {


                    if (typeof body.password !== "string" || typeof body.email !== "string")
                        return reject();

                    user.findOne({
                        where: {
                            email: body.email
                        }
                    }).then(function(userData) {
                        if (userData) {

                            if (bcrypt.compareSync(body.password, userData.password_hashed))
                                return reslove(userData);
                            else
                                return reject();
                        } else
                            return reject();
                    }, function(e) {
                        return reject();
                    })
                })
            }
        },
        instanceMethods: {
            toPublicJson: function() {
                var json = this.toJSON()
                return _.pick(json, "email", "updatedAt", "createdAt")
            }
        }
    })
    return user;
}