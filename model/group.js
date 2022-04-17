const pool = require("../module/mysql2");


// 그룹 만들기 
const makeGroup = async ( req, res ) => {
    const sql = `insert into grop ( limitPeople, gropName, openChating, purposeMake, makeUserName  ) values ( ?, ?, ?, ?, ? )`;

    let queryValue = [
        req.params.limitPeople,
        req.params.gropName,
        req.params.oprnChatingUrl,
        req.params.purposeMake,
        req.params.makeUserName,
    ];

    return await pool.getData(sql, queryValue);
};


// 그룹 가입하기 
const joinGroup = async ( req ) => {
    const sql = `insert into groupUser ( userId, groupId ) values ( ?, ?);`;
    
    let queryValue = [
        req.user.userNum,
        req.params.groupId
    ];

    return await pool.getData(sql, queryValue);
};



module.exports = {
    makeGroup,
    joinGroup
}