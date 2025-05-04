import { Database } from './config/db';
import { createServer } from './server';

const startServer = async () => {
  const { app } = await createServer();
  console.log(`🚀 Starting the platform server on port ${process.env.PORT}`);
  app.listen(process.env.PORT);
};

startServer().catch((error) => console.error(error));

process.on('uncaughtException', (error) => {
  console.error(error);
  console.error(`Uncaught Exception: ${error.message}`);
  Database.Disconnect();
  process.exit(1);
});

process.on('unhandledRejection', (error) => {
  console.error(error);
  console.error(`Unhandled Rejection: ${(error as Error).message}`);
  Database.Disconnect();
  process.exit(1);
});
