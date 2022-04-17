const response  = require("../module/response");
const commonModul = require("../module/common");
const couponModel = require("../model/coupon");



// 매달 모든 유저 쿠폰 초기화하기
const defaultget = async ( req, res ) => {
    try{

        console.log("매달 쿠폰 초기화 하기 실행");


        const resetRequest = await couponModel.defaultget( req ,res );

        response.success(res, "success!");


    } catch ( err ){
        console.log("매달 쿠폰 초기화 에러", err);
        response.error(res, {
            errCode : 500,
            errMsg : "INTERNAL_SERVER_ERROR"
        });
    }
};



// 봉사 관련하여 쿠폰 사용한 경우
const apply = async ( req, res ) => {

    const { progrmRegistNo, userId, usePurpose } = req.body;
    req.params = req.body;

    try {

        // //필수 정보 있는지 확인
        // if( !progrmRegistNo || !usePurpose || !userId ) {
        //     // 없으면 에러
        //     response.error(res, { errCode: 400, errMsg: 'THIRD_PARTY_ERROR', customErrorMsg: '입력하신 정보를 다시 한번 확인해주세요.' });
        //     return;
        // };

        // // users 테이블에서 우선 쿠폰 개수 확인하기
        // const applyRequest = await couponModel.apply( req, res );
        
        // const { couponCount, couponBuy } = applyRequest[0][0];

        // // 유저 쿠폰 개수 저장
        // req.params.couponCount = Number(couponCount); // 기본 쿠폰 개수
        // req.params.couponBuy = Number(couponBuy); // 구매한 쿠폰 개수

        // // 쿠폰이 없을 경우 에러 메세지
        // if( req.params.couponCount < 1 && req.params.couponBuy < 1){
        //     response.error(res, { errCode: 400, errMsg: 'THIRD_PARTY_ERROR', customErrorMsg: '사용가능한 쿠폰이 없습니다.'});
        //     return ;
        // };

        // console.log("@#$#$# :::: ", req.params.couponCount, req.params.couponBuy);



        // if(req.params.couponCount > 0){ // 기본 쿠폰 차감할 경우
        //     req.params.couponCount = req.params.couponCount - 1;
        //     res.locals.message = "기본 쿠폰 차감";
            
        // }else if (req.params.couponBuy > 0) { // 구매한 쿠폰 차감할 경우
        //     req.params.couponBuy = req.params.couponBuy -1;
        //     res.locals.message = "구매한 쿠폰 차감";
        // }

        // coupon 테이블에 유저아이디, 봉사 등록번호, 쿠폰 사용 목적 등록 그리고 users 테이블 쿠폰개수 변경
        // const userCount = await couponModel.useCoupon(req ,res);
        // const userCountResult = await userCount[0][0];

        const couponCountRequest = await couponModel.addCouponTable(req ,res);
        const couponMinusResult = await couponCountRequest[0][0];

        console.log("업데이트 결과 ::::", couponMinusResult);

        response.success(res, res.locals.message);


    } catch(err) {
        console.log("봉사 관련 쿠폰 사용 에러", err);
        response.error(res, {
            errCode : 500,
            errMsg : "INTERNAL_SERVER_ERROR"
        });
    };
};








module.exports = {
    defaultget,
    apply
}





















