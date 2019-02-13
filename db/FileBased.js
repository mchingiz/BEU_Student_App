const fs = require('fs');
const dbFilePath = "./db/";

// all file dbs -> "requests"

module.exports = {
    append: function(dbName,id){
        fs.appendFile(dbFilePath+dbName+".txt",id+",",function(err){
            if(!err){
                console.log("append olundu");
            }else{
                console.error("Fayla yazmadi: "+err);
            }
        })
    },
    appendIfNotPresent: function(dbName,id){
        console.log("called");
        const thisModule = this;

        fs.readFile(dbFilePath+dbName+".txt", 'utf8', function(err, ids) {
            if(!err){
                var idArray = ids.split(",")

                if(idArray.indexOf(id) < 0){
                    thisModule.append(dbName,id);
                }
            }else{
                console.error("Fayla yazmadi: "+err);
            }
        });
    },
}