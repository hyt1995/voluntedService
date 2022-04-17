const express = require("express");
const router = express.Router();
const volunteerInfoCon = require("../controller/volunteerInfo");

// 들어왔는지 확인하는 부분
router.get("/",  (req, res) => {
    res.status(200).send("volunteerInfo 로 들어오셨습니다.");
});



/**
 * 봉사활동 정보 가져와서 페이지 네이션으로 보여주기
 * @route GET /volunteerInfo/infoLookUp
 * @group volunteerInfo - 봉사활동 정보
 * @summary 봉사활동 정보 리스트로 보여주기
 * @param {string} pageNumber.query - 현재 페이지 넘버 - default: 1
 * @param {string} startDate.query - 시작 날짜 - default: 20220101
 * @param {string} endDate.query - 종료 날짜 - default: 20221231
 * @param {string} area.query - 검색 지역 - default: 동안구
 * @returns {object} 200 -
 *{
 *  "code": 1,
 *  "message": "정상",
 *  "data": {
 *    "count" : "success!!!",
 *    "dataList" : [
 *          {
 *              "registNo": "2818256",
 *              "progrmTitle": "[아름다운가게 영등포점] 월요일 오전(10:30 ~ 14:30) / 재사용 나눔가게 운영 지원(최소 4회, 통화필수)",
 *              "progrmBeginDate": "20220401",
 *              "progrmEndDate": "20220630",
 *              "actBeginTm": "10",
 *              "actEndTm": "14",
 *              "recruitNunber": 3,
 *              "srvcClcode": "기타 > 기타",
 *              "peoplePossible": "N/Y/N",
 *              "mnnstNm": "아름다운 가게 영등포점",
 *              "postAdres": "서울특별시 영등포구 영중로 지하 40 영등포뉴타운 지하쇼핑몰 이벤트홀 (지하)",
 *              "adminName": "이웅술",
 *              "email": "wsuri@beautifulstore.org",
 *              "progrmExpl": "프로그램 설명",
 *              "telNo": "02-2069-1002",
 *              "actWkdy": "1000000",
 *              "noticeBegin": "20220303",
 *              "noticeEnd": "20220630"
 *          },
 *              ...
 *      ]
 *  }
 *}
 * @returns {Error}  default -
 *{
 *  "code": 0,
 *  "message": "오류내용"
 *}
 * @security JWT
 */
// api조회 후 db에 저장하기
router.get("/infoLookUp", async (req, res) => {
    volunteerInfoCon.infoLookUp(req, res);
});






/**
 * 봉사활동 정보 추가로 저장하기
 * @route POST /volunteerInfo/addPost
 * @group volunteerInfo - 봉사활동 정보
 * @summary 봉사활동 정보 추가로 저장하기
 * @param {string} progrmRegistNo.formData.required - 프로그램 등록번호 - default: progrmRegistNo :2819258
 * @param {string} progrmSj.formData.required - 봉사활동 제목 - default: [아름다운가게 동대문점] 2월~4월 오후 자원봉사자 구합니다.
 * @param {string} progrmBgnde.formData.required - 봉사시작일자 - default: progrmBgnde :20220310
 * @param {string} progrmEndde.formData.required - 봉사종료일자 - default: progrmEndde :20220531
 * @param {string} actBeginTm.formData.required - 봉사시작시간 - default: actBeginTm : 10
 * @param {string} actEndTm.formData.required - 봉사종료시간 - default: actEndTm : 17
 * @param {string} noticeBegin.formData.required - 모집시작일 - default: noticeBgnde :20220309
 * @param {string} noticeEnd.formData.required - 모집종료일 - default: noticeEndde :20220531
 * @param {string} rcritNmpr.formData.required - 모집 인원 - default: rcritNmpr : 3
 * @param {string} srvcClCode.formData.required - 봉사분야 - default: 기타 > 기타
 * @param {string} peoplePossible.formData.required - 성인/청소년/단체 가능 여부- default:  y/n/n
 * @param {string} mnnstNm.formData.required - 모집기관 - default: 아름다운가게 동대문점
 * @param {string} postAdres.formData.required - 봉사장소 - default: postAdres : 서울특별시 용산구  한강대로 393 동산빌딩 7층
 * @param {string} nanmmbyNmAdmn.formData.required - 담당자명 - default:  nanmmbyNmAdmn : 추미정
 * @param {string} email.formData.required - 이메일 - default: email : kbcainfo@naver.com
 * @param {string} progrmCn.formData.required - 봉사설명 - default: progrmCn : 본 협회는 혈액 및 종양(암) 으로 투병 중인 환우분들께서 보다 나은 환경에서 완치의 희망을 가질 수 있도록 \r\n경제적 지원(치료비,약제비 지원),교육(의료진 강의),상담,해외학술 등 다양한 사업을 수행하며,사회 보건복지증진에 기여하고 있는 기관입니다. \r\n\r\n위와 관련하여,경영지원부 업무지원 및 기타사무보조를 함께해주실 봉사자 분을 모십니다. 아래 사항을 확인하신 후 관심 있는 분께서는 적극적인 참여 부탁드립니다.\r\n\r\n1. 모집대상: 대학생\r\n2. 모집인원: 1명\r\n3. 봉사기간: 정기 봉사( 매주 목요일 )\r\n4. 봉사시간 : 오전 10시 ~ 오후 5시 \r\n5. 봉사장소: 한국혈액암협회 7층 (서울역 14번 출구 앞)\r\n6. 활동내용: 신규회원 등록,기타 사무보조\r\n7. 활동혜택: 1일당 6시간 실적등록 (중식 제공)\r\n8. 담당자 연락처: 02-3432-0705 ,010-5897-3660 (최혜경 간사)\r\n\r\n\r\n★ 서로의 안전을 위해 백신 접종 여부 확인 하고 있습니다. 이해해주시기 부탁드립니다. (2차 백신접종자)\r\n★ 전화 인터뷰 후 배치해 드리오니, 봉사 신청 후에 위 번호로 전화주세요.\r\n    신청후 2일 안에 연락이 안 될 시에는 반려 드릴 수 있으니 꼭 전화주세요!
 * @param {string} telno.formData.required - 봉사 전화번호 - default:  telno : 02-3432-0807 
 * @param {string} actWkdy.formData.required - 봉사 활동 요일- default:  actWkdy : 0001000
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
// 추가로 봉사활동 정보 저장을 위해
router.post("/addPost", ( req, res ) => {
    volunteerInfoCon.addPost(req, res);
});






/**
 * 봉사활동 신청하기
 * @route POST /volunteerInfo/applyVolunteer
 * @group volunteerInfo - 봉사활동 정보
 * @summary 봉사 신청하기
 * @param {string} progrmRegistNo.formData.required - 프로그램 등록번호 - default :2819258
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
router.post("/applyVolunteer", ( req, res )=>{
    volunteerInfoCon.applyVolunteer( req, res);
});




/**
 * 봉사활동 신청하기
 * @route POST /volunteerInfo/confirmUserVolunt
 * @group volunteerInfo - 봉사활동 정보
 * @summary 유저가 신청한 봉사 리스트 확인
 * @param {string} userId.formData.required - 유저 아이디 - default: 1
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
// 유저가 신청한 봉사 리스트 확인
router.post("/confirmUserVolunt", ( req, res )=>{
    volunteerInfoCon.confirmUserVolunt( req, res);
});



module.exports = router;














































