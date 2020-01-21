/* eslint-disable dot-location */
/* eslint-disable indent-legacy */
/* eslint-disable indent */
/* eslint-disable no-sync */
/* eslint-disable new-cap */
const {loggers} = require('winston');
const logger = loggers.get('routers')
const express = require('express');
const router = express.Router();
const jwtMiddleware = require('../jwt-express-middleware');


router.put('/*', jwtMiddleware.checkSecurityToken, async (req, res) => {
	try {
		const Services = res.app.get('shared_services');
		logger.info(`Starting gateway PUT api on path: ${req.path} with incoming request: ${JSON.stringify(req.body)}' and jwt payload: ${JSON.stringify(req.jwtPayload)}`)
		let status = 500
		const result = await Services.doRemoteRequest(req)
		logger.info(`Remote api done with result: ${JSON.stringify(result)}`)

		/*
		 *problematicke: remote sluzba nevraci status
		 */

		if (result) {
			status = 200
			res.json(result).status(200).end()
			
		} else {
			res.sendStatus(status)
		}


	} catch (err) {
		if (typeof err === 'object') {
			logger.error(`Remote service api ERR: ${JSON.stringify(err)}`)
		} else if (typeof err === 'string' || err instanceof String) {
			logger.error(`Remote service api ERR: ${err}`)
		}
		res.sendStatus(500)
	}
});

router.get('/*', jwtMiddleware.checkSecurityToken, async (req, res) => {
	try {
		const Services = res.app.get('shared_services');
		logger.info(`Starting gateway ${req.method} api on path: ${req.originalUrl} with parameters: ${JSON.stringify(req.query)} and jwt payload: ${JSON.stringify(req.jwtPayload)}`)

		let result = {}
		let status = 500


		await Services.doRemoteRequest(req)
			.then((response) => {
				logger.info(`Remote service call done with result: ${JSON.stringify(response)}`)
				status = 200
				result = response
			})
			.catch((error) => {
				logger.error(`Remote service call done with result: ${error}`)
				status = error
			})


		if (status === 200) {
			res.json(result).status(status).end()
		} else {
			res.status(status).end()
		}


	} catch (err) {
		if (typeof err === 'object') {
			if (Object.entries(err).length > 0) {
				logger.error(`Remote service api ERR: ${JSON.stringify(err)}`)
			} else {
				logger.error('Unexpected remote service api error')
			}
		} else if ((typeof err === 'string' || err instanceof String) && err.length > 0) {
			logger.error(`Remote service api ERR: ${err}`)
		} else {
			logger.error('Unexpected remote service api error')

		}
		res.sendStatus(500)
	}
});


module.exports = router;
