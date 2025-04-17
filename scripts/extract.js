// Faz o download dos arquivos JSON contendo a programação das últimas 10 edições da Campus Party.

import https from 'node:https';
import fs from 'node:fs';
import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url)) + '/';

import metadata from '../data/metadata.json' with { type: 'json' };

for (const [index, edicao] of metadata.entries()) {
    // os arquivos estão enumerados em ordem decrescente, da edição mais recente para a mais antiga
    const filename = `${index} - ${edicao.nome}.json`;
    const filenameBancadas = `${index} - ${edicao.nome}-bancadas.json`;

    download(edicao.programacaoLink, filename);

    // as 3 últimas edições listam a programação principal e as atividades das bancadas separadamente
    if (edicao.programacaoBancadasLink !== null)
        download(edicao.programacaoBancadasLink, filenameBancadas);
}

function download(url, filename) {
    console.log(`Downloading "${filename}"`);

    https.get(url, (res) => {
        if (res.statusCode !== 200) {
            console.error(
                `Failed to get resource: Status Code: ${res.statusCode}`,
            );
            return;
        }

        const fileStream = fs.createWriteStream(
            path.join(__dirname, '..', 'data', 'extracted', filename),
        );
        res.pipe(fileStream);

        fileStream.on('finish', () => {
            fileStream.close();
            console.log(`Downloaded "${filename}"`);
        });
    });
}
