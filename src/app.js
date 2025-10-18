// src/app.js
const express = require('express');
const app = express();
const cors = require('cors');

app.use(express.json());
app.use(cors());

// Rotas serão adicionadas aqui futuramente

app.listen(3000, () => {
  console.log('🩺 Saúde Ciclo da Vida rodando na porta 3000');
});

// meusDados

const meusDadosRoutes = require('./routes/meusDadosRoutes');
app.use('/api/meusdados', meusDadosRoutes);

// parente

const parenteRoutes = require('./routes/parenteRoutes');
app.use('/api/parentes', parenteRoutes);

// especialidade

const especialidadeRoutes = require('./routes/especialidadeRoutes');
app.use('/api/especialidades', especialidadeRoutes);

// profissional

const profissionalRoutes = require('./routes/profissionalRoutes');
app.use('/api/profissionais', profissionalRoutes);

// local

const localRoutes = require('./routes/localRoutes');
app.use('/api/locais', localRoutes);

// agendamento

const agendamentoRoutes = require('./routes/agendamentoRoutes');
app.use('/api/agendamentos', agendamentoRoutes);

// medicamentoPrescrito

const medicamentoPrescritoRoutes = require('./routes/medicamentoPrescritoRoutes');
app.use('/api/medicamentos', medicamentoPrescritoRoutes);

// exameRealizado

const exameRealizadoRoutes = require('./routes/exameRealizadoRoutes');
app.use('/api/exames', exameRealizadoRoutes);

// diagnosticoEmitido

const diagnosticoEmitidoRoutes = require('./routes/diagnosticoEmitidoRoutes');
app.use('/api/diagnosticos', diagnosticoEmitidoRoutes);

// atestadoEmitido

const atestadoEmitidoRoutes = require('./routes/atestadoEmitidoRoutes');
app.use('/api/atestados', atestadoEmitidoRoutes);

// encaminhamentoEmitido

const encaminhamentoEmitidoRoutes = require('./routes/encaminhamentoEmitidoRoutes');
app.use('/api/encaminhamentos', encaminhamentoEmitidoRoutes);

// evolucaoPaciente

const evolucaoPacienteRoutes = require('./routes/evolucaoPacienteRoutes');
app.use('/api/evolucao', evolucaoPacienteRoutes);

// historico

const historicoRoutes = require('./routes/historicoRoutes');
app.use('/api/historico', historicoRoutes);
