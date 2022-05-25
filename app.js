const express = require("express")
const _ = require('lodash');
const mongoose = require("mongoose")
let app = express()

let port = process.env.PORT;
if (port == null || port == "") {
    port = 3000;
}
app.use(express.static("public"))
app.use(express.urlencoded({extended: true}))
mongoose.connect("mongodb+srv://bbaltuntas:bora123@cluster0.l3zms.mongodb.net/blog?retryWrites=true&w=majority")


const homeStartingContent = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut fringilla accumsan libero." + " Curabitur nulla eros, porttitor laoreet turpis eu, aliquam luctus tellus. Maecenas dolor metus, hendrerit molestie mauris at," + " facilisis semper felis. Integer vitae luctus tellus, vitae semper risus. Integer gravida tellus et efficitur ultricies. Curabitur sodales, " + "nibh non ullamcorper facilisis, urna dui vestibulum elit, in dignissim urna nisi vel dolor. Ut malesuada diam sed arcu volutpat, sit amet dictum risus feugiat."

const aboutContent = "Rhoncus urna neque viverra justo nec ultrices dui sapien eget. Vel quam elementum pulvinar etiam non quam lacus suspendisse faucibus. Dolor morbi non arcu risus quis varius." + " Elementum sagittis vitae et leo. Sed libero enim sed faucibus turpis in eu mi. Quisque sagittis purus sit amet. Blandit aliquam etiam erat velit scelerisque. "

const contactUsContent = "Dictum sit amet justo donec enim diam. Pellentesque sit amet porttitor eget dolor. Senectus et netus et malesuada fames ac turpis." + " Hendrerit gravida rutrum quisque non. Consectetur a erat nam at lectus urna duis."

const postSchema = new mongoose.Schema({
    title: String, content: String,
})

const Post = mongoose.model("Post", postSchema)


app.set("view engine", "ejs")

app.get("/", (req, res) => {
    Post.find({}, function (err, postList) {
        if (!err) {
            res.render("home", {homeContent: homeStartingContent, postList: postList})
        }
    })


})
app.get("/about", (req, res) => {
    res.render("about", {aboutContent: aboutContent})
})

app.get("/contact", (req, res, next) => {
    res.render("contact", {contactContent: contactUsContent})
})

app.get("/compose", (req, res) => {
    res.render("compose")
})


app.post("/compose", (req, res) => {

    const newPost = new Post({title: req.body.title, content: req.body.post})
    newPost.save(function (err) {
        if (!err) {
            res.redirect("/")
        }
    })


})

app.get("/posts/:postName", (req, res) => {
    const requestedTitle = _.lowerCase(req.params.postName)

    Post.find({}, function (err, postList) {
        if (!err) {
            postList.forEach(function (post) {
                const storedTitle = _.lowerCase(post._id)
                if (storedTitle === requestedTitle) {
                    res.render("post", {
                        title: post.title, content: post.content
                    });
                }
            });
        }
    })


});

app.listen(port, () => {
    console.log(`App is running on http://localhost:${port}`)
})