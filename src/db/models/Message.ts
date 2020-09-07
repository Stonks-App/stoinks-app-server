import mongoose, { Schema, Document } from 'mongoose';

export interface discordMessage extends Document {
	id: string;
	author: object;
	embeds: any;
	timestamp: string;
}

const MessageSchema: Schema = new Schema({
	id: String,
	author: {
		id: String,
		username: String
	},
	embeds: [
		{
			type: String,
			title: String,
			color: Number,
			fields: [
				{
					time: String,
					ticker: String,
					expirationDate: String,
					callOrPut: String,
					spotPrice: String,
					strikePrice: String,
					flowSize: String,
					type: String,
					premium: String
				}
			]
		}
	]
});

const Message = mongoose.model<discordMessage>('Message', MessageSchema);

export default Message;
