import mongoose, { Schema, Document } from 'mongoose';

export interface chatMessages extends Document {
	tradeMessageID: string;
	author: object;
	embeds: object;
	timestamp: string;
}

const TradeMessageSchema: Schema = new Schema(
	{
		tradeMessageID: {
			type: String,
			unique: true
		},
		content: String,
		author: {
			username: String
		},
		timeStamp: Date
	},
	{ timestamps: { createdAt: 'created_at' } }
);

const tradeMessage = mongoose.model<chatMessages>('ChatMessage', TradeMessageSchema);

export default tradeMessage;
