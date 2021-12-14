const mongoose = require("mongoose");

const friendRequestSchema = mongoose.Schema({
    requestor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    requestee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    status: {
        type: String,
        enum: ["PENDING", "ACCEPTED", "REJECTED"],
        default: "PENDING",
    },
});

const FriendRequest = mongoose.model("FriendRequest", friendRequestSchema);
module.exports.FriendRequest = FriendRequest;
module.exports.friendRequestSchema = friendRequestSchema;