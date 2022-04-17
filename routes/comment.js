const express = require("express");
const router = express.Router();
const commentCon = require("../controller/comment");





/**
 * 봉사활동 신청하기
 * @route POST /comment/write
 * @group comment - 코멘트 
 * @summary 코멘트 작성하기
 * @param {string} voluntedRegistNum.formData.required - 봉사 등록번호 - default :2819258
 * @param {string} comment.formData.required - 코멘트 - default : 코멘트 작성
 * @returns {object} 200 -
 *{
 *  "code": 1,
 *  "message": "success!!!"
 *}
 * @returns {Error}  default -
 *{
 *  "code": 0,
 *  "message": "오류내용"
 *}
 * @security JWT
 */
// 유저가 봉사 신청하기
router.post("/write", ( req, res )=>{
    commentCon.write( req, res );
});








module.exports = router;