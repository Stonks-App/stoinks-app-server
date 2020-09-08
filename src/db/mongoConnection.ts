import mongoose from 'mongoose';

export interface db {}

export default (db: string) => {
	try {
		const connect = () => {
			mongoose
				.connect(db, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
				.then(() => {
					return console.log(`💾 Successfully connected to ${db}`);
				})
				.catch((error) => {
					console.log('Error connecting to database: ', error);
					return process.exit(1);
				});
		};
		connect();
		mongoose.connection.on('disconnected', connect);
	} catch (error) {
		console.log(error);
	}
};
