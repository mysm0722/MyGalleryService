var express = require('express');
var app = express();

// File 처리 관련 라이브러리
var fs = require('fs');
var fs = require('fs-extra')

var client_id = 'TjPxrzlW6S5QKX940hev';
var client_secret = 'KdSht6CYrC';

var filesInDir = [];

app.get('/faceCognito/:imageFile', function (req, res) {

    var request = require('request');
    //var api_url = 'https://openapi.naver.com/v1/vision/celebrity'; // 유명인 인식
    var api_url = 'https://openapi.naver.com/v1/vision/face'; // 얼굴 감지

    // Clova CFR API Information
    var _formData = {
        image:'image',
        // Source File Name
        image: fs.createReadStream('/Users/naver/mytemp/public/images/'+req.params.imageFile)
    };

    // Clova CFR API Options
    var options = {
        url: api_url,
        formData: _formData,
        headers: {'X-Naver-Client-Id':client_id, 'X-Naver-Client-Secret': client_secret}
    };

    request.post(options, function (error, response, body) {   
   
        var tranlatedJSON = JSON.parse(body);

        console.log('');
        console.log('::: Processing FileName : ' + req.params.imageFile);
        console.log('::: Face Cognition Count: ' + tranlatedJSON.info.faceCount);

        // 얼굴 인식 여부에 따라 사진을 분류
        if(tranlatedJSON.info.faceCount > 0) {
            console.log('::: 얼굴 포함 사진입니다.');
            console.log('::: 앨범 디렉터리로 이동합니다.');

            fs.move('/Users/naver/mytemp/public/images/'+req.params.imageFile, '/Users/naver/mytemp/public/face_images/'+req.params.imageFile, function (err) {
                if (err) return console.error(err)
                console.log("success!")
            })
        } else {
            console.log('::: 얼굴 미 포함 사진입니다.');
            console.log('::: 앨범 제외 디렉터리로 이동합니다.');
            
            fs.move('/Users/naver/mytemp/public/images/'+req.params.imageFile, '/Users/naver/mytemp/public/exface_images/'+req.params.imageFile, function (err) {
                if (err) return console.error(err)
                console.log("success!")
            })
        }

        console.log('');

    });

    res.end();
        
 });

 app.get('/MyGallery', function (req, res) {

    console.log('::: MyGallery is called');

    var files = fs.readdirSync('/Users/naver/mytemp/public/face_images/');
    var filesInDir = files;

    console.log('::: filesInDir.length : ' +filesInDir.length);

    var fileName;
    var tempDiv = '';

    for ( var i = 0; i < filesInDir.length; i++) {
        fileName = filesInDir[i];
        tempDiv += ' <div class="item"><img src="./face_images/'+fileName+'" width="110" height="110"/></div>'
        
    }

    console.log(tempDiv);

    var htmlStr =   '<!doctype html>' + 
                    '<html lang="ko">' +
                    '<head>' +
                        '<meta charset="utf-8">' +
                        '<title>My Grid Gallery</title>' +
                        '<style>' +
                        '.item {' +
                            'width: 100px;' +
                            'height: 100px;' +
                            'float: left;' +
                            'margin: 5px;' +
                            'background-color: #2195c9;' +
                        '}' +
                        '</style>' +
                        '<script src="https://unpkg.com/masonry-layout@4/dist/masonry.pkgd.min.js"></script>' +
                    '</head>' +
                    '<body>' +
                    '<div id="container">' +
                        tempDiv +
                        '</div>' +
                        '<script>' +
                        'var container = document.querySelector( \'#container\' );' +
                        'var msnry = new Masonry( container, {' +
                            '// options' +
                            'columnWidth: 110,' +
                            'itemSelector: \'.item\',' +
                        '} );' +
                        '</script>' +
                    '</body>' +
                    '</html>';

    res.write(htmlStr);
    res.end();
 });

 app.listen(3000, function () {
   console.log('::: My Image Gallery App listening on port 3000!');
   app.use(express.static('public'));
 });