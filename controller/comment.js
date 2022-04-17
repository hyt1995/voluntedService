const axios = require("axios");
const response  = require("../module/response");
const commentModel = require("../model/comment");


// 코멘트 작성하기
const write = async ( req, res ) => {

    const { voluntedRegistNum, comment } = req.body;

    req.params = req.body;

    try{

        //필수 정보 있는지 확인
        if( !voluntedRegistNum || !comment ) {
            // 없으면 에러
            response.error(res, { errCode: 400, errMsg: 'THIRD_PARTY_ERROR', customErrorMsg: '입력하신 정보를 다시 한번 확인해주세요.' });
            return;
        };

        const writeCommentRequest = await commentModel.write( req , res );
        console.log("여기서 코멘트 작성 확인 :::", writeCommentRequest);

        // 데이터 반환해주기
        response.success (res);


    } catch ( err ) {
        console.log("코멘트 작성 에러", err);
        response.error(res, {
            errCode : 500,
            errMsg : "INTERNAL_SERVER_ERROR"
        });
    };
};









module.exports = {
    write,
}