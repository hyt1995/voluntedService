const pool = require("../module/mysql2");




// 매달 쿠폰 초기화하기
const defaultget = async (req, res) => {

    let sql =`update users set couponCount=3;`;

    let queryValue = [];

    return await pool.getData(sql, queryValue);
};


// 사용자 쿠폰 개수 확인하기
const apply = async ( req , res ) => {

    let sql = `select  couponCount, couponBuy  from users where id= ? ;`;

    let queryValue = [
        req.params.userId,
    ];

    return await pool.getData(sql, queryValue);
};

// 쿠폰을 사용할 경우 - 유저 쿠폰 차감
const useCoupon = async ( req, res ) => {

    let aaa = {"couponCount" : 2};

    let sql = `update users set ? where id = ?`;

    let queryValue = [
        aaa,
        req.params.userId,
        // req.params.usePurpose,
        // req.params.progrmRegistNo,
        // req.params.couponCount,
        // req.params.couponBuy,
    ];

    return await pool.getData(sql, queryValue);
};





// 쿠폰 사용 테이블에 추가
const addCouponTable = async ( req, res ) => {

    let sql = `insert into coupon (userId, voluntedResitnum, usePurpose )values (?, ?, ?);`;

    let queryValue = [
        Number(req.params.userId),
        req.params.usePurpose,
        req.params.progrmRegistNo,
    ];

    return await pool.getData(sql, queryValue);
};








module.exports = {
    defaultget,
    apply,
    useCoupon,
    addCouponTable,
}