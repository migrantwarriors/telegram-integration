// app.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const session = require("telegraf/session");
const Telegraf = require("telegraf");
const bot = new Telegraf(process.env.AUTH_TOKEN);
const skillArr = ["Carpentor", "Mason", "Tailor", "Beautician", "Electrician", "Construction Labour", "Fitter", "Painter", "Plumber"];
const fetch = require('node-fetch');
const Markup = require('telegraf/markup');


bot.use(session());
bot.use(Telegraf.log());
bot.start(ctx =>
    ctx.replyWithHTML(
        "Please provide your details for employment in the given format - <b>name, phonenumber, aadharnumber, pincode, address</b>. \n\nFor eg. <b>garishma nagpal, 9999999999, 123456789012, 201010, Indirapuram Ghaziabad</b>"
    )
);
bot.hears("Multi-Skill/Others", ctx => {
    ctx.session.skillTemp = ctx.message.text;
    ctx.replyWithHTML(
        "Please provide your skill. If multiple, then provide them comma separated."
    );
});

bot.on("photo", ctx => {
    console.log("Image file_id:" + ctx.message.photo[0].file_id);
    ctx.replyWithHTML(
        "Wow received image"
    );
});

bot.on("text", ctx => {
    if (ctx.session.name && (skillArr.includes(ctx.message.text) || ctx.session.skillTemp) && !ctx.session.skill) {
        console.log(ctx.message.text);
        ctx.session.skill = ctx.message.text;
        console.log(
            "Through session: " +
            ctx.session.name +
            " " +
            ctx.session.phone +
            " " +
            ctx.session.pincode +
            " " +
            ctx.session.skill
        );
        //dbsaveapicall//setflag
        return ctx.replyWithHTML(
            "Thank You for providing your details. We will contact you shortly. You may check <b>http://migrantwarriors.com</b> for more updates."
        );
    }

    if (ctx.session.name && ctx.session.skill) {
        return ctx.replyWithHTML(
            "We have already got your details. We will contact you shortly. You may check <b>http://migrantwarriors.com</b> for more updates."
        );
    }

    let errMsg = checkForValidations(ctx);
    console.log(ctx.message.text);
    if (errMsg == "") {
        return ctx.replyWithHTML("Thank You for providing your details. \n\nPlease select your <b>skills:</b> \n1. Carpenter\n2. Mason\n3. Plumber\n4. Tailor\n5. Beautician\n6. Painter\n7. Electrician\n8. Fitter\n9. Construction Labour\n10. Multi-Skill/Others \n\n<b>If not given in the list or more than one skill select Multi-Skill/Others.</b>",
            Markup.keyboard([
                ["Carpentor", "Mason", "Plumber"],
                ["Tailor", "Beautician", "Painter"],
                ["Electrician", "Fitter", "Construction Labour"],
                ["Multi-Skill/Others"]
            ])
                .oneTime()
                .resize().extra());
    } else {
        return ctx.replyWithHTML(
            errMsg + "\n<b>Please enter your details again in correct format as given. </b> \n\nFor eg. <b>garishma nagpal, 9999999999, 123456789012, 201010, Indirapuram Ghaziabad</b>"
        );
    }
});

bot.launch();

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
    console.log("Your app is listening on port " + listener.address().port);
});

function checkForValidations(ctx) {
    let errText = "";
    let userText = ctx.message.text;
    if (typeof userText !== "undefined" || userText !== undefined) {
        var arr = userText.split(",");

        if (arr.length < 5) {
            errText += "Invalid input. All five values are not given.";
            console.log(errText);
        } else {
            let name = arr[0].trim();
            let phone = arr[1].trim();
            let aadhar = arr[2].trim();
            let pincode = arr[3].trim();
            let address = userText.substring(nthIndex(userText, ",", 4) + 1).trim();
            console.log("Address: " + address);
            
            if (!name.match(/^[A-Za-z]+$/)) {
                errText += "<b>Name</b> is invalid. It should be all letters.";
            }
            
            if (!phone.match(/^\d{10}$/)) {
                errText +=
                    "\n<b>Phone number</b> is invalid. It should be 10 in length and all should be numbers.";
            }
            var aadharApiCallFlag = true;
            
            if (!aadhar.match(/^\d{12}$/)) {
                errText +=
                    "\n<b>Aadhar number</b> is invalid. It should be 12 in length and all should be numbers.";
            } else {
                //aadharapicall
                
                var aadharApiUrl = `https://aadhaarnumber-verify.p.rapidapi.com/Uidverify?uidnumber=${aadhar}&clientid=111&method=uidverify&txn_id=123456`;

                var headers = {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "X-RapidAPI-Host": "aadhaarnumber-verify.p.rapidapi.com",
                    "X-RapidAPI-Key":
                        "f1419a9897msh78e29cfb99f2667p1dbe25jsnda2709e35f7a",
                    accept: "application/json"
                };

                const getData = async (url) => {
                    try {
                        const response = await fetch(url, { method: 'POST', headers: headers });
                        const json = await response.json();
                        console.log("JSON: " + JSON.stringify(json));
                    } catch (error) {
                        console.log(error);
                    }
                };

                getData(aadharApiUrl);
                //aadharapicallend
            }
            
            if (!pincode.match(/^\d{6}$/)) {
                errText +=
                    "\n<b>Pincode</b> is invalid. It should be 6 in length and all should be numbers.";
            }
            
            if (!address.match(/^[A-Za-z \d]+$/)) {
                errText +=
                    "\n<b>Address</b> is invalid. It should not include any special character.";
            }
            
            if (errText == "") {
                ctx.session.name = name;
                ctx.session.phone = phone;
                ctx.session.aadhar = aadhar;
                ctx.session.pincode = pincode;
                ctx.session.address = address;
            }
        }
    }
    return errText;
}

function nthIndex(str, pat, n) {
    var L = str.length, i = -1;
    while (n-- && i++ < L) {
        i = str.indexOf(pat, i);
        if (i < 0) break;
    }
    return i;
}
