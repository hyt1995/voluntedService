const model = require("../model");
const response = require("../module/response");





const indexRouter = async ( req, res ) => {
    try {

        const result  = await model.indexRouter(req, res);

        const retData = result[0][0];
        
        response.success(res, retData);


    } catch(err) {
        console.log("index error :::: " , err);
        res.status(500).json({
            code : 0,
            message : "indexRouter error",
            data: err
        })
    };
}


module.exports = {
    indexRouter
}