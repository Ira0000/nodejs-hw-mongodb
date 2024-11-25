import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import dotenv from 'dotenv';
import router from './routers/contacts.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';

dotenv.config();
const PORT = Number(process.env.PORT) || 3000;

export const setupServer = () => {
  const app = express();

  app.use(express.json());
  app.use(cors());
  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.use(router); // Додаємо роутер до app як middleware

  app.use('*', notFoundHandler); // обробка помилок коли неіснує такої адреси

  app.use(errorHandler); // обробка помилок коли помилка сервера

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
