const express = require("express");
const router = express.Router();
const couponContro = require("../controller/coupon");


/**
 * 봉사활동 정보 가져와서 페이지 네이션으로 보여주기
 * @route GET /coupon
 * @group coupon - 쿠폰 관련 정보
 * @summary 매달 쿠폰 초기화 하기
 * @returns {object} 200 -
 *{
 *  "code": 1,
 *  "message": "정상",
 *  "data": {
 *    "shop_able_delivery": 달가능여부(1:가능,0:불가능)
 *  }
 *}
 * @returns {Error}  default -
 *{
 *  "code": 0,
 *  "message": "오류내용"
 *}
 * @security JWT
 */
// 우선 매달 1일 전체 인원 쿠폰 5개씩 초기화
router.get("/", ( req, res ) => {
    couponContro.defaultget(req ,res);
});






/**
 * 봉사에 쿠폰 사용하기
 * @route POST /coupon/apply
 * @group coupon - 쿠폰 관련 정보
 * @summary 봉사에 쿠폰 사용
 * @param {string} progrmRegistNo.formData - 프로그램 등록번호 - default: progrmRegistNo :2819258
 * @param {string} userId.formData - 사용한 유저 아이디 - default : 2
 * @param {string} usePurpose.formData - 쿠폰 사용 목적 - default : gender(성별)/age(나이)/random(랜덤)
 * @returns {object} 200 -
 *{
 *  "code": 1,
 *  "message": "정상",
 *  "data": {
 *    "shop_able_delivery": 달가능여부(1:가능,0:불가능)
 *  }
 *}
 * @returns {Error}  default -
 *{
 *  "code": 0,
 *  "message": "오류내용"
 *}
 * @security JWT
 */
// 봉사 관련해서 쿠폰을 쓴 경우
router.post("/apply", ( req , res ) => {
    couponContro.apply(req ,res);
});







// 유저 테이블 남아있는 쿠폰/ 돈주고 산 쿠폰/


// 테이블을 만들어서 현재 쿠폰을 어떤 봉사에 썼는지 
//  (신청 인원 성별/신청인원수 알아보기,  랜덤피하기)에 썼는지 확인할수있게

// ( 쿠폰 1 - 유저 아이디 - 봉사 정보 아이디 - 썼는지 유무 - 쓴 이유  - 언제 샀는지(날짜/기본으로 주는건지) -  )

// 쿠폰을 사면 쿠폰 테이블에 유저 아이디로 산 개수만큼 추가된다.
// 현재 쿠폰을 어떤 봉사에 왜 썼는지
// 이번달에 쿠폰을 몇개 샀는지 확인할수있게(default : 5)
// 현재 쿠폰이 몇개 남았는지 
// 매달 1일에 쿠폰 개수가 초기화가 되어야한다.
// 한달마다 쿠폰 테이블이 초기화되어야한다. 


module.exports = router;



























