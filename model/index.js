const pool = require("../module/mysql2");


const indexRouter = async (req, res) => {
    const sql = `select * from users where id = ?`;
    let queryValue = [
        1
    ];


    return await pool.query(sql,queryValue);
};




module.exports = {
    indexRouter
};