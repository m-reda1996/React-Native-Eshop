// constexpressJwt =  require('express-jwt')

// function authJwt(){
//     const secret = process.env.SECRET
//     return expressJwt({
//         secret,
//         algorithms : ['HS256']
//     }).unless({
//                 path: [
//                     {url:"/api/v1/users/login" , methods : ['POST','OPTIONS']},
//                     '/api/v1/users/login',
//                     '/api/v1/users'
//                 ]
//             });
// }



// function jwtr() {
//     const secret = process.env.SECRET
//     return expressJwt({ secret, algorithms: ['HS256'] }).unless({
//         path: [
//                     // {url:"/api/v1/users/login" , methods : ['POST','OPTIONS']},
//                     '/api/v1/users/login',
//                     '/api/v1/users'
//         ]
//     });
// }
// module.exports = jwtr;
// module.exports = authJwt

// { secret, algorithms: ["HS256"] }