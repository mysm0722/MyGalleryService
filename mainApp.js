// Filesystem Library
var fs = require('fs');	 

// Node JS 내부에서 OS Command 실행 
var exec = require('child_process').exec,
    child;

// Album이 존재하는 디렉터리를 읽어옴
var files = fs.readdirSync('/Users/naver/mytemp/public/images/');
var filesInDir = files;

var fileName;

for ( var i = 0; i < filesInDir.length; i++) {
    fileName = filesInDir[i];
    console.log('======================================');
    console.log('::: Source FileName : ' + fileName);
    console.log('======================================');

    // Clova CFR URL 실행
    child = exec("curl http://localhost:3000/faceCognito/"+fileName, function (error, stdout, stderr) {            
        if (error !== null) {
            console.log('exec error: ' + error);
        }
    });

    child = exec("sleep 3", function (error, stdout, stderr) {
        if (error !== null) {
            console.log('exec error: ' + error);
        }
    });
}