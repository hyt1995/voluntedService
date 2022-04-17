const express = require("express");
const router = express.Router();
const groupModel = require("../controller/group");



/**
 * 그룹 만들기
 * @route POST /group/makeGroup
 * @group group - 그룹
 * @summary 그룹 만들기
 * @param {string} gropName.formData.required - 그룹 이름 - default : 봉사달달
 * @param {string}  makeUserName.formData.required - 만든사람 이름 - default : 한영탁
 * @param {string}  purposeMake.formData.required - 단체 간단 설명 - default : 봉사를 위해
 * @param {string}  limitPeople.formData.required - 그룹 추가 인원 제한 - default : 120
 * @param {string}  oprnChatingUrl.formData - 오픈 채팅 주소 - default : wwwddd;lldjdj
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
// 유저가 그룹 만들기
router.post("/makeGroup", ( req, res )=>{
    groupModel.makeGroup( req, res );
});





// 그룹에 가입하기
/**
 * 그룹에 가입하기
 * @route POST /group/joinGroup
 * @group group - 그룹
 * @summary 그룹에 가입하기
 * @param {string}  groupId.formData.required - 그룹 아이디 - default : 그룹 아이디 보내기
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
// 유저가 그룹에 가입하기
router.post("/joinGroup", ( req, res )=>{
    groupModel.joinGroup( req, res );
});












module.exports = router;