const seQuelize = require('sequelize')

const db = new seQuelize('practice','root','mypass', {
    host :'localhost',
    dialect : 'mysql',
    pool: {
        min:0,
        max:5
    }
})
const user = db.define('users',{
    id:{
        type : seQuelize.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    Name : {
        type : seQuelize.STRING
    },
    email : {
        type : seQuelize.STRING
    },
    password :{
        type : seQuelize.STRING
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
// .then((result) =>{
//     return user.findByPk(1);
// })
// .then(usering=>{
//     if(!usering)
//     return user.create({Name : 'shubham', email : 'shubhamakp@gmail.com'});
//     return usering;
// })
.then((usi)=>console.log("database has been synced"))
.catch((err)=> console.log(err))

exports = module.exports ={
    playlist,user
}