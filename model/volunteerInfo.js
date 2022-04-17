const pool = require("../module/mysql2");


// 봉사 리스트 전체 개수 반환
const infoCount = async ( req, res ) => {

    const sql = "select count (*) as count from volunteerInfo where progrmBeginDate >= ? and progrmEndDate <= ? and postAdres like ?;";

    let queryValue = [
        req.params.startDate,
        req.params.endDate,
        req.params.area,
        req.params.pageNumber
    ];

    return await pool.getData(sql, queryValue);
};

// 봉사 리스트 반환하기
const infoLookUp = async ( req, res ) => {

    // 검색어를 위한
    const sql = "select * from volunteerInfo where progrmBeginDate >= ? and progrmEndDate <= ? and postAdres like ? limit ? , 5;";

    let queryValue = [
        req.params.startDate,
        req.params.endDate,
        req.params.area,
        req.params.pageNumber
    ];

    return await pool.getData(sql, queryValue);

};



// 추가로 봉사 정보 저장
const addPost =  async ( req ) => {

    let queryArray = [
        "registNo",
        "progrmTitle",
        "progrmBeginDate",
        "progrmEndDate",
        "actBeginTm",
        "actEndTm",
        "noticeBegin",
        "noticeEnd",
        "recruitNunber",
        "srvcClcode",
        "peoplePossible",
        "mnnstNm",
        "postAdres",
        "adminName",
        "email",
        "progrmExpl",
        "telNo",
        "actWkdy"
    ];

    let strQuery = "";
    for(let q = 0; q < queryArray.length; q++){
        if(q === queryArray.length-1){
            strQuery += queryArray[q];
            break;
        }
        strQuery += queryArray[q] + ",";
    };


    const sql = `insert into volunteerInfo (${strQuery} ) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    let queryValue = [
        req.params.progrmRegistNo,
        req.params.progrmSj,
        req.params.progrmBgnde,
        req.params.progrmEndde,
        req.params.actBeginTm,
        req.params.actEndTm,
        req.params.noticeBegin,
        req.params.noticeEnd,
        req.params.rcritNmpr,
        req.params.srvcClCode,
        req.params.peoplePossible,
        req.params.mnnstNm,
        req.params.postAdres,
        req.params.nanmmbyNmAdmn,
        req.params.email,
        req.params.progrmCn,
        req.params.telno,
        req.params.actWkdy,
    ];

    return await pool.getData(sql, queryValue);
}



// api조회 후 db에 저장하기
const lookUpApi = async (obj) => {

     // 데이터베이스 테이블 컬럼 확인하기
     let queryArray = [
        "registNo",
        "progrmTitle",
        "progrmBeginDate",
        "progrmEndDate",
        "actBeginTm",
        "actEndTm",
        "noticeBegin",
        "noticeEnd",
        "recruitNunber",
        "srvcClcode",
        "peoplePossible",
        "mnnstNm",
        "postAdres",
        "adminName",
        "email",
        "progrmExpl",
        "telNo",
        "actWkdy"
    ];

    let queryValue = [
        String(obj.progrmRegistNo),
        String(obj.progrmSj),
        String(obj.progrmBgnde),
        String(obj.progrmEndde),
        String(obj.actBeginTm),
        String(obj.actEndTm),
        String(obj.noticeBgnde),
        String(obj.noticeEndde),
        Number(obj.rcritNmpr),
        String(obj.srvcClCode),
        String(obj.peoplePossible),
        String(obj.mnnstNm),
        String(obj.postAdres),
        String(obj.nanmmbyNmAdmn),
        String(obj.email),
        String(obj.progrmCn),
        String(obj.telno),
        String(obj.actWkdy),
    ];

    // 테이블 컬럼 한줄로 만들기
    let strQuery = "";
    for(let q = 0; q < queryArray.length; q++){
        if(q === queryArray.length-1){
            strQuery += queryArray[q];
            break;
        }
        strQuery += queryArray[q] + ",";
    };

    // update를 위한 한줄로 쿼리 만들기
    let updateStrQuery = "";
    for (let u = 0; u < queryArray.length; u++){
        if(queryArray[u] === "registNo"){
            continue;
        }
        if(u === queryArray.length-1){
            updateStrQuery += queryArray[u] + "=" + "'" +queryValue[u] + "'";
            break;
        }
        updateStrQuery += queryArray[u] + "=" + "'" +queryValue[u] + "'" + ",";
    }

    
    const sql = `insert into volunteerInfo (${strQuery} ) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) on duplicate key update ${updateStrQuery}`;

    return await pool.getData(sql, queryValue);
};



// 봉사 신청하기
const applyVolunteer = async ( req, res ) => {

    let sql = `insert into userVolunteer ( userId, voluntedRegistNum ) values ( ?, ? );`;

    let queryValue = [
        req.user.userNum,
        req.params.progrmRegistNo
    ];

    console.log("마지막을 확인 :::: ", queryValue);

    return await pool.getData(sql, queryValue);
}


// 유저가 신청한 봉사리스트확인
const confirmUserVolunt = async ( req, res ) => {

    let sql = `select * from userVolunteer left join users on users.id  = userVolunteer.userId left join coupon on coupon.userId = users.id where users.id = 3;`;

    let queryValue = [
    ];

    return await pool.getData(sql, queryValue);
};


module.exports = {
    lookUpApi,
    addPost,
    infoLookUp,
    infoCount,
    applyVolunteer,
    confirmUserVolunt,
}























