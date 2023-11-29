import mongoose from "mongoose";

const Premium = mongoose.model('Premiums', new mongoose.Schema({
    id: {
        type: String,
        default: null
    },
    expiresAt: {
        type: Date,
        default: null
    },
    isPremium: {
        type: Boolean,
        default: false
    }
}));

export = {
    async create(id: string, expiresAt = new Date(), isPremium = false) {
        const newPremium = new Premium({
            id,
            expiresAt,
            isPremium
        });
        await newPremium.save();
        return newPremium;
    },
    async get(id: string) {
        return await Premium.findOne({ id });
    },
    async delete(id: string) {
        return await Premium.findOneAndDelete({ id });
    },
    async update(id: string, expiresAt = new Date(), isPremium = false) {
        return await Premium.findOneAndUpdate({ id }, { expiresAt, isPremium });
    },
    async isPremium(id: string) {
        const data = await Premium.findOne({ id });
        if(!data) {
            //Make a new premium guild
            await this.create(id);
            return false;
        } else {
            if(data.isPremium) {
                if(data.expiresAt.getTime() <= new Date().getTime()) {
                    await this.update(id, new Date(), false);
                    return false;
                } else {
                    return true;
                }
            } else {
                return false;
            }
        }
    }
}
