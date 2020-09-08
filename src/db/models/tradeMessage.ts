import mongoose, { Schema, Document } from 'mongoose';

export interface tradeMessages extends Document {
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
		channel_id: String,
		content: String,
		author: {
			authorId: String,
			username: String
		},
		timeStamp: Date
	},
	{ timestamps: { createdAt: 'created_at' } }
);

const tradeMessage = mongoose.model<tradeMessages>('ChatMessage', TradeMessageSchema);

export default tradeMessage;
