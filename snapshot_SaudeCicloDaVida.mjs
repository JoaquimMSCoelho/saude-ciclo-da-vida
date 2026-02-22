// -------------------------------------------------------------------------
// PROJETO: SAÚDE CICLO DA VIDA (ENTERPRISE EDITION)
// ARQUIVO: E:\Projetos\SaudeCicloDaVida\snapshot_SaudeCicloDaVida.mjs
// OBJETIVO: CONSOLIDAÇÃO DE CONTEXTO PARA AUDITORIA E INTELIGÊNCIA
// -------------------------------------------------------------------------

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const rootDir = process.cwd();

// Configuração de Identidade do Snapshot
const projectName = "SAUDE_CICLO_DA_VIDA";
const now = new Date();
const timestamp = now.toISOString().replace(/T/, '_').replace(/[:.]/g, '-').slice(0, 19);
const outputFile = path.join(rootDir, `SNAPSHOT_${projectName}_${timestamp}.md`);

// 🛡️ REGRAS DE HIGIENE CIRÚRGICA (BLACKLIST ADAPTADA)
const EXCLUDED_DIRS = new Set(['node_modules', '.next', '.git', 'dist', 'build', 'public', '.vite', 'coverage']);
const EXCLUDED_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.gif', '.ico', '.svg', '.webp', '.woff', '.woff2', '.ttf', '.eot', '.mp4', '.mp3', '.pdf', '.zip', '.db', '.sqlite']);
const EXCLUDED_FILES = new Set(['package-lock.json', '.DS_Store', 'snapshot_SaudeCicloDaVida.mjs']);

// Função de Proteção de Credenciais (Segurança Enterprise)
const isEnvFile = (filename) => filename.startsWith('.env');

function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function getAllFiles(dirPath, arrayOfFiles = []) {
    const files = fs.readdirSync(dirPath);

    files.forEach((file) => {
        const fullPath = path.join(dirPath, file);
        const relPath = path.relative(rootDir, fullPath);

        if (fs.statSync(fullPath).isDirectory()) {
            if (!EXCLUDED_DIRS.has(file)) {
                getAllFiles(fullPath, arrayOfFiles);
            }
        } else {
            const ext = path.extname(file).toLowerCase();
            if (!EXCLUDED_EXTENSIONS.has(ext) && 
                !EXCLUDED_FILES.has(file) && 
                !isEnvFile(file)) {
                
                const stats = fs.statSync(fullPath);
                arrayOfFiles.push({
                    filePath: fullPath,
                    ext: ext,
                    size: stats.size,
                    mtime: stats.mtime
                });
            }
        }
    });

    return arrayOfFiles;
}

function generateMarkdown() {
    console.log(`🚀 Iniciando Snapshot: ${projectName}...`);
    const allFiles = getAllFiles(rootDir);
    let markdownContent = `# 📸 SNAPSHOT TÉCNICO: ${projectName}\n`;
    markdownContent += `📅 Gerado em: ${now.toLocaleString('pt-BR')}\n`;
    markdownContent += `📂 Raiz: ${rootDir}\n\n`;
    markdownContent += `## 🏗️ Árvore de Arquivos Processados\n\n`;

    let processedCount = 0;

    allFiles.forEach(file => {
        const relativePath = path.relative(rootDir, file.filePath).replace(/\\/g, '/');
        
        try {
            const content = fs.readFileSync(file.filePath, 'utf8');
            
            markdownContent += `================================================================================\n`;
            markdownContent += `📁 ARQUIVO: ${relativePath}\n`;
            markdownContent += `📏 TAMANHO: ${formatBytes(file.size)}\n`;
            markdownContent += `================================================================================\n\n`;
            
            const mdLang = file.ext.replace('.', '') || 'text';
            markdownContent += `\`\`\`${mdLang}\n`;
            markdownContent += content;
            markdownContent += `\n\`\`\`\n\n`;
            
            processedCount++;
        } catch (err) {
            console.warn(`⚠️ Erro ao ler ${relativePath}: ${err.message}`);
        }
    });

    fs.writeFileSync(outputFile, markdownContent, 'utf8');
    console.log(`✅ Snapshot concluído! Arquivo gerado: ${path.basename(outputFile)}`);
    console.log(`📊 Total de arquivos consolidados: ${processedCount}`);
}

generateMarkdown();