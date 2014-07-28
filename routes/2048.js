fs=require('fs');
exports.temp2048 = function(req, res){
    fs.createReadStream('./views/2048.html').pipe(res);
};
