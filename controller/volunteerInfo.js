const volunteerInfoModel = require("../model/volunteerInfo");
const axios = require("axios");
const response  = require("../module/response");
const decodingKey = "elnY/olwGOrW1IdetzYnTg57rZ9hax/4cv+wXPk7uUjtqdXNiV7GD5AoPmem3oUzCSTvR0klktDmSF6KuIFJEg=="
const encodingKey = "elnY%2FolwGOrW1IdetzYnTg57rZ9hax%2F4cv%2BwXPk7uUjtqdXNiV7GD5AoPmem3oUzCSTvR0klktDmSF6KuIFJEg%3D%3D"
const commonModul = require("../module/common");



// 봉사활동 정보 리스트로 반환해주기
const infoLookUp = async ( req, res ) => {
    try {

        const { pageNumber, startDate, endDate, area } = req.query;

        req.params = req.body;

        // 페이지 넘버 반환 "리스트 개수는 5개로 고정"
        req.params.pageNumber = pageNumber ? (Number(pageNumber) -1) * 5 : 0;


        // 시작, 종료 날짜가 없을 경우 이번년도 시작과 끝을 넣어준다.
        // 시작날짜
        req.params.startDate = startDate ? startDate : `${new Date().getFullYear()}0101`;;
        // 종료 날짜
        req.params.endDate = endDate ? endDate : `${new Date().getFullYear()}1231`;

        //  여기서 시작날짜 종료 날짜 yyyymmdd로 형식 검사하기
        const inspecDate = commonModul.dateValidation(req, res, {startDate:req.params.startDate}, {endDate:req.params.endDate});
        if(!inspecDate){
            response.error(res, { errCode: 400, errMsg: 'THIRD_PARTY_ERROR', customErrorMsg: '날짜를 다시 한번 확인해주세요(띄어쓰기 안됩니다.)' });
            return ;
        }

        // 지역 검사하기 - 수정!! - 후에 회원이 설정한 지역 / 회원이 사는 동 / 구 를 db에서 가져와서 넣어줄것
        req.params.area = area ? `%${area}%` : "%영등포구%";

        // 전체 데이터 개수 가져오기
        const dataCountRequest = await volunteerInfoModel.infoCount(req, res);
        const dataCount = await dataCountRequest[0][0].count;


        // 봉사 리스트 반환
        const resultPageRequest = await volunteerInfoModel.infoLookUp( req, res );
        const resultPage = await resultPageRequest[0];

        // 리턴할 데이터 리스트, 개수 가져오기
        const returnDataResult = {
            count : dataCount,
            dataList : resultPage,
            currentPage : pageNumber ? pageNumber : 1
        }


        // 데이터 반환해주기
        response.success (res, returnDataResult);
        

    } catch( err ){
        console.log("봉사 정보 리스트 반환 에러", err);
        response.error(res, {
            errCode : 500,
            errMsg : "INTERNAL_SERVER_ERROR"
        });
    }
};






