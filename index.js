const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
const { argv } = require("yargs");
const router = require("./routes");
const config = require("./config");
const cron = require("node-cron");
const volunteerInfoCon = require("./controller/volunteerInfo");
const dateTime = require("date-and-time");

const app = express();


const expressSwagger = require('express-swagger-generator')(app);



let options = {
    swaggerDefinition : {
        info : {
            description: '모바일 API Docs',
            title: '모바일 API',
            version: '1.0.0',
        },
        basePath: '/volteer',
        produces: [
            "application/json",
            "application/xml"
        ],
        schemes: ['http', 'https'],
        securityDefinitions: {
            JWT: {
                type: 'apiKey',
                in: 'header',
                name: 'Authorization',
                description: "",
            }
        }
    },
    route: {
        url: `${config.server.context_path}/api-docs`,
        docs: `${config.server.context_path}/api-docs.json`,
    },
    basedir: __dirname, //app absolute path
    files: ['./routes/**/*.js'] //Path to the API handle folder
}

expressSwagger(options);

// 매일 새벽 3시마다 봉사 정보 최신화를 한다.
cron.schedule('0 0 3 * * *', function () {
    // 여기서 최신화 하는 함수 실행
    volunteerInfoCon.lookUpApi();
});



const port = process.env.PORT || 5002;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({
    extended:true
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname,"public")));
app.use(`${config.server.context_path}`, router);

app.set('view engine', 'html');
// app.engine('html', require('ejs').renderFile);
// app.set('views', path.join(__dirname, 'views'));


//node ==> deploy.js --mode=dev
//pm2  ==> pm2 start deploy.js --node-args="deploy.js --mode=dev" --name=mobile_api



if (argv.mode === "dev") {
    process.env.NODE_ENV = "development";
} else if (argv.mode === "prod") {
    process.env.NODE_ENV = "production";
} else {
    process.env.NODE_ENV = "development";
}

app.set("jwt-secret", config.jwt_secret);


app.get("/", function (req, res) {
    res.status(200).send("http://localhost:5002/ 로 들어오셨습니다.");
});


// app.use(function (req, res, next) {
//     // error 생성 후 next
//     next(createError(404));
// });

// err handelr 처리
// app.use(function ( err, req, res, next ) {
//     res.locals.message = err.message;

//     try {
//         // 내가 정한 url에의 접속이 아니면 로그 남기기
//         if(req.hostname.indexOf("volteer") !== -1 || req.hostname === '127.0.0.1'){

//             if(req.url.indexOf("favicon.ico") >= 0){
//                 res.status(204).end();
//             }else {
//                 // res.status(200).send("에러입니다.");
//             }
//         }
//     } catch(err){
//         res.status(500).end();
//     }
// });

//mysql 은  특정시간 연결이 없으면 끊어진다고 한다. 그걸 방지하기 위해 
// 특정시간만다 쿼리를 날려야한다. 아니면 커넥션 에러가 난다고함
// setInterval(function () {
//     db.query('SELECT 1');
// }, 5000);

app.listen(port, ()=>{
    console.log(`포트번호 ${port}로 돌아가고 현재 ${process.env.NODE_ENV} 버전입니다.`);
})