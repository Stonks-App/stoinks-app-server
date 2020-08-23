import winston, { transports, format } from 'winston';

const logger = winston.createLogger({
	level: 'info',
	format: winston.format.json(),
	defaultMeta: { service: 'user-services' },
	transports: [
		new winston.transports.File({ filename: 'error.log', level: 'error' }),
		new winston.transports.File({ filename: 'combined.log' })
	]
});

logger.add(
	new transports.Console({
		format: format.combine(format.colorize(), format.simple())
	})
);

export default logger;
