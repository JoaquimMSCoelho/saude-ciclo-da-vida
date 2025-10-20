import Fastify from 'fastify';
import healthRoutes from './routes/health';

const app = Fastify({ logger: true });

app.register(healthRoutes);

app.listen({ port: 3000 }, (err, address) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
  app.log.info(`Servidor rodando em ${address}`);
});
