const {FriendRequest} = require("../models/friendRequest");
const express = require("express");
const router = express.Router();

//* GET request by requestee userID
router.get("/:userId", async (req, res) =>{
    try{
        const requests = await FriendRequest.findById(req.params.userId);
        if (!requests)
            return res
            .status(400)
            .send(`Requests to userid ${req.params.userId} do not exist!`);
        return res.send(requests);
    }catch(ex){
        return res.status(500).send(`InternalServerError:${ex}`);
    }
});


module.exports = router