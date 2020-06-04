// app.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const CONSTANTS = require('./const.js');
const session = require("telegraf/session");
const Telegraf = require("telegraf");
const bot = new Telegraf(process.env.AUTH_TOKEN);
const skillArr = ["Carpentor", "Mason", "Tailor", "Beautician", "Electrician", "Construction Labour", "Fitter", "Painter", "Plumber"];
const fetch = require('node-fetch');
const Markup = require('telegraf/markup');
const request = require('request'); 

bot.use(session());
bot.use(Telegraf.log());

bot.start(ctx => {
    ctx.replyWithHTML(CONSTANTS.ENTERDETAILS);
});

bot.hears("Multi-Skill/Others", ctx => {
    ctx.session.skillTemp = ctx.message.text;
    ctx.replyWithHTML(CONSTANTS.MULTIOTHERSSKILL);
});

bot.on("photo", ctx => {
    console.log("Image file_id:" + ctx.message.photo[0].file_id);
    ctx.replyWithHTML("Testing Image");
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
        let skillArrDb = (ctx.session.skill).split(CONSTANTS.COMMASTRING);
        let dbApiUrl = CONSTANTS.DBAPICALL;

        let dbApiBody = {
            "Name": ctx.session.name,
            "AadharNumber": Number(ctx.session.aadhar),
            "Phone": Number(ctx.session.phone),
            "Address": ctx.session.address,
            "Pincode": Number(ctx.session.pincode),
            "Skill": skillArrDb
        };

        request.post(CONSTANTS.DBAPICALL, {
            json: dbApiBody
          }, (error, res, body) => {
            if (error) {
              console.error(error);
              return ctx.replyWithHTML(CONSTANTS.FAILUREDBMESSAGE);
            }
            console.log("DB save response" +body);
            if (body) {
                return ctx.replyWithHTML(CONSTANTS.SUCCESSMESSAGE);
            } else {
                return ctx.replyWithHTML(CONSTANTS.FAILUREDBMESSAGE);
            }
          }); 

        return;
    }

    if (ctx.session.name && ctx.session.skill) {
        return ctx.replyWithHTML(CONSTANTS.ALREADYMESSAGE);
    }

    let errMsg = checkForValidations(ctx);
    console.log(ctx.message.text);
    if (errMsg == CONSTANTS.EMPTYSTRING) {
        return ctx.replyWithHTML(CONSTANTS.ENTERDETAILSSUCCESS,
            Markup.keyboard([
                ["Carpentor", "Mason", "Plumber"],
                ["Tailor", "Beautician", "Painter"],
                ["Electrician", "Fitter", "Construction Labour"],
                ["Multi-Skill/Others"]
            ])
                .oneTime()
                .resize().extra());
    } else {
        return ctx.replyWithHTML(errMsg + CONSTANTS.ENTERDETAILSFAILURE);
    }
});

bot.launch();

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
    console.log("Your app is listening on port " + listener.address().port);
});

function checkForValidations(ctx) {
    let errText = CONSTANTS.EMPTYSTRING;
    let userText = ctx.message.text;
    if (typeof userText !== "undefined" || userText !== undefined) {
        var arr = userText.split(CONSTANTS.COMMASTRING);

        if (arr.length < 5) {
            errText += CONSTANTS.ENTERDETAILSFAILUREMSG;
            console.log(errText);
        } else {
            let name = arr[0].trim();
            let phone = arr[1].trim();
            let aadhar = arr[2].trim();
            let pincode = arr[3].trim();
            let address = userText.substring(nthIndex(userText, ",", 4) + 1).trim();
            console.log("Address: " + address);
            
            if (!name.match(/^[A-Za-z ]+$/)) {
                errText += CONSTANTS.NAMEERRORMSG;
            }
            
            if (!phone.match(/^\d{10}$/)) {
                errText += CONSTANTS.PHONEERRORMSG;
            }
            
            if (!aadhar.match(/^\d{12}$/)) {
                errText += CONSTANTS.AADHARERRORMSG1;
            } else {
                //aadharapicall
                
                let aadharApiUrl = `https://aadhaarnumber-verify.p.rapidapi.com/Uidverify?uidnumber=${aadhar}&clientid=111&method=uidverify&txn_id=123456`;

                let headers = {
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
                errText += CONSTANTS.PINCODEERRORMSG;
            }
            
            if (!address.match(/^[A-Za-z \d]+$/)) {
                errText += CONSTANTS.ADDRESSERRORMSG;
            }
            
            if (errText == CONSTANTS.EMPTYSTRING) {
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
    let L = str.length, i = -1;
    while (n-- && i++ < L) {
        i = str.indexOf(pat, i);
        if (i < 0) break;
    }
    return i;
}
