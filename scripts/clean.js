// Consolida os arquivos JSON baixados em um único arquivo e remove dados irrelevantes.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { stripHtml } from 'string-strip-html';

import metadata from '../data/metadata.json' with { type: 'json' };

const __dirname = path.dirname(fileURLToPath(import.meta.url)) + '/';

const extractedDir = path.join(__dirname, '../data/extracted');
const jsonFiles = fs
    .readdirSync(extractedDir)
    .filter((file) => file.endsWith('.json'));

// programação das últimas 10 edições da Campus Party, separadas por edições
const campusParty = [];

for (const filename of jsonFiles) {
    console.log(`Processando: "${filename}"`);

    const nomeDaEdicao = /(?<=\d - ).*(?=\.json)/
        .exec(filename)[0]
        .replace('-bancadas', '');

    const filePath = path.join(extractedDir, filename);
    const fileData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    const programacaoDaEdicao = fileData.result.schedule
        .map((s) => s.activity_list)
        .flat()
        .map((activity) => ({
            name: activity.name,
            auditorium: activity.auditorium_name,
            description: stripHtml(activity.description.trim()).result,
            open: activity.open,
            start_time: activity.start_time,
            end_time: activity.end_time,
            speakers: activity.speakers.map((speaker) => ({
                name: speaker.name,
                profession: speaker.profession,
                description: stripHtml((speaker.description ?? '').trim())
                    .result,
            })),
        }));

    if (campusParty.find((cp) => cp.nome === nomeDaEdicao) !== undefined) {
        // as 3 últimas edições listam a programação principal e as atividades das bancadas separadamente
        // por isso, a edição talvez já exista no array; nesse caso, concatene as programações
        campusParty
            .find((cp) => cp.nome === nomeDaEdicao)
            .programacao.push(...programacaoDaEdicao);
    } else {
        campusParty.push({
            ...metadata.find((edicao) => edicao.nome === nomeDaEdicao),
            programacao: programacaoDaEdicao,
        });
    }
}

// console.log(campusParty);
// console.dir(campusParty, { depth: null });
for (const edicao of campusParty) {
    console.log(`${edicao.nome}: ${edicao.programacao.length}`);
}

saveJson(path.join(__dirname, '../data/cleaned.json'), campusParty);

function saveJson(filePath, data) {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
        console.log(`Data saved to ${filePath}`);
    } catch (error) {
        console.error('Error saving JSON:', error);
    }
}
