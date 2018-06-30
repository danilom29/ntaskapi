var confPrint = { 
    default: {
    	viewportSize: { 
	        width: 620, 
	        height: 800 
	    },
	    zoomFactor: 10,
        paperSize: {
            format: 'A4',
            margin: {
                top: '1cm',
                left: '1cm',
                right: '1cm',
                bottom: '2cm'
            },
        }
    },
    report: {
        zoomFactor: 0.25,
        paperSize: {
            format: 'A4',
            orientation: 'landscape',
            margin: {
                top: '1cm',
                left: '1cm',
                right: '1cm',
                bottom: '2cm'
            },
            footer: {
               height: "0.2cm",
               contents:  phantom.callback(function(pageNum, numPages) {
                   return '<span style="position: absolute;right: 0;bottom: 20px;font-family: arial; font-size:10px">' + pageNum +'/'+ numPages + '</span>' ;
               })
            },
            header: {
                height: "2cm",
                contents:  phantom.callback(function(pageNum, numPages) {
                    return "<div style='display:flex;justify-content: center;'><h1 style='width: 90%;text-align:center;'>Relatório</h1><img src='/imagens/new.png' width=' style='height: 80px;'></div>";
                })
            }
        }
    }
};
exports.confPrint = confPrint;