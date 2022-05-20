// var express = require('express');
// const handleError = require('../handle/handleError');
// const handleSuccess = require('../handle/handleSuccess');
// var router = express.Router();
// const Post = require('../model/postModel')
// const User = require('../model/usersModel')
// const appError = require("../service/appError");
// const handleErrorAsync = require("../service/handleErrorAsync");

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;


/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

// router.get('/',async function(req, res, next) {
// 	const timeSort = req.query.timeSort == 'asc' ? 'createdAt' : '-createdAt'
// 	const q = req.query.q !== undefined ? { "content": new RegExp(req.query.q) } : {}
//     const post = await Post.find(q).populate({
//         path:"user",  //找到user collection
//         select:"name photo"  //顯示name和photo
//     })
// 	.sort(timeSort)
//     handleSuccess(res,post)
// });


module.exports = router;
