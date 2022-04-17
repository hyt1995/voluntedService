const pool = require("../module/mysql2");

// 코멘트 작성
const write = async ( req, res ) => {
    const sql = `insert into comment ( comment, userId, registNumCo ) values ( ?, ?, ? )`;

    let queryValue = [
        req.params.comment,
        // req.user.userNum,
        11,
        req.params.voluntedRegistNum,
    ];

    const resultPool = await pool.getData(sql, queryValue);
    console.log("모델에서 확인 ::::", resultPool);
    return resultPool;
};







module.exports = {
    write,
}