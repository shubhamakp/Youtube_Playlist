const seQuelize = require('sequelize')

const db = new seQuelize('practice','root','mypass', {
    host :'localhost',
    dialect : 'mysql',
    pool: {
        min:0,
        max:5
    }
})

const playlist  = db.define('playlist',{
    id:{
        type: seQuelize.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    vidid :{
        type : seQuelize.STRING
    },
    desc : {
        type:seQuelize.STRING
    },
    title:{
        type : seQuelize.STRING
    } ,
    imageurl :{
        type : seQuelize.STRING
    }
    
})

db.sync()
.then(() =>console.log("database has been synched"))
.catch((err)=> console.log("error creating database"))

module.exports = playlist;