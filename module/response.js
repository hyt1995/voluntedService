const logger = require("./logger");


const success = (res, data) => {
    res.endtime = new Date();
    let restimes = res.endtime - res.starttime
    console.log("시간확인 :::", res.endtime)
    logger.info('[RES] SUCCE (' + restimes.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ".") + ')-- ' + JSON.stringify(data));
    res.status(200).json({
        code : 1,
        message: "success!!!",
        data: data
    })
};

const error = ( res, obj ) => {

    if (!obj.errCode) {
        obj.errCode = 400;
    }

    const errMsg = {
        INVALID_REQUEST_PARAMETER: '필수 파라미터가 없습니다.',
        AUTH_TOKEN_FAIL: '인증키가 없거나 유효하지 않습니다.',
        BAD_REQUEST: '잘못된 요청입니다.',
        PHONE_ALREADY_EXIST: '이미 가입된 휴대전화 번호 입니다.',
        EMAIL_ALREADY_EXIST: '이미 가입된 이메일 주소 입니다.',
        MEMBER_ALREADY_EXIST: '이미 가입된 회원 입니다.',
        SMS_CERT_FAIL: '인증에 실패하였습니다.',
        SMS_CERT_VALID: '인증이 유효하지 않습니다.',
        NOT_PHONE_AUTH: '인증된 휴대전화 번호가 아닙니다.',
        NOT_EMAIL_FORMAT: '이메일 형식이 올바르지 않습니다.',
        NOT_PASSWORD_FORMAT: '비밀번호 형식이 올바르지 않습니다.',
        INTERNAL_SERVER_ERROR: '서버에서 에러가 발생하였습니다.',
        LOGIN_FAIL: '로그인에 실패 하였습니다.',
        IS_NOT_PASSWORD: '현재 설정된 패스워드가 아닙니다.',
        IS_NOT_MEMBERS: '로그인 후 이용해주시기 바랍니다.',
        THIRD_PARTY_ERROR: '',


        ORDER_FAIL_ORDER_PRICE_INVALID: '주문 가격이 올바르지 않습니다.',
        ORDER_FAIL_ORDER_POINT_INVALID: '포인트가 부족합니다.',
    }

    let message = errMsg[obj.errMsg];
    if (obj.customErrorMsg) {
        message = obj.customErrorMsg;
    }

    res.endtime = new Date();

    let restimes = res.endtime - res.starttime;

    logger.info('[RES] ERROR (' + restimes.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ".") + ')-- ' + message);
    res.status(obj.errCode).json({
        code: 0, 
        message: message
    });

}


module.exports = {
    success,
    error
}