// api 조회 후 db에 저장하기
const lookUpApi = async () => {

    try {

        // 우선 전체 개수를 알기 위한
        const totalCountApiAddress = await axios.get(`http://openapi.1365.go.kr/openapi/service/rest/VolunteerPartcptnService/getVltrPeriodSrvcList?serviceKey=${encodingKey}&progrmBgnde=20220101&progrmEndde=20221231&pageNo=444`);
        const totalCount = Math.floor(Number(totalCountApiAddress.data.response.body.totalCount) / Number(totalCountApiAddress.data.response.body.numOfRows)) + 1;

        const numberRow = Math.floor(totalCount/7)

        // 요일별로 나눠서 수정 및 저장
        const date = new Date();
        // 오늘 요일 숫자로 나옴
        const today = date.getDay();

        // for 문 시작 
        const startNumber = today !== 1 ? numberRow * today - numberRow + 1 : 1;
        // for 문 종료
        const endNumber = today !== 7 ?  numberRow * today : numberRow * today + 7

        for(let d = startNumber; d <= endNumber; d++){
            // 숫자가 넘어가면 에러 처링

            // 기간별 전체 페이지 별 불러오기
            const resultApi = await axios.get(`http://openapi.1365.go.kr/openapi/service/rest/VolunteerPartcptnService/getVltrPeriodSrvcList?serviceKey=${encodingKey}&progrmBgnde=20220101&progrmEndde=20221231&pageNo=${d}`);
            const listDateData = await resultApi.data.response.body.items.item;

            if(!listDateData){
                console.log("아무것도 들어온게 없습니다.!!!!!!", listDateData);
                return;
            }

            let returnJson = [];

            for(let n = 0; n<listDateData.length; n++){

                let progrmRegistNo = String(listDateData[n].progrmRegistNo);
    
                // 등록번호로 자세한 내용 가져오기     2826302
                const resultDetailInfo = await axios.get(`http://openapi.1365.go.kr/openapi/service/rest/VolunteerPartcptnService/getVltrPartcptnItem?serviceKey=${encodingKey}&progrmRegistNo=${progrmRegistNo}`);
                const detailData = await resultDetailInfo.data.response.body.items.item;
    
                // 모집 기준별 확인하기
                detailData.peoplePossible = `${detailData.yngbgsPosblAt}/${detailData.adultPosblAt}/${detailData.grpPosblAt}`;
                // 자원봉사 설명중에 ' 스트링으로 변환과 겹쳐서 '를 "로 변환한다.
                detailData.progrmSj = detailData.progrmSj.replace(/'/g, '"');
                detailData.progrmCn = detailData.progrmCn.replace(/'/g, '"');
                // 시간 2글자로 저장
                detailData.actBeginTm = String(detailData.actBeginTm).length !== 2 ? "0" + String(detailData.actBeginTm) : String(detailData.actBeginTm);
                detailData.actEndTm = String(detailData.actEndTm).length !== 2 ? "0" + String(detailData.actEndTm) : String(detailData.actEndTm);
        
        
                //  자세한 정보 저장하기  
                const resultSaveDetailData = await volunteerInfoModel.lookUpApi(detailData);
    
                if(!resultSaveDetailData) {
                    // response.error(res, { errCode: 400, errMsg: 'THIRD_PARTY_ERROR', customErrorMsg: '다시 한번 시도해주세요' });
                    console.log("DB에 저장 에러입니다.", err);
                    return;
                }
    
                returnJson.push({
                    top : listDateData[n],
                    bottom : detailData
                });
            };

        }

        console.log("DB 저장 성공입니다.!!!!");
        return;


    } catch(err){
        console.log("api 조회 후 db에 저장 에러 :::", err);
    }
};





// 봉사활동 추가로 데이터베이스에 저장하기
const addPost = async ( req, res ) => {

    req.params = req.body;

    const { 
        progrmRegistNo, progrmSj, progrmBgnde, progrmEndde, actBeginTm, actEndTm, 
        noticeBegin, noticeEnd, rcritNmpr, srvcClCode, peoplePossible, mnnstNm, postAdres, 
        nanmmbyNmAdmn, email, progrmCn, telno, actWkdy 
    } = req.body;

    try{

        //필수 정보 있는지 확인
        if( !progrmRegistNo || !progrmSj || !progrmBgnde || !progrmEndde || !actBeginTm 
            || !actEndTm || !noticeBegin || !noticeEnd || !rcritNmpr || !srvcClCode || !peoplePossible 
            || !mnnstNm || !postAdres || !nanmmbyNmAdmn || !email || !progrmCn || !telno || !actWkdy  
            ) {
            // 없으면 에러
            response.error(res, { errCode: 400, errMsg: 'THIRD_PARTY_ERROR', customErrorMsg: '입력하신 정보를 다시 한번 확인해주세요.' });
            return;
        };

        // 어른 가능 / 청소년 가능/ 가족(그룹) 가능 여부 string로 변환
        // req.params.peoplePossible = `${detailData.yngbgsPosblAt}/${detailData.adultPosblAt}/${detailData.grpPosblAt}`;

        // 자원봉사 설명중에 ' 스트링으로 변환과 겹쳐서 '를 "로 변환한다.
        req.params.progrmSj = progrmSj.replace(/'/g, '"');
        req.params.progrmCn = progrmCn.replace(/'/g, '"');
        // 시간 2글자로 저장
        req.params.actBeginTm = String(actBeginTm).length !== 2 ? "0" + String(actBeginTm) : String(actBeginTm);
        req.params.actEndTm = String(actEndTm).length !== 2 ? "0" + String(actEndTm) : String(actEndTm);

        //  여기서 시작날짜 종료 날짜 yyyymmdd로 형식 검사하기
        const inspecDate = commonModul.dateValidation(req, res, {progrmBgnde:req.params.progrmBgnde}, {progrmEndde:req.params.progrmEndde}, {noticeBegin:req.params.noticeBegin}, {noticeEnd:req.params.noticeEnd});
        if(!inspecDate){
            response.error(res, { errCode: 400, errMsg: 'THIRD_PARTY_ERROR', customErrorMsg: '날짜를 다시 한번 확인해주세요(띄어쓰기 안됩니다.)' });
            return ;
        };

        // 모집인원 숫자로 변경
        req.params.rcritNmpr = Number(rcritNmpr);

        // 01로 들어오는 걸 월,화 요일로 변경해서 저장
        let strDay = ["월", "화", "수", "목", "금", "토", "일"];
        let dayFor = "";
        for (let n = 0; n < 7; n++){
            if(n === 6 && actWkdy[n] === "1"){
                dayFor += `${strDay[n]}`;
                continue;
            }
            if(actWkdy[n] === "1"){
                if(dayFor.length === 0){
                    dayFor += `${strDay[n]}`;
                }
                dayFor += `/${strDay[n]}`;
            }
        };
        req.params.actWkdy = dayFor;

        // 추가로 자세한 정보 저장하기
        const resultSaveDetailData = await volunteerInfoModel.addPost(req);

        console.log("저장결과 확인 ::: ", resultSaveDetailData);

        // 데이터 반환해주기
        response.success (res);


    } catch(err){
        console.log("봉사활동 api가져오기 에러", err);
        response.error(res, {
            errCode : 500,
            errMsg : "INTERNAL_SERVER_ERROR"
        });
    }
};




// 유저가 봉사 신청하기 
const applyVolunteer = async ( req, res ) => {

    const { progrmRegistNo } = req.body;

    req.params = req.body;

    try {

        //필수 정보 있는지 확인
        if( !progrmRegistNo) {
            // 없으면 에러
            response.error(res, { errCode: 400, errMsg: 'THIRD_PARTY_ERROR', customErrorMsg: '입력하신 정보를 다시 한번 확인해주세요.' });
            return;
        };

        // 봉사 신청 저장하기
        const resultApplyRequest = await volunteerInfoModel.applyVolunteer(req, res);
        const resultApplyResult = resultApplyRequest;

        console.log("여기서 봉사신청 결과 ::::", resultApplyResult);

        // 데이터 반환해주기
        response.success (res);


    } catch( err ) {
        console.log("봉사 신청 에러", err);
        response.error(res, {
            errCode : 500,
            errMsg : "INTERNAL_SERVER_ERROR"
        });
    }
};



// 유저가 신청한 봉사리스트 확인을 위한
const confirmUserVolunt = async ( req, res ) => {
    try {

        console.log("유저가 신청한 봉사 리스트");
        const getUserApplyList = await volunteerInfoModel.confirmUserVolunt(req, res);
        const resultApply = await getUserApplyList[0];

        console.log("유저신청 리스트 :::: --->", resultApply);

        // 데이터 반환해주기
        response.success (res, "success");


    } catch (err) {
        console.log("유저 신청한 봉사 리스트 확인 에러 :::: ", err);
        response.error(res, {
            errCode : 500,
            errMsg : "INTERNAL_SERVER_ERROR"
        });
    }
}






module.exports = {
    addPost,
    lookUpApi,
    infoLookUp,
    applyVolunteer,
    confirmUserVolunt
}
































