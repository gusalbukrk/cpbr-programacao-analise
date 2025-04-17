import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const activitiesFilePath = path.join(
    __dirname,
    '..',
    'data',
    'categorized.json',
);

const eixoLabels = [
    'Inteligência Artificial',
    'Cultura Maker',
    'Tecnologias Sustentáveis',
    'Astronomia e Exploração Espacial',
    'Games',
    'Healthtech',
    'Foodtech',
    'Cibersegurança',
    'Desenvolvimento de Software e Cloud Computing',
    'Ciência de Dados e Big Data',
    'Negócios, Empreendedorismo, Gestão e Marketing',
    'Aspectos Éticos e Legais da Tecnologia',
    'Inclusão e Diversidade',
    'Arte, Design e Multimídia',
    'Entretenimento e Cultura Geek',
    'Desenvolvimento Profissional',
    'Tecnologia e Educação',
    'Web3',
    'Institutional',
];

const formatoLabels = [
    'Palestra',
    'Workshop',
    'Painel de Discussão',
    'Competição',
    'Mentoria',
    'Exposição',
    'Meetup',
];

const organizadorLabels = [
    'Empresa',
    'Startup',
    'Instituição de Ensino',
    'Comunidade ou Grupo de Interesse',
    'Influenciador',
    'Órgão Governamental',
    'Pesquisador ou Especialista',
];

const objetivoLabels = [
    'Educar sobre um tema',
    'Ensinar habilidades práticas',
    'Fomentar networking',
    'Apresentar projeto, produto ou startup',
    'Ativação de marca',
    'Entreter',
];

const initializeCounters = (labels) => {
    const counters = {};
    labels.forEach((label) => {
        counters[label] = 0;
    });
    counters['Outro/Não especificado'] = 0;
    return counters;
};

let eixoCounts = initializeCounters(eixoLabels);
let formatoCounts = initializeCounters(formatoLabels);
let organizadorCounts = initializeCounters(organizadorLabels);
let objetivoCounts = initializeCounters(objetivoLabels);
let totalActivities = 0;

const analyzeActivities = async () => {
    try {
        const data = await fs.promises.readFile(activitiesFilePath, 'utf8');
        const activities = JSON.parse(data);

        totalActivities = activities.length;

        activities.forEach((activity) => {
            const eixo = activity.eixo || 'Outro/Não especificado';
            if (eixoLabels.includes(eixo)) {
                eixoCounts[eixo]++;
            } else {
                eixoCounts['Outro/Não especificado']++;
            }

            const formato = activity.formato || 'Outro/Não especificado';
            if (formatoLabels.includes(formato)) {
                formatoCounts[formato]++;
            } else {
                formatoCounts['Outro/Não especificado']++;
            }

            const organizador =
                activity.organizador || 'Outro/Não especificado';
            if (organizadorLabels.includes(organizador)) {
                organizadorCounts[organizador]++;
            } else {
                organizadorCounts['Outro/Não especificado']++;
            }

            const objetivo = activity.objetivo || 'Outro/Não especificado';
            if (objetivoLabels.includes(objetivo)) {
                objetivoCounts[objetivo]++;
            } else {
                objetivoCounts['Outro/Não especificado']++;
            }
        });

        const printDistribution = (title, counts) => {
            console.log(`\n--- Distribuição: ${title} ---`);
            if (totalActivities === 0) {
                console.log('Nenhuma atividade encontrada.');
                return;
            }
            for (const label in counts) {
                const count = counts[label];
                const percentage = (count / totalActivities) * 100;
                console.log(`${label}: ${percentage.toFixed(2)}% (${count})`);
            }
        };

        printDistribution('Eixos Temáticos', eixoCounts);
        printDistribution('Perfil dos Organizadores', organizadorCounts);
        printDistribution('Objetivos das Atividades', objetivoCounts);
        printDistribution('Formato das Atividades', formatoCounts);
    } catch (error) {
        console.error('Erro ao ler ou processar o arquivo JSON:', error);
    }
};

analyzeActivities();
