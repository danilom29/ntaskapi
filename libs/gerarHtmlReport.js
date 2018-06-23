module.exports = () => {
    let report = {};

    report.preview = (config) => { 
        let html = '';        
        let totalFolhas = 0;
        if (config.problemas) totalFolhas = config.problemas.length;
        
        html += `
            <html>
                <head>
                    <meta charset="UTF-8">
                    <link rel="stylesheet" type="text/css" href="css/report.css">
                </head>            
                <body>
                    <div style="display:none;justify-content: center;">
                        <h1 style="width: 90%;text-align:center;">Relatório</h1>
                        <img src="imagens/new.png" width="" style="height: 80px;">
                    </div>
                    <table>
                        <thead>
                            <th><div class="head"><span>Data</span></div></th>
                            <th><div class="head"><span>Etc</span></div></th>
                            <th><div class="head"><span>Eto</span></div></th>
                            <th><div class="head"><span>Resultado(ml)</span></div></th>
                            <th><div class="head"><span>Resultado(30% ml)</span></div></th>
                        </thead>
                        <tbody>
        `;
        for(let i = 0; i < totalFolhas; i++) {
            data = config.problemas[i];
            

            html += `
                <tr>
                    <td><span>${data.data_inclusao}</span></td>
                    <td><span>${data.etc}</span></td>
                    <td><span>${data.eto}</span></td>
                    <td><span>${data.resultado}</span></td>
                    <td><span>${data.trinta}</span></td>
                </tr>
            `
        }
        html += `
                    </tbody>
                </table>
            </body>
        </html>
        `

        return html
    }

    return report;    
}