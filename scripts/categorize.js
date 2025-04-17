// Usa Gemini API para classificar as atividades em quatro categorias:
// eixo temático, perfil do organizador, formato da atividade e objetivo da atividade

import 'dotenv/config';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { GoogleGenAI } from '@google/genai';

const __dirname = path.dirname(fileURLToPath(import.meta.url)) + '/';

import programacao from '../data/cleaned.json' with { type: 'json' };
import categorized from '../data/categorized.json' with { type: 'json' };
const promptTemplate = await readTxtFileAsString('../promptTemplate.md');

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const totalDeAtividades = programacao.reduce(
    (acc, edicao) => acc + edicao.programacao.length,
    0,
);

for (const edicao of programacao) {
    for (const atividade of edicao.programacao) {
        const uid = generateID(JSON.stringify(atividade));
        if (categorized.some((item) => item.uid === uid)) {
            continue;
        }

        console.log(
            `${getCurrentTime()} - ${categorized.length + 1} de ${totalDeAtividades}`,
        );

        const atividadeShortened = omitIrrelevantProperties(atividade);
        const prompt = `${promptTemplate}${JSON.stringify(atividadeShortened)}`;
        // console.log(atividadeShortened);

        const response = await AI(prompt);
        const responseJSON = JSON.parse(
            removeMarkdownCodeBlocks(response.text),
        );

        const atividadeFull = {
            uid,
            edicao: edicao.nome,
            ...atividade,
            ...responseJSON,
        };
        // console.log(atividadeFull);

        categorized.push(atividadeFull);
        await fs.writeFile(
            path.join(__dirname, '..', 'data', 'categorized.json'),
            JSON.stringify(categorized, null, 2),
        );
    }
}

async function readTxtFileAsString(filePath) {
    try {
        const fileContent = await fs.readFile(
            path.join(__dirname, filePath),
            'utf8',
            'utf8',
        ); // Use await fs.readFile
        return fileContent;
    } catch (error) {
        console.error('Error reading file:', error); // Removed 'synchronously' from log
        return null;
    }
}

function omitIrrelevantProperties(atividade) {
    const { open, start_time, end_time, speakers, ...relevantProperties } =
        atividade;
    relevantProperties.organizers = speakers;
    return relevantProperties;
}

function removeMarkdownCodeBlocks(text) {
    return text
        .replace(/^\s*```(?:json\s*)?\n*/, '')
        .replace(/\s*```\s*$/, '')
        .trim();
}

async function AI(prompt) {
    const response = await ai.models.generateContent({
        // model: "gemini-2.5-flash-preview-04-17",
        model: 'gemini-2.0-flash',
        model: 'gemini-2.0-flash-lite',
        contents: prompt,
        // config: {
        //     includeThoughts: {
        //         includeThoughts: false,
        //     },
        // }
    });

    return response;
}

function generateID(inputString) {
    // Ensure the input is a string
    if (typeof inputString !== 'string') {
        // Handle non-string inputs as needed, e.g., throw an error or stringify
        inputString = String(inputString);
    }

    // Create a hash object using the SHA-256 algorithm
    const hash = createHash('sha256');

    // Update the hash with the input string (specify encoding, utf8 is common)
    hash.update(inputString, 'utf8');

    // Get the hexadecimal representation of the hash digest
    const reproducibleId = hash.digest('hex');

    return reproducibleId;
}

function getCurrentTime() {
    const now = new Date();

    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    // Format time components to ensure two digits (e.g., 09 instead of 9)
    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');

    const currentTime = `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;

    return currentTime;
}
