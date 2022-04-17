const express = require("express");
const router = express.Router();
const volunteerInfo = require("./volunteerInfo");
const indexRouter = require("../controller");
const userRou = require("./user");
const coupon = require("./coupon");
const comment = require("./comment");
const group = require("./group");
const response = require("../module/response");
const auth = require("../module/auth");
const logger = require("../module/logger");



router.route("/*").all(function (req, res, next){
    let pathName = req._parsedUrl.pathname; //   /volteer/다음에 들어오는 url

    res.startTime = new Date();

    console.log("res.startTime : ",res.startTime  , "[" + req.method + "]" + req.url + "--" + JSON.stringify(req.body));

    logger.info('[' + req.method + ']' + req.url + ' -- ' + JSON.stringify(req.boduy));
    // get으로 데이터를 보냈을 경우
    if(pathName.indexOf("&") !== -1){

        let afterUrlSplit = pathName.split("&");
        if(afterUrlSplit.length > 0){
            pathName = afterUrlSplit[0];
            req.url = req.url.replace('&', '?');
            console.log(`get으로 들어올경우${res.startTime}${afterUrlSplit}${pathName}${req.url}`);
        }
    }

    // 특정 url이면 접속을 허가시킨다.
    if(
        pathName === "/user/signUp" 
        || pathName === "/user/login"
        // || pathName === "/user/response"
        // || pathName === "/volunteerInfo/infoLookUp"
        // || pathName === "/volunteerInfo/addPost"
        // || pathName === "/volunteerInfo/applyVolunteer"
        // || pathName === "/volunteerInfo/confirmUserVolunt"
        ){
        next();
        return;
    };

    // req.headers에서 토큰을 가져오기
    const token = req.headers.authorization;

    if(!token){
        // 토큰이 없으면 에러입니다.
        response.error(res, {
            errMsg : 'AUTH_TOKEN_FAIL'
        });

    } else { // 토큰이 있을 경우
        if(auth.authToken.get(req, token)){

            req.user = auth.authToken.get(req, token);

            if(req.user.weatherMerber){
                next();
                return;
            }

        } else { // 토큰이 이상할 경우

            response.error(res, { errMsg: 'AUTH_TOKEN_FAIL' });
        }
    }
});

// 유저 관련
router.use("/user", userRou);


// 봉사활동 정보 저장
router.use("/volunteerInfo",volunteerInfo);

// 봉사 쿠폰
router.use("/coupon", coupon);

// 코멘트 작성
router.use("/comment", comment);

//  그룹
router.use("/group", group);


router.get("/", async function (req, res, next) {


    indexRouter.indexRouter(req, res);
        // const sql = `select * from users;`;
        // const resultMany = await mysql.single(sql);
        // console.log("여기서 가져온 값 확인 ::::" , resultMany);

        // res.status(200).json({
        //     code: 1,
        //     message : "유저 정보를 모두 가져오기",
        //     data: resultMany
        // })
});



router.get('/favicon.ico', (req, res) => res.status(204).end());


module.exports = router;