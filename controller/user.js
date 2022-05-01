const response = require("../module/response");
const userModel = require("../model/user");
const common = require("../module/common");
const auth = require("../module/auth");
const crypto = require("crypto");
const axios = require("axios");



// user 회원가입
const userInfo = async ( req, res ) => {

    const { birthday, gender, phoneNumber, name, userId, password   } = req.body;

    req.params = req.body;

    try{

        //필수 정보 있는지 확인
        if( !birthday || !gender || !phoneNumber || !name || !userId || !password ) {
                // 없으면 에러
                response.error(res, { errCode: 400, errMsg: 'THIRD_PARTY_ERROR', customErrorMsg: '입력하신 정보를 다시 한번 확인해주세요.' });
                return;
        };

        // 비밀번호 조건 검사
        if ( common.passwordRegex(password) === -1 ) {
            response.error(res, { errCode: 400, errMsg: 'THIRD_PARTY_ERROR', customErrorMsg: '비밀번호는 대문자, 소문자, 특수문자를 필수로 사용하여 8 ~ 16자 사이로 작성하셔야합니다.' });
            return;
        } else if(common.passwordRegex(password) === -2){
            response.error(res, { errCode: 400, errMsg: 'THIRD_PARTY_ERROR', customErrorMsg: '특수문자는 필수입니다.' });
            return;
        } else if(common.passwordRegex(password) === -3){
            response.error(res, { errCode: 400, errMsg: 'THIRD_PARTY_ERROR', customErrorMsg: '영문자는 필수입니다.' });
            return;
        }

        req.params.password = crypto.createHash('sha512').update(password).digest('base64');



        // 전화번호 모든 특수문자 제거
        const regExp = /[\{\}\[\]\/?.,;s$:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi;
        req.params.phoneNumber = phoneNumber.replace(regExp, "");

        // 성별 불린으로 변환
        req.params.gender = Boolean(gender);

        const resultData = await userModel.userInfo(req, res);
        const retData = await resultData[0][0];

        response.success( res, retData );

    } catch(err) {
        console.log("회원가입 에러 ::: ", err);
        response.error(res, {
            errCode : 500,
            errMsg : "INTERNAL_SERVER_ERROR"
        })
    }
};


// user 로그인을 위한
const userLogin = async ( req, res ) => {

    const { loginId, password } = req.body;

    req.params = req.body;

    try{

        //필수 정보 있는지 확인
        if( !loginId || !password ) {
            // 없으면 에러
            response.error(res, { errCode: 400, errMsg: 'THIRD_PARTY_ERROR', customErrorMsg: '입력하신 정보를 다시 한번 확인해주세요.' });
            return;
        };

        req.params.password = crypto.createHash('sha512').update(password).digest('base64');

        const resultData = await userModel.userLogin( req, res );
        const retData = await resultData[0][0];

        if(!retData) {
            response.error(res, {
                errCode:500,
                errMsg: 'THIRD_PARTY_ERROR', 
                customErrorMsg: '아이디, 비밀번호를 다시 한번 확인해주세요.'
            });
             return;
        };

        req.params.weatherMerber = true;
        req.params.userNum = retData.id;

        let authToken = auth.authToken.member.set(req);

        response.success( res, {
            data : retData,
            auth_token : authToken
        } );

    } catch( err ){
        console.log("로그인 에러", err);
        response.error(res, {
            errCode:500,
            errMsg : "INTERNAL_SERVER_ERROR"
        });
    }
};



// 카카오톡 소셜 로그인 응답을 받아 정보 조회
// 소셜 로그인이고 정보가 없으면 회원가입으로 넘어간다.
const responseK = async ( req, res ) => {
    try {

        // 카카오톡으로 로그인 후 프론트에서 받아오는 토큰 
        const codeSend = req.query.code;

        console.log("로그인 url 이동 후 오게되는 토큰 :::", codeSend);

        //필수 정보 있는지 확인
        if( !req.query.code  ) {
            // 없으면 에러
            response.error(res, { errCode: 400, errMsg: 'THIRD_PARTY_ERROR', customErrorMsg: '카카오톡 로그인을 다시 한번 확인해주세요' });
            return;
    };

        const kakaRestId = "e98a98f979b43a08c0756c1590d4f028";


        // 받아온 토큰 확인 하기 위한 절차
        const postAxios = await axios.post(`https://kauth.kakao.com/oauth/token?grant_type=authorization_code&client_id=${kakaRestId}&redirect_uri=http://127.0.0.1:5002/volteer/user/response&code=${codeSend}&client_secret=Y7ZRniW3iS1rpiOjmTl1fWkyJgn5Cg1h`,{
            headers : {
                "Content-type" : "application/x-www-form-urlencoded;charset=utf-8"
            }
        });

        // 새롭게 다시 받아온 토큰
        const emailcode = postAxios.data.access_token; 

        console.log("새롭게 다시 받아오는 토큰 ::: ", emailcode);

        // 새롭게 받은 토큰으로 사용자 정보 조회
        const resultAx = await axios.get('https://kapi.kakao.com/v2/user/me',{
            headers: {
                Authorization: `Bearer ${emailcode}`,
                "Content-type" : "application/x-www-form-urlencoded;charset=utf-8"
            }
        });

        console.log("유저가 동의한 정보 조회하기 :::", resultAx.data);

        const kakaotalkEmail = await resultAx.data.kakao_account.email;
        const kakaotalkname = await resultAx.data.properties.nickname;

        // 이전에 가입한 적이 있는지 db에서 확인 
        const resultUserConfitm = await userModel.confirmUserId( kakaotalkEmail );

        // 저장된 아이디가 없을 경우 signUp 회원가입창으로 이동
        if(resultUserConfitm[0].length === 0){

            response.success( res, {
                code:0,
                message : "signUp",
                data : {
                    id : kakaotalkEmail,
                    nickname : kakaotalkname
                }
            });

            return ;
        }else { // 저장된 아이디가 있는 경우 내 서비스 토큰 새롭게 발급

            req.params.weatherMerber = true;

            let authToken = auth.authToken.member.set(req);

            response.success( res, {
                code:1,
                message : "success!!!",
                data : {
                    id : resultUserConfitm[0][0],
                    auth_token : authToken
                }
            });

            return ;
        };

    } catch ( err ){
        console.log("여기서 카카오 에러 확인 ::" , err);
    }
};




// 유저 mypage 확인하기
const mypage = async ( req, res ) => {
    try {

        const requestMypage = await userModel.mypage(req);

        // 코멘트 배열로 합쳐서 보내주기
        let returnDataList = [];

        for( let n = 0; n < requestMypage[0].length; n++){

            // 코멘트 부분 묶어서 추가
            const addObj = {
                comment : requestMypage[0][n].comment,
                userName : requestMypage[0][n].userName,
                userGroup : requestMypage[0][n].gropName || "null"
            };

            // 등록번호가 겹치지 않으면 저장
            if(!returnDataList.find(i => i.registNo === requestMypage[0][n].registNo)){
                // 우선 변수에 저장
                let pushData = requestMypage[0][n];
                // 코멘트 배열 부분 새로 저장
                pushData.commentArray = [addObj];
                // 반환해주기
                returnDataList.push(pushData);
            }else {
                // 등록번호가 겹치는 배열 
                const arrayIndex = returnDataList.findIndex(i => i.registNo === requestMypage[0][n].registNo);
                // 등록번호가 겹치는 배열의 인덱스의 코멘트 배열에다 추가해주기
                returnDataList[arrayIndex].commentArray.push(addObj);
            }
        }

        // 조회 결과 보내기
        response.success( res, {
            data : {
                count : requestMypage[0].length,
                list : returnDataList
            }
        });


    } catch ( err ) {
        console.log("유저 mypage 에러", err);
        response.error(res, {
            errCode:500,
            errMsg : "INTERNAL_SERVER_ERROR"
        });
    };
};



module.exports = {
    userInfo,
    userLogin,
    responseK,
    mypage,
}