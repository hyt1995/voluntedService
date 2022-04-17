const axios = require("axios");
const response  = require("../module/response");
const groupModel = require("../model/group");



// 유저가 그룹 만들기
const makeGroup = async ( req, res ) => {

    const { gropName, makeUserName, purposeMake, limitPeople, oprnChatingUrl } = req.body;

    req.params = req.body;

    try {

        //필수 정보 있는지 확인
        if( !gropName || !makeUserName || !purposeMake || !limitPeople ) {
            // 없으면 에러
            response.error(res, { errCode: 400, errMsg: 'THIRD_PARTY_ERROR', customErrorMsg: '입력하신 정보를 다시 한번 확인해주세요.' });
            return;
        };

        // 그룹 참가 인원 제한
        req.params.limitPeople = Number(limitPeople);

        // 정보 저장 요청
        const requestGroup = await groupModel.makeGroup( req, res );

        console.log("여기서 그룹 만들기 결과 :::", requestGroup);



        // 데이터 반환해주기
        response.success (res);


    } catch (err) {
        console.log("그룹 만들기 에러", err);
        response.error(res, {
            errCode : 500,
            errMsg : "INTERNAL_SERVER_ERROR"
        });
    };
};


// 그룹 가입하기
const joinGroup = async ( req, res ) => {

    req.params = req.body;

    try{

        console.log("그룹 가입하기 실행 ::: ", req.user);

        req.params.groupId = Number(req.body.groupId);

        const joinGroupRequest = await groupModel.joinGroup(req);

        console.log("여기서 가입 결과 확인 ::::", joinGroupRequest);

        response.success (res);


    } catch (err) {
        console.log("그룹 조인하기 에러", err);
        response.error(res, {
            errCode : 500,
            errMsg : "INTERNAL_SERVER_ERROR"
        });
    };
};






module.exports = {
    makeGroup,
    joinGroup
}