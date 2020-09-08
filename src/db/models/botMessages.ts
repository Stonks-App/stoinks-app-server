import mongoose, { Schema, Document } from 'mongoose';

export interface botMessages extends Document {
	botMessageID: string;
	embeds: object;
	timeStamp: string;
}

const BotMessageSchema: Schema = new Schema(
	{
		botMessageID: String,
		channel_id: String,
		embeds: {
			typeOfData: String,
			title: String,
			color: Number,
			fields: {
				time: String,
				ticker: String,
				expirationDate: String,
				callOrPut: String,
				spotPrice: String,
				strikePrice: String,
				flowSize: String,
				typeOfOptionOrder: String,
				premium: String
			}
		},
		timeStamp: Date
	},
	{ timestamps: { createdAt: 'created_at' } }
);

const botMessage = mongoose.model<botMessages>('BotMessage', BotMessageSchema);

export default botMessage;
