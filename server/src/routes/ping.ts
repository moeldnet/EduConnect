import express from 'express';

const router = express.Router();

router.get('/', (_, res) => {
	res.send('Pong!');
});

/* a global path to this router */
const path = '/ping';
export { router, path };