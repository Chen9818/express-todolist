var express = require('express');
const handleError = require('../handle/handleError');
const handleSuccess = require('../handle/handleSuccess');
var router = express.Router();
const Post = require('../model/postModel')
const User = require('../model/usersModel')
const appError = require("../service/appError");
const handleErrorAsync = require("../service/handleErrorAsync");

/* GET home page. */
router.get('/',async function(req, res, next) {
	const timeSort = req.query.timeSort == 'asc' ? 'createdAt' : '-createdAt'
	const q = req.query.q !== undefined ? { "content": new RegExp(req.query.q) } : {}
    const post = await Post.find(q).populate({
        path:"user",  //找到user collection
        select:"name photo"  //顯示name和photo
    })
	.sort(timeSort)
    handleSuccess(res,post)
});

router.post('/',handleErrorAsync(async function(req, res, next) {
    if(req.body.content == undefined){
        return next(appError(400,"你沒有填寫 content 資料",next))
    }else{
        const data = req.body
        const post = await Post.create({
            user: data.user,
            tags:data.tags,
            type: data.type,
            content:data.content
        })
        // console.log(req.body)
        handleSuccess(res,post)
    }
}));

router.delete('/posts',async function(req, res, next) {
    const post = await Post.deleteMany({})
    handleSuccess(res, post)
});

router.delete('/post/:id',async function(req, res, next) {
    // console.log(req.params.id);
    const id = req.params.id
    if(id == undefined){
        return next(appError(400,"無此使用者ID",next))
    }else{
        const post = await Post.findByIdAndDelete(id)
        if (post !== null){
            handleSuccess(res,post)
        } else {
            return next(appError(400,"無此使用者ID",next))     
        }
    }
});

router.patch('/:id',async function(req, res, next) {
    const id = req.params.id
    if(id == undefined){
        return next(appError(400,"無此使用者ID",next))
    }else{
        const body = req.body.content
        const post = await Post.findByIdAndUpdate(id,{
            content:body
        })
        if (body !== undefined && post !== null){
            handleSuccess(res,post)
        } else {
            return next(appError(400,"無此使用者ID",next))
        }
    }
    // try{
    //     const id = req.params.id
    //     const body = req.body.content
    //     const post = await Post.findByIdAndUpdate(id,{
    //         content:body
    //     })
    //     if (body !== undefined && post !== null){
    //         handleSuccess(res,post)
    //     } else {
    //         handleError(res,err)
    //     }
    // }catch(err){
    //     handleError(res,err)
    // }
});

module.exports = router;