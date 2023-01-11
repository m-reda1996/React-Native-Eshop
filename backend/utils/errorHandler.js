function errorHandler(err,req,res,next){
    if(err.name ==="UnauthorizedError"){
        res.status(500).json({message : 'the user is not  authorized'})
      }
      if(err.name ==="ValidationError"){
        res.status(500).json({message : 'the user is not  Validation'})
      }
     return res.status(401).json({message :err})
}

module.exports = errorHandler