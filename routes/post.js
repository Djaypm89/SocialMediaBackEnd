// IMPORTS:
const {Post, validatePost, validateLike} = require("../models/post");
const express = require("express");
const router = express.Router();


// ROUTES:

//Tested Success:
router.get("/post/:id", async (req, res) => {
    
    try{
        
        const posts = await Post.find(
            { userId: req.params.id }
        );

        return res.send(posts);
    }catch(error){
        console.log("Couldn't Retrieve Post");
    }
});

//Tested Success:
router.post("/post", async (req, res) => {
    try{
        const { error } = validatePost(req.body);
        if(error) return res.status(400).send(error);

        const post = new Post({
            userId: req.body.userId,
            postBody: req.body.postBody
        });

        await post.save();

        return res.send(post);
    }catch(error){
        console.log("Couldn't Create New Post");
    }
});

router.put("/post/:id", async (req, res) => {
    try{
        const {error} = validateLike(req.body);
        if(error) return res.status(400).send(error);

        const post = await Post.findOneAndUpdate(
            {
                "_id": req.params.id
            },
            {
                like: req.body.like
            },
            {new: true}
        );

        await post.save();

        return res.send(post);

    }catch(error){
        console.log("Couldn't Update Post");
    }
});

router.delete("/post/:id", async (req, res) => {
    try{
        const post = await Post.findByIdAndDelete( req.params.id );

        return res.send(post);

    }catch(error){
        console.log("Couldn't Delete Post");
    }
});

module.exports = router;