const pool = require("../module/mysql2");

// 유저 정보 저장
const userInfo = async ( req, res ) => {

    const sql = `insert into users (birthday, gender, phoneNumber, userName, userId, password, addressDo, addressSi, addressGu, addressGun) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ;`;

    let queryValue = [
        req.params.birthday,
        req.params.gender,
        req.params.phoneNumber,
        req.params.name,
        req.params.userId,
        req.params.password,
        req.params.addressDo,
        req.params.addressSi,
        req.params.addressGu,
        req.params.addressGun
    ];

    return await pool.getData(sql, queryValue);
};





// user 로그인을 위한
const userLogin = async ( req, res ) => {
    const sql = `SELECT id FROM users WHERE userId = ? AND password= ?;`;

    let queryValue = [
        req.params.loginId,
        req.params.password
    ];

    return await pool.getData(sql, queryValue);
};


// user 로그인 비밀번호 확인을 위한
const confirmUserId = async ( userid ) => {
    const sql = `SELECT userId FROM users WHERE userId = ( ? );`;

    let queryValue = [
        userid
    ];

    return await pool.getData(sql, queryValue);
};



// 유저 마이페이지 조회하기
const mypage = async (req, res) => {
    const sql = `SELECT registNo,  progrmTitle, progrmBeginDate, progrmEndDate, postAdres, comment, userName, gropName
    FROM userVolunteer
    INNER JOIN volunteerInfo
    ON registNo = voluntedRegistNum
    LEFT JOIN comment
    ON voluntedRegistNum = registNumCo
    LEFT JOIN voluntedInfo.users
    ON comment.userId = users.id
    LEFT JOIN voluntedInfo.groupUser
    ON groupUser.userid = comment.userId
    LEFT JOIN voluntedInfo.grop
    ON grop.id = groupUser.groupId
    WHERE voluntedInfo.userVolunteer.userId = ?
    limit 0,5;
    `;

    let queryValue = [
        req.user.userNum
    ];

    return await pool.getData(sql, queryValue);
};




module.exports = {
    userInfo,
    userLogin,
    confirmUserId,
    mypage,
};