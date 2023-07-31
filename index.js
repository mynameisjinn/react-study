const express = require('express')
const app = express()
const port = 5000
const bodyParser = require('body-parser')
const { User } = require("./models/User")

const config = require('./config/key')

// application/x-www-form-urlencoded 데이터 가져오기 위함
app.use(bodyParser.urlencoded({extended: true}))

//application/json 데이터 가져오기 위함함
app.use(bodyParser.json())

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI)
.then(()=> console.log('MongoDB Connected...'))
.catch(err => console.log(err))


app.get('/', (req, res) => {
  res.send('Hello World! on Nodemon')
})

// app.post('/register',(req, res) => {
  
//   // 회원 가입 할때 필요한 정보들을 client에서 가져오면 데이터베이스에 넣어준다.
  
//   const user = new User(req.body)

//   user.save((err, doc) => {
//     if(err) return res.json({success: false, err})
//     return res.status(200).json({
//       success: true
//     })
//   }) // sava() -> mongoDB  에서 오는 메서드

// })

app.post('/register', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    return res.status(200).json({
      success: true
    });
  } catch (err) {
    return res.json({success: false, err});
  }
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})