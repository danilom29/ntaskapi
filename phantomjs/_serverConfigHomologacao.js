//Arquivo de configuração das impressões do PhantomJs
var confServer = {
    port: 1001,
    urlToIIS: 'http://ntm2.al.senai.br/sap2018/',
    responseHeaders:{
        'Cache': 'no-cache',
        'Content-Type': 'application/json',
        'Connection': 'Keep-Alive',
        'Keep-Alive': 'timeout=5, max=100',
        // Tamanho da string de response do request tem ser exatamente igual a 14
        'Content-Length': 14, 
        'Access-Control-Allow-Origin': '*'
    },
    responseStatusCode: 200
};
exports.confServer = confServer;