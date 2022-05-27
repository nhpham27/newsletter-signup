// https://young-forest-72029.herokuapp.com/

const bodyParser = require("body-parser");
const express = require("express");
const https = require("https");
const mailchimp = require('@mailchimp/mailchimp_marketing');

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html");
});

// mailchimp API key: eee3c8acd0f94ee9f7105c61a06f371a-us11
// unique ID: 2be5f46b07
app.post("/", function (req, res) {
    // create data object
    console.log(req.body.email, req.body.firstName, req.body.lastName);
    const data = {
        members: [
            {
                email_address: req.body.email,
                status: "subscribed",
                merge_fields: {
                    FNAME: req.body.firstName,
                    LNAME: req.body.lastName,
                }
            }
        ]
    };

    // convert data to JSON
    const jsonData = JSON.stringify(data);

    // make https POST request to mailchimp server
    const url = "https://us11.api.mailchimp.com/3.0/lists/2be5f46b07";
    const options = {
        method: "POST",
        auth: "nguyenhoa27:eee3c8acd0f94ee9f7105c61a06f371a-us11"
    };

    const request = https.request(url, options, function (response) {
        // check response status code
        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        }
        else {
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data", function (data) {
            console.log(JSON.parse(data));
        });
    });
    request.write(jsonData);
    request.end();
});

app.post("/failure", function (req, res) {
    res.redirect("/");
});

app.listen(process.env.PORT || 8000, function () {
    console.log("Server is running on port 8000!");
});