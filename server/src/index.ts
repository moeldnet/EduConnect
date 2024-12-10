import * as fs from 'fs';
import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';

import config from './config';

// main initialization
const app = express();

// middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// dynamic route loading
type RouteModule = {
	router: express.Router,
	path: string
};

const routeFiles = fs.readdirSync('./src/routes', { encoding: 'utf8' });

for (const routeFile of routeFiles) {
	const routePath = path.join(__dirname, routeFile);

	import(routePath)
		.then((module: RouteModule) => {
			app.use(module.path, module.router);
			console.log(`Loaded router '${module.path}'`);
		})
		.catch(error => console.error(error));
}

// listen on port
const server = app.listen(config.port, () => {
	console.log(`Server is running on port ${config.port}`);
});

// graceful shutdown
process.on('SIGINT', () => {
	console.log('Shutting down...');
	server.close();
});