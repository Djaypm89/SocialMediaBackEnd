const {FriendRequest} = require("../models/friendRequest");
const {User} = require("../models/user");
const auth = require("../middleware/auth");
const express = require("express");
const router = express.Router();

//* POST send friend request to user
router.post("/users/request/:userId", [auth], async (req, res) => {
    try{
        const requestee = await User.findOne({ _id: req.params.userId});
        const requestor = await User.findOne({ _id: req.user._id});

        if (!requestee)
            return res
            .status(400)
            .send("User not found");

        if (req.user.id === req.params.userId) {
            return res
            .status(400)
            .send("You cant add yourself as friend.");
        }

        if (requestor.friends.includes(req.params.userId)) {
            return res
            .status(400)
            .send("You are already friends.");
        }

        const request = new FriendRequest ({
            requestor : requestor,
            requestee : requestee,
        });

        await request.save();
        return res.send(request);
    }catch(ex){
        return res.status(500).send(`InternalServerError:${ex}`);
    }
});

//* GET request by requestee id
router.get("/users/request/recieved", [auth], async (req, res) =>{
    try{
        const requests = await FriendRequest.find( {requestee: req.user._id});
        if (!requests)
            return res
            .status(400)
            .send(`Requests to userId ${req.user._id} do not exist!`);
        return res.send(requests);
    }catch(ex){
        return res.status(500).send(`InternalServerError:${ex}`);
    }
});

//* GETALL requests by requestor userID
router.get("/users/request/sent", [auth], async (req, res) =>{
    try{
        const requests = await FriendRequest.find( {requestor: req.user._id});
        if (!requests)
            return res
            .status(400)
            .send(`Requests from userId ${req.user._id} do not exist!`);
        return res.send(requests);
    }catch(ex){
        return res.status(500).send(`InternalServerError:${ex}`);
    }
});

//* GETALL requests
router.get("/users/requests/", async (req, res) =>{
    try{
        const requests = await FriendRequest.find();
        if (!requests)
            return res
            .status(400)
            .send(`Requests do not exist!`);
        return res.send(requests);
    }catch(ex){
        return res.status(500).send(`InternalServerError:${ex}`);
    }
});

//* PUT request
//*access friendrequest sent to logged in user "req.user" 
router.put("/users/request/recieved/:requestID", [auth], async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.user._id})
        const request = await FriendRequest.findOneAndUpdate(
            req.params.requestID,
            {
                requestor: req.body.requestor,
                requestee: req.body.requestee,
                status: req.body.status,
            },
            { new: true}
            );
        const requestor = await User.findOne({_id: request.requestor})

        if (user.friends.includes(request.requestor)) {
            return res
            .status(400)
            .send("You are already friends.");
        }
        
        if (request.status == "ACCEPTED"){
            user.friends.push(request.requestor) 
            & requestor.friends.push(request.requestee)
            await user.save() & requestor.save()
        }
        
        await request.save()
        return res.send(request);
    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
  });

module.exports = router