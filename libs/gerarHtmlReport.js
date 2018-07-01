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
                        <img src="./imagens/new.png" width="" style="height: 80px;">
                    </div>
                    <table>
                        <thead>`
                            if(config.type == "pdf"){
                                html +=`
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
                                `;
                            }else{
                                html +=`
                                    <th class="head">Data</th>
                                    <th class="head">TMax</th>
                                    <th class="head">TMed</th>
                                    <th class="head">TMin</th>
                                    <th class="head">Kc</th>
                                    <th class="head">Area do vaso</th>
                                    <th class="head">Eficiência</th>
                                    <th class="head">Etc</th>
                                    <th class="head">Eto</th>
                                    <th class="head">Resultado(ml)</th>
                                    <th class="head">Resultado(30% ml)</th>
                                `;
                            }
                        `</thead>
                        <tbody>
                    `;

        for(let i = 0; i < totalFolhas; i++) {
            data = config.problemas[i];
            
            if(config.type == "pdf"){
                html += `
                    <tr>
                        <td><span>${data.data_inclusao}</span></td>
                        <td><span>${data.tmax == null ? "" : data.tmax}</span></td>
                        <td><span>${data.tmed == null ? "" : data.tmed}</span></td>
                        <td><span>${data.tmin == null ? "" : data.tmin}</span></td>
                        <td><span>${data.kc == null ? "" : data.kc}</span></td>
                        <td><span>${data.area == null ? "" : data.area}</span></td>
                        <td><span>${data.eficiencia == null ? "" : data.eficiencia}</span></td>
                        <td><span>${data.etc}</span></td>
                        <td><span>${data.eto}</span></td>
                        <td><span>${data.resultado}</span></td>
                        <td><span>${data.trinta}</span></td>
                    </tr>
                `;
            }else{
                html += `
                    <tr>
                        <td>${data.data_inclusao}</td>
                        <td>${data.tmax == null ? "" : data.tmax}</td>
                        <td>${data.tmed == null ? "" : data.tmed}</td>
                        <td>${data.tmin == null ? "" : data.tmin}</td>
                        <td>${data.kc == null ? "" : data.kc}</td>
                        <td>${data.area == null ? "" : data.area}</td>
                        <td>${data.eficiencia == null ? "" : data.eficiencia}</td>
                        <td>${data.etc}</td>
                        <td>${data.eto}</td>
                        <td>${data.resultado}</td>
                        <td>${data.trinta}</td>
                    </tr>
                `;
            }
        }
        html += `
                    </tbody>
                </table>
            </body>
        </html>
        `;

        return html
    }

    return report;    
}