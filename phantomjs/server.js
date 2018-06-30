"use strict";
var service,
//config of print
confPrint = require("./app.js").confPrint,
system = require('system'),
//config of webserver
confServer = require("./serverConfig.js").confServer,
server = require('webserver').create(),
configHomologacao = loadConfig("./serverConfigHomologacao.js"),
configDev = loadConfig("./serverConfigDev.js");

var rodape = null,
page = require('webpage').create(),
fs = require('fs');


// confServer = configHomologacao? configHomologacao : confServer;
// confServer = configDev? configDev : confServer;

function loadConfig(file){
    try{
        var config = require(file).confPrint;
        return config;
    } catch(e){
        console.log(e);
        return false;
    }
}

//Criação do listen do servidor web
service = server.listen(confServer.port, { keepAlive: false }, function (request, response) {
    console.log('Request at ' + new Date());


    // Variaveis Para layout
    rodape = request.post.rodape;

    var urlToLoad = typeof(request.post.url) != "undefined" ? confServer.urlToIIS + request.post.url : undefined;

    //Gerando o pdf a partir uma string html e não de uma url relativa
    if(typeof(request.post.url)=="undefined"){
        urlToLoad = '../' + request.post.name + "0800fc577294c34e0b28ad2839435945_temp.html";
        fs.write('../' + request.post.name + '0800fc577294c34e0b28ad2839435945_temp.html', request.post.html, 'w+');
    }
    fs.write('./' + request.post.name + '0800fc577294c34e0b28ad2839435945_temp.txt', request.post.tipoPDF, 'w+');
    
    response.statusCode = confServer.responseStatusCode;
    response.headers = confServer.responseHeaders;
    
    page.zoomFactor = 0.68;
    page.dpi = 300;
    page.paperSize = confPrint.default.paperSize;
    page.viewportSize = confPrint.default.viewportSize;
    
    if (request.post.orientacao) 
    page.viewportSize.width = 1030;
    
    if(typeof(confPrint[request.post.tipoPDF])!=="undefined"){
        if(typeof(confPrint[request.post.tipoPDF].paperSize)!=="undefined"){
            page.paperSize = confPrint[request.post.tipoPDF].paperSize;
        } 
        
        if(typeof(confPrint[request.post.tipoPDF].dpi)!=="undefined"){
            page.dpi = confPrint[request.post.tipoPDF].dpi;
        }
    }
    
    page.open(urlToLoad, function (status) {
        if (status !== 'success') {
            console.log('Unable to load the address!');
            response.write('{"ret": false}');
        } else {
            if (page.evaluate(function(){return typeof PhantomJSPrinting == "object";})) {
                paperSize = page.paperSize;
                paperSize.header.height = page.evaluate(function() {
                    return PhantomJSPrinting.header.height;
                });
                paperSize.header.contents = phantom.callback(function(pageNum, numPages) {
                    return page.evaluate(function(pageNum, numPages){
                        return PhantomJSPrinting.header.contents(pageNum, numPages);
                    }, pageNum, numPages);
                });
                paperSize.footer.height = page.evaluate(function() {
                    return PhantomJSPrinting.footer.height;
                });
                paperSize.footer.contents = phantom.callback(function(pageNum, numPages) {
                    return page.evaluate(function(pageNum, numPages){
                        return PhantomJSPrinting.footer.contents(pageNum, numPages);
                    }, pageNum, numPages);
                });
                page.paperSize = paperSize;
            }
            page.render("../midias/" + request.post.name + '.pdf');
            response.write('{"ret": true }');
        }

        if(typeof(request.post.url)=="undefined"){
            fs.remove('../' + request.post.name + '0800fc577294c34e0b28ad2839435945_temp.html');
        }
        
        fs.remove('./' + request.post.name + '0800fc577294c34e0b28ad2839435945_temp.txt');
        request.post = null;
        response.close();

    })
})

if(service){
   console.log('Web server running on port ' + confServer.port);
} else {
   console.log('Error: Could not create web server listening on port ' + confServer.port);
   phantom.exit();
}