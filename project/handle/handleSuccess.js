function handleSuccess(res, data){
    // res.writeHead(200, headers)
    // res.write(JSON.stringify({
    //     "status": "success",
    //     "data": data
    // }))
    res.status(200).json({
        "status":"success",
        "data":data
    })
}
module.exports = handleSuccess