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
                            <th><div class="head"><span>TMax</span></div></th>
                            <th><div class="head"><span>TMed</span></div></th>
                            <th><div class="head"><span>TMin</span></div></th>
                            <th><div class="head"><span>Kc</span></div></th>
                            <th><div class="head"><span>Area do vaso</span></div></th>
                            <th><div class="head"><span>Eficiência</span></div></th>
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
                    <td><span>${data.tmax}</span></td>
                    <td><span>${data.tmed}</span></td>
                    <td><span>${data.tmin}</span></td>
                    <td><span>${data.kc}</span></td>
                    <td><span>${data.area}</span></td>
                    <td><span>${data.eficiencia}</span></td>
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
// console.log(html)
        return html
    }

    return report;    
}