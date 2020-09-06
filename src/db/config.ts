require('dotenv').config();

const { NODE_ENV } = process.env;

let mongoURI = ' ';

if (NODE_ENV === 'development') {
	mongoURI = process.env.DB_CONNECTION_TEST || 'mongodb://localhost/stonks-go-brrr-test';
}
else {
	mongoURI = process.env.DB_CONNECTION || 'mongodb://localhost/stonks-go-brrr';
}

module.exports = mongoURI;
