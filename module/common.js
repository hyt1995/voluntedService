// const proj4 = require('proj4');
const moment = require("moment");

const passwordRegex = (val) => {
    //비밀번호 규칙(8~16자, 대문자,소문자,특수문자 중 3종류 이상 조합, 특수문자필수, 영문자필수)
    if (!/[A-Z,a-z,0-9,!@#$%^&*()]{8,16}$/.test(val)) { 
        //8~16자
        return -1;
    }
    let chk_cnt = 0; 
    let chk_num = val.search(/[0-9]/ig); 
    let chk_eng = val.search(/[a-z]/g);
    let chk_big = val.search(/[A-Z]/g);
    let chk_spc = val.search(/[!@#$%^&*()]/ig);

    if (chk_num < 0) {
        chk_num = 0;
    } else {
        chk_num = 1;
    }

    if (chk_eng < 0) {
        chk_eng = 0;
    } else {
        chk_eng = 1;
    }

    if (chk_big < 0) {
        chk_big = 0;
    } else {
        chk_big = 1;
    }

    if (chk_spc < 0) {
        chk_spc = 0;
    } else {
        chk_spc = 1;
    }

    chk_cnt = chk_num + chk_eng + chk_big + chk_spc;

    if (chk_cnt < 3) { 
        //대문자,소문자,특수문자 중 3종류 이상 조합
        return -1;
    }

    if (chk_spc < 1) {
        //특수문자필수
        return -2;
    }
    if (chk_eng + chk_big < 1) {
        //영문자필수
        return -3;
    }

    return 1;
};

// const convertGeoLocation = (val)=>{
//     var firstProjection = "+proj=tmerc +lat_0=38 +lon_0=127.5 +k=0.9996 +x_0=1000000 +y_0=2000000 +ellps=GRS80 +units=m +no_defs"; //from
//     var secondProjection = "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs"; //to
//     var geo = proj4(firstProjection, secondProjection, [parseFloat(val[0]), parseFloat(val[1])])// Convert 하려는 좌표
//     return geo;
// }


/*
 * IP조회
 * */
const getIP = (req) => {
    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    ip = ip.replace(/::ffff:/gi, "");

    return ip;
};

/*
 * 브라우저조회
 * */
const getBrowsor = (req) => {
    let userAgentInt = 1;
    let userAgentString = req.header('User-Agent');
    // Detect Chrome 
    let chromeAgent = userAgentString.indexOf("Chrome") > -1;

    // Detect Internet Explorer 
    let IExplorerAgent = userAgentString.indexOf("MSIE") > -1 || userAgentString.indexOf("rv:") > -1;

    // Detect Firefox 
    let firefoxAgent = userAgentString.indexOf("Firefox") > -1;

    // Detect Safari 
    let safariAgent = userAgentString.indexOf("Safari") > -1;

    // Discard Safari since it also matches Chrome 
    if ((chromeAgent) && (safariAgent))
        safariAgent = false;

    // Detect Opera 
    let operaAgent = userAgentString.indexOf("OP") > -1;

    // Discard Chrome since it also matches Opera      
    if ((chromeAgent) && (operaAgent)) {
        chromeAgent = false;
    }

    if (chromeAgent) {
        userAgentInt = 0;
    }
    else if (safariAgent) {
        userAgentInt = 0;
    }
    else if (firefoxAgent) {
        userAgentInt = 0;
    }
    else if (operaAgent) {
        userAgentInt = 0;
    }
    else if (IExplorerAgent) {
        userAgentInt = 0;
    }
    else {
        userAgentInt = 1;
    }

    return userAgentInt;
};


const leftPad = (value)=> { 
    if (value >= 10) { 
        return value; 
    } 
    return `0${value}`; 
}


// 현재 시간 20210813 으로 형식 바꿔주는 함수
const toStringByFormatting = (source, delimiter)=> { 
    const year = source.getFullYear(); 
    const month = leftPad(source.getMonth() + 1); 
    const day = leftPad(source.getDate()); 
    return [year, month, day].join(delimiter); 
   }




// 날짜 검사하는 함수
const dateValidation = ( req, res, ...args ) => {

    let result  = true;
    let resultDate

    // 들어온 인자 개수만큼 반복문
    for (let n = 0; n < args.length; n++ ) {
        
        // 키 따로 분류해서 저장
        const name = Object.keys(args[n])[0];
        // 값 따로 분류해서 저장
        const value = args[n][name];
        
        // 우선 날짜 형식 검사
        if( !moment(value, "YYYYMMDD", true).isValid() ) {
            // 형식에 어긋날 경우 변환
            // resultDate = String(value).replace(/\-/g,'').replace(/\./g,'').replace(/\//g,'').slice(0,8);
            const regExp = /[\{\}\[\]\/?.,;s$:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi; // 모든 특수문자 제거
            resultDate = value.replace(regExp, "").slice(0,8);
            // 다시 검사
            if ( !moment(resultDate, "YYYYMMDD", true).isValid() ){
                // 최종결과 실패
                result = false;
            } else {
                // 성공 데이터 저장
                req.params[name] = resultDate;
            }
        }
        
    }
    // 최종 실패로 에러 날리기
    return result;
};



module.exports = {
    passwordRegex : passwordRegex,
    getIP: getIP,
    getBrowsor: getBrowsor,
    toStringByFormatting,
    dateValidation
}