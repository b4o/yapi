//mysqlConfig.js
const mysql = require('mysql2');

let pools = {}

let sqlexec = {
    query: function (sql, dbname, currDomain) {
        if (!pools.hasOwnProperty(dbname)) { //是否存在连接池
            pools[dbname] = mysql.createPool(getDBConfig(currDomain, dbname))
        }
        return new Promise((resolve, reject) => {
            pools[dbname].getConnection((err, connection) => { //初始化连接池
                if (err) {
                    console.log(err, '数据库连接失败' + dbname);
                } else {
                    connection.query(sql, (err, results) => { //去数据库查询数据
                        connection.release() //释放连接资源
                        if (err) {
                            reject(err);
                        } else {
                            resolve(results);
                        }
                    })
                }
            })
        })
    }
}

function getDBConfig(currDomain, dbname) {
    let db = {
        port: '',
        host: '',
        user: '',
        password: '',
        database: dbname
    }
    currDomain.global.forEach(item => {
        if (item.name == dbname + '_port') {
            db.port = item.value
        } else if (item.name == dbname + '_host') {
            db.host = item.value
        } else if (item.name == dbname + '_user') {
            db.user = item.value
        } else if (item.name == dbname + '_password') {
            db.password = item.value
        }
    });
    return db;
}


module.exports = sqlexec;