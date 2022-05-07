var express = require('express');
const handleError = require('../handle/handleError');
const handleSuccess = require('../handle/handleSuccess');
var router = express.Router();
const Post = require('../model/postModel')
const User = require('../model/usersModel')

/* GET home page. */
router.get('/',async function(req, res, next) {
	const timeSort = req.query.timeSort == 'asc' ? 'createdAt' : '-createdAt'
	const q = req.query.q !== undefined ? { "content": new RegExp(req.query.q) } : {}
    const post = await Post.find(q).populate({
        path:"user",  //找到user collection
        select:"name photo"  //顯示name和photo
    })
    handleSuccess(res,post)
});

router.post('/',async function(req, res, next) {
    try{
        const data = req.body
        const post = await Post.create({
            user: data.user,
            tags:data.tags,
            type: data.type,
            content:data.content
        })
        // console.log(req.body)
        handleSuccess(res,post)
    }catch(err){
        handleError(res,err)
    }
});

router.delete('/',async function(req, res, next) {
    const post = await Post.deleteMany({})
    handleSuccess(res, post)
});

router.delete('/:id',async function(req, res, next) {
    console.log(req.params.id);
    const id = req.params.id
    try{
        const post = await Post.findByIdAndDelete(id)
        handleSuccess(res, post)
    }catch(err){
        handleError(res,err)
    }
});

router.patch('/:id',async function(req, res, next) {
    try{
        const id = req.params.id
        const body = req.body.content
        const post = await Post.findByIdAndUpdate(id,{
            content:body
        })
        if (body !== undefined && post !== null){
            handleSuccess(res,post)
        } else {
            handleError(res,err)
        }
    }catch(err){
        handleError(res,err)
    }
});

module.exports = router;