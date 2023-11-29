import mongoose from "mongoose";

const PremiumCode = mongoose.model('PremiumCodes', new mongoose.Schema({
    code: {
        type: String,
        default: null
    },
    plan: {
        type: String,
        default: "monthly"
    },
    expiresAt: {
        type: Date,
        default: null
    },
    uses: {
        type: Number,
        default: 1,
    }
}));

export = {
    async create(code: string, plan = "monthly", expiresAt = new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 30), uses = 1) {
        const newCode = new PremiumCode({
            code,
            plan,
            expiresAt,
            uses
        });
        await newCode.save();
        return newCode;
    },
    async get(code: string) {
        return await PremiumCode.findOne({ code });
    },
    async delete(code: string) {
        return await PremiumCode.findOneAndDelete({ code });
    },
    async use(code: string): Promise<boolean> {
        const data = await PremiumCode.findOne({ code });
        if(!data) return false;
        if(data.uses <= 0) {
            await PremiumCode.findOneAndDelete({ code });
            return false;
        } else {
            await PremiumCode.findOneAndUpdate({ code }, { $inc: { uses: -1 } });
            return true;
        }
    }
}