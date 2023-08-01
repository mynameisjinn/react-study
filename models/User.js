const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10; 

var jwt = require('jsonwebtoken');

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

    if(user.isModified('password')){ // 비밀번호 정보를 수정하는 경우 암호화
        bcrypt.genSalt(saltRounds, function(err, salt) {
            if(err) return next(err)
    
            bcrypt.hash(user.password, salt, function(err, hash){
                if(err) return next(err)
                user.password = hash
                next()
            })
        });
    } else { // 비밀번호 외에 다른 정보를 수정하는 경우 
        next()
    }
})

userSchema.methods.comparePassword = function(plainPassword, cb) {
    /* plainPassword 1234567 암호화된 비밀번호 -> bcrypt 로 암호화한 비밀번호
    암호화된 비밀번호를 복호화할 수는 없다. plainPassword 를 암호회하여 일치하는지 확인 */
    
    bcrypt.compare(plainPassword, this.password, function(err, isMatch){
        if(err) return cb(err),
        cb(null, isMatch)
    });
} 

userSchema.methods.generateToken = function(cb) {
    // jsonwebtoken 사용해서 토큰 생성
    var user = this;

    var token = jwt.sign(user._id.toHexString(), 'secretToken')
    
    // user._id + 'secretToken' = token

    // ->

    // 'secretToken' -> user._id

    user.token = token;
    user.save(function(err, user){
        if(err) return cb(err)
        cb(null, user)
    })
    // user.save()
    // .then(user => {
    //     // 저장 성공
    //     cb(null, user);
    // })
    // .catch(err => {
    //     // 에러 발생
    //     cb(err);
    // });

}

const User = mongoose.model('User', userSchema)

module.exports = {User}