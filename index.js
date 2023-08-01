const express = require('express')
const app = express()
const port = 5000
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const { User } = require("./models/User")

const config = require('./config/key')

// application/x-www-form-urlencoded 데이터 가져오기 위함
app.use(bodyParser.urlencoded({extended: true}))

//application/json 데이터 가져오기 위함함
app.use(bodyParser.json())
app.use(cookieParser())

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


// app.post('/login',(req,res)=> {
//   // 1.요청된 이메일을 데이터베이스안에 있는지 찾는다. 
//   User.findOne({email: req.body.email}, (err, user) => {
//     if(!user) {
//       return res.json({
//         loginSuccess: false,
//         message: "제공된 이메일에 해당하는 유저가 없습니다."
//       })
//     }
//   });
//   // 2.요청된 이메일이 데이터베이스에 있다면 비밀번호가 맞는 비밀번호인지 확인 
//   user.comparePassword(req.body.password, (err, isMatch) => {
//     if(!isMatch)
//     return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다."})

//     // 3.비밀번호가 같다면 토큰생성
//     user.generateToken((err, user) => {
//       if(err) return res.status(400).send(err);

//       /* 토큰을 저장한다. -> 쿠키, 로컬스토리지 등등에 저장가능 
//         여기서는 쿠키에 저장하기로 한다 -> cookie-parser 설치 */
//         res.cookie("x_auth", user.token)
//         .status(200)
//         .json({ loginSuccess: true, userId: user._id })

//     });
//   })

// })

app.post('/login', async (req, res) => {
  try {
    // 1. 요청된 이메일을 데이터베이스 안에 있는지 찾는다.
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.json({
        loginSuccess: false,
        message: "제공된 이메일에 해당하는 유저가 없습니다."
      });
    }

    // 2. 요청된 이메일이 데이터베이스에 있다면 비밀번호가 맞는 비밀번호인지 확인
    const isMatch = await user.comparePassword(req.body.password);

    if (isMatch) {
      return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다." });
    } 
      
      // 3. 비밀번호가 같다면 토큰 생성
      await user.generateToken();
  
      /* 토큰을 저장한다. -> 쿠키, 로컬스토리지 등에 저장 가능
      여기서는 쿠키에 저장하기로 한다 -> cookie-parser 설치 */
      res.cookie("x_auth", user.token)
        .status(200)
        .json({ loginSuccess: true, userId: user._id });
    

  } catch (err) {
    res.status(500).send("서버 에러");
  }
});



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})