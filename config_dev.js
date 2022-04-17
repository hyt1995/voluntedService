const config = {
    env: "development",
    loglevel : "info",
    server : {
        host: "http://localhost:5002/volteer/",
        port : 5001,
        ssl: false,
        context_path : "/volteer"
    },
    jwt_secret: "voluntedInFo",
    swagger: {
        host: "localhost:5002/volteer"
    },
    mysql: {
        host : "127.0.0.1",
        port: "5506",
        user: "korpcRoot",
        password:"Korpcdream21!",
        database : "voluntedInfo",
        connectionLimit : 100
    }
};


module.exports = config;