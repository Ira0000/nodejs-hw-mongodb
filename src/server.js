import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import dotenv from 'dotenv';
import { getAllContacts, getContactById } from './services/contacts';

dotenv.config();
const PORT = Number(process.env.PORT) || 3000;

export const setupServer = () => {
  const app = express();

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );
  app.use(cors());

  app.use('*', (req, res, next) => {
    res.status(404).json({
      message: 'Not found',
    });
  });
  app.use((err, req, res, next) => {
    res.status(500).json({
      message: 'Something went wrong',
      error: err.message,
    });
  });

  app.get('/contacts', async (req, res) => {
    const contacts = await getAllContacts;
    res.status(200).json({
      message: 'Successfully found contacts!',
      data: contacts,
    });
  });

  app.get('/contacts/:contactId', async (req, res, next) => {
    const { contactId } = req.params;
    const contact = await getContactById(contactId);

    if (!contactId) {
      res.status(404).json({
        message: 'Contact not found',
      });
    }
    res.status(200).json({
      data: contact,
      message: `Successfully found contact with id ${contactId}`,
    });
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
