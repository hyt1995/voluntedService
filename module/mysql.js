const config = require("../config");
const mysql = require("mysql");
const res = require("express/lib/response");

let pool = mysql.createPool(config.mysql);


module.exports = {
    single: async function (sql) {
        try {
            return pool.getConnection((err, connection) => {
                console.log("pool로 MYSQL 연결");
                if(err) throw err;
                connection.query(sql, (err, result, fields) => {
                    if(err) {
                        console.error("connection_pool Get error / ", err);
                        // res.status(500).send("message : server error", err);
                        return err;
                    }else {
                        if(result.length === 0 ){
                            return "length === 0";
                            // res.status(400).json({
                            //     code: 0,
                            //     message : "error"
                            // })
                        } else {
                            console.log("결과 확인", result[0]);
                            return result[0];
                            // return result;
                            // res.status(200).json({
                            //     code : 1,
                            //     message:"success",
                            //     data : result
                            // })
                        }
                    }
                });
                connection.release();
            })
        } catch (err) {
            console.log("mysql 서버 에러", err);
            // res.status(500).send("거래소 정보 저장 에러",err);
            return "에러발생 ::" + err;
        };
    },



    db : mysql.createPool(config.mysql),
}