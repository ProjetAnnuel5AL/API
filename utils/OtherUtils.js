var GenerateCode = function(nbCar) {
    var ListeCar = new Array("a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","0","1","2","3","4","5","6","7","8","9");
    var r = "";
    for (var i = 0; i<nbCar ; i++){
        r += ListeCar[Math.floor(Math.random()*ListeCar.length)];
    }
    return r;
};

var ResizeImg = function(filePath, idImg, ext, size, sizeStr){
    var Jimp = require("jimp");

    // open a file called "lenna.png"
    Jimp.read(filePath + idImg+"."+ext).then(function (image) {
      var w = image.bitmap.width
      var h = image.bitmap.height
     
      if(w>h){
        return image.resize(size, Jimp.AUTO)                   
            .write(filePath + "img_resize/" + idImg + sizeStr + "." + ext); 
      }else if(w<h){
        return image.resize(Jimp.AUTO, size)                        
            .write(filePath + "img_resize/" + idImg + sizeStr + "." + ext); 
      }else{
        return image.resize(size, size)                                
          .write(filePath + "img_resize/"+ idImg + sizeStr + "." + ext); 
      }
    }).catch(function (err) {
        console.error(err);
    });
}


module.exports={
    "GenerateCode" : GenerateCode,
    "ResizeImg": ResizeImg,
};