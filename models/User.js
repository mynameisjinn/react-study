const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10; // 10 자리 수로 생성

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true, // 이메일 작성시 공백 제거
        unique: 1
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {
        type: Number,
        default: 0
    },
    image: String,
    token: {
        type: String
    },                                                                            
    tokenExp: {
        type: Number
    }
})

// User 가 save 되기 전에 비밀 번호를 암호화 시킴
userSchema.pre('save',function( next ){
    var user = this;

    if(user.isModified('password')){
        bcrypt.genSalt(saltRounds, function(err, salt) {
            if(err) return next(err)
    
            bcrypt.hash(user.password, salt, function(err, hash){
                if(err) return next(err)
                user.password = hash
                next()
            })
        });
    }
})

const User = mongoose.model('User', userSchema)

module.exports = {User}