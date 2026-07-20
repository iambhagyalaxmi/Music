require('ts-node').register({ skipProject: true, compilerOptions: { module: 'CommonJS', esModuleInterop: true } });
require('./prisma/seed.ts');
