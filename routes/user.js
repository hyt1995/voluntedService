const express = require("express");
const router = express.Router();
const userCon = require("../controller/user");




/**
 * 유저 회원가입
 * @route POST /user/signUp
 * @group Users - 유저
 * @summary 유저 회원가입
 * @param {string} birthday.formData.required - 생년월일 - default: 19950527
 * @param {string} gender.formData.required - 성별 - default: true
 * @param {string} phoneNumber.formData.required - 핸드폰 번호 - default: 01082065552
 * @param {string} name.formData.required - 이름 - default: 한영탁  
 * @param {string} userId.formData.required - 아이디 - default: hyt1995
 * @param {string} password.formData.required - 비밀번호 - default: qwer!@#$
 * @param {string} addressDo.formData - 도 - default: 경기도
 * @param {string} addressSi.formData - 시 - default: 안양시
 * @param {string} addressGu.formData - 구 - default: 동안구
 * @param {string} addressGun.formData - 군 - default: ""
 * @returns {object} 200 -
 *{
 *  "code": 1,
 *  "message": "success!!!",
 *}
 * @returns {Error}  default -
 *{
 *  "code": 500,
 *  "message": "오류내용"
 *}
 * @security JWT
 */
// user 정보 저장을 위한
router.post("/signUp", ( req, res ) => {
    userCon.userInfo(req, res);
});



/**
 * 유저 login
 * @route POST /user/login
 * @group Users - 유저
 * @summary 유저 login
 * @param {string} loginId.formData.required - 로그인 아이디 - default: hyt1995
 * @param {string} password.formData.required - 비밀번호 - default: qwer!@#$
 * @returns {object} 200 -
 *{
 *  "code": 1,
 *  "message": "정상",
 *  "data" : {
 *      data : {
 *              id: 13
 *          },
 *              auth_token : "auth_token"
 *     }
 *}
 * @returns {Error}  default -
 *{
 *  "code": 0,
 *  "message": "오류내용"
 *}
 * @security JWT
 */
// 로그인을 위한
router.post("/login", ( req, res ) => {
    userCon.userLogin(req, res);
});



/**
 * 유저 소셜login
 * @route GET /user/response
 * @group Users - 유저
 * @summary 카카오톡 토큰으로 정보 확인
 * @returns {object} 200 -
 *{
 *  "code": 1,
 *  "message": "success!!!",
 *  "data": {
 *      id : 유저 아이디(이메일),
 *      auth-token : "내가 새로 발급한 토큰"
 *    }
 *}
 * @returns {Error}  default -
 *{
 *  "code": 0,
 *  "message": "signUp",
 *  "data" : {
 *          id : "kakaotalk 이메일",
 *          nickname : "kakaotalk 이름"
 *    }
 *}
 * @security JWT
 */
// 카카오톡 소셜 로그인 응답을 받을 라우터
router.get("/response", async ( req , res ) => {
    userCon.responseK( req, res );
});







/**
 * 유저 mypage
 * @route GET /user/mypage
 * @group Users - 유저
 * @summary 유저 mypage
 * @returns {object} 200 -
 *{
 *  "code": 1,
 *  "message": "success!!!",
 *  "data": {}
 *}
 * @returns {Error}  default -
 *{
 *  "code": 0,
 *  "message": "에러 메세지",
 *}
 * @security JWT
 */
// 카카오톡 소셜 로그인 응답을 받을 라우터
router.get("/mypage", async ( req , res ) => {
    userCon.mypage( req, res );
});

module.exports = router;