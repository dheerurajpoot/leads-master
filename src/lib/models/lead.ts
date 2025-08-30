import mongoose, { Document, Schema } from "mongoose";

export interface ILead extends Document {
	name: string;
	email: string;
	phone: string;
	city?: string;
	loanAmount?: number;
	done: boolean;
	created_at: Date;
}

const leadSchema = new Schema<ILead>({
	name: {
		type: String,
		required: true,
		trim: true,
		minlength: 2,
	},
	email: {
		type: String,
		required: true,
		trim: true,
		lowercase: true,
		match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
	},
	phone: {
		type: String,
		required: true,
		trim: true,
	},
	city: {
		type: String,
		trim: true,
		default: "",
	},
	loanAmount: {
		type: Number,
		min: 0,
		default: null,
	},
	done: {
		type: Boolean,
		default: false,
	},
	created_at: {
		type: Date,
		default: Date.now,
	},
});

// Create index for better query performance
leadSchema.index({ created_at: -1 });
leadSchema.index({ done: 1 });

export const Lead =
	mongoose.models.Lead || mongoose.model<ILead>("Lead", leadSchema);
