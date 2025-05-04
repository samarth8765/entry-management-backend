export const validateEnv = () => {
  const requiredEnvVars: string[] = [
    'MONGODB_URI',
    'PORT',
    'NODE_ENV',
    'CORS_ORIGIN'
  ];

  let notFound = false;

  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      console.error(`Error: Environment variable ${envVar} is not set`);
      notFound = true;
    }
  }
  if (notFound) process.exit(1);
};
