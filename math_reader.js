var http = require('http');
var fs = require('fs');
var port=100
var server = http.createServer(function(요청,응답){
    var _url = 요청.url;
    var _method = 요청.method;
    console.log(decodeURIComponent(_url),_method,요청.connection.remoteAddress);
    if(_url=='/'){
        fs.readFile('index.html','utf-8',(E,파일)=>{
            var 확장자 = 'text/html; charset=utf-8'
            응답.writeHead(200, {'Content-Type':확장자} );
            응답.end(파일);
        })       
    }
    else if(_url=='/edit'){
        fs.readFile('edit.html','utf-8',(E,파일)=>{
            var 확장자 = 'text/html; charset=utf-8'
            응답.writeHead(200, {'Content-Type':확장자} );
            응답.end(파일);
        })       
    }
    else if (_url=='/html'){
        fs.readdir('./files',(E,파일목록)=>{
            var 데이터='[';
            for (var i=0; i<파일목록.length; i++){
                 데이터+=`"${파일목록[i]}",`;
            }
            데이터+=']'
            var 확장자 = 'text/html; charset=utf-8';
            응답.writeHead(200, {'Content-Type':확장자,'Accept-Ranges': 'bytes', 'Content-Length':  Buffer.byteLength(데이터, 'utf8').toString()} );
            응답.end(데이터);        
        })
    }
    else if (_url.includes('files/') && _url.indexOf('files/')==1){
        fs.readFile("files/"+decodeURIComponent(_url.substr("files/".length)),'utf-8',(E,파일)=>{
            //console.log(E,파일);
            var 확장자 = 'text/html; charset=utf-8'
            응답.writeHead(200, {'Content-Type':확장자} );
            응답.end(파일);
        })
    }
    else if (_url.includes('js/') && _url.indexOf('js/')==1){
        fs.readFile("js/"+decodeURIComponent(_url.substr("js/".length)),(E,파일)=>{ //이부분 'utf-8'로 읽었다가 설정 안 되는 오류 발생했었음
            console.log(E);
            var 확장자 = 'text/html; charset=utf-8'
            if (_url.includes('woff')) 확장자='application/font-woff'
            //console.log(파일.length)
            응답.writeHead(200, {'Content-Type':확장자, 'Content-Length': 파일.length.toString()} );
            응답.end(파일);
        })
    }
    else if(_url=='/save' && _method=='POST'){
        
        
        var post_data = '';
        요청.on('data', (data) => {
            post_data += data;
        });
        요청.on('end', () => {

            var Filename = post_data.substr('name='.length, post_data.indexOf('text=')-7)
            var Filedata = post_data.substr(post_data.indexOf('text=')+5)
            
            console.log('이름:',Filename);//,'데이터:',Filedata

            console.log('32')
            fs.writeFile('./files/'+Filename+'.txt', Filedata, (E) => {
                console.log('파일', E);
                var 확장자 = 'text/html; charset=utf-8'
                응답.writeHead(200, {'Content-Type': 확장자});
                응답.end("<script>alert('성공')\nlocation='/'</script>");
            });
        })
        
    }
    else{
        console.log("404 방금 수상했음");
        var 확장자='text/html; charset=utf-8';
        응답.writeHead(404, {'Content-Type':확장자} );
        응답.end("404");
    }
    
})
                               
server.listen(port, function(){
    console.log(`Server is running at localhost:${port}`);
});