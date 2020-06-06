const express = require("express");
const app = express();
const dotenv = require('dotenv');
dotenv.config();
let CONSTANTS = require('./messages_en.js');
const session = require("telegraf/session");
const Telegraf = require("telegraf");
const bot = new Telegraf(process.env.AUTH_TOKEN);
const genderMapEn=new Map();
genderMapEn.set("M", "Male");
genderMapEn.set("F", "Female");
genderMapEn.set("T","Transgender");
const genderMapHi=new Map();
genderMapHi.set("पु", "Male");
genderMapHi.set("म", "Female");
genderMapHi.set("प","Transgender");
const fetch = require('node-fetch');
const Markup = require('telegraf/markup');
const request = require('request');
const translate = require('@vitalets/google-translate-api');

bot.use(session());
bot.use(Telegraf.log());

bot.start(ctx => {
    resetSession(ctx);
    return ctx.replyWithHTML(CONSTANTS.LANGUAGECHOOSEMSG, Markup.keyboard([["हिन्दी", "English"]]).oneTime().resize().extra());
});

bot.catch((err, ctx) => {
    console.log(`Ooops, encountered an error for ${ctx.updateType}`, err);
  })

bot.hears("हिन्दी", ctx => {
    ctx.session.language = "hi";
    CONSTANTS = require('./messages_hi.js');
    return ctx.replyWithHTML(CONSTANTS.ENTERDETAILS);
});
bot.hears("English", ctx => {
    ctx.session.language = "en";
    CONSTANTS = require('./messages_en.js');
    return ctx.replyWithHTML(CONSTANTS.ENTERDETAILS);
});

bot.hears("बहु-कौशल/अन्य", ctx => {
    ctx.session.skillTemp = ctx.message.text;
    return ctx.replyWithHTML(CONSTANTS.MULTIOTHERSSKILLMSG);
});

bot.hears("Multi-Skill/Others", ctx => {
    ctx.session.skillTemp = ctx.message.text;
    return ctx.replyWithHTML(CONSTANTS.MULTIOTHERSSKILLMSG);
});
//For OCR
bot.on("document", ctx => {
    let aadharNumber="";
    let fileId = ctx.message.document.file_id;
    let fileName = ctx.message.document.file_name;
    let fileSize = ctx.message.document.file_size;
  if(fileSize > 1000000){
    return ctx.replyWithHTML(CONSTANTS.FILELENGTHERRORMSG);
  }
  let fileType = fileName.substring(fileName.lastIndexOf('.')+1);
  let fileTypeArray= ['pdf', 'gif', 'png', 'jpg', 'tif', 'bmp'];
  if(!fileTypeArray.includes(fileType.toLowerCase())){
    return ctx.replyWithHTML(CONSTANTS.FILETYPEERRORMSG);
  }
    bot.telegram.getFile(fileId).then(res => {
    let file_path = res.file_path;
    //OCR api call  
      let ocrApiBody = {
            "apikey": '5272f245a388957',
            "language": 'eng',
            "filetype": fileType,
            "url": `https://api.telegram.org/file/bot${process.env.AUTH_TOKEN}/${file_path}`
        };
    request.post("https://api.ocr.space/parse/image", {
            formData: ocrApiBody
          }, (error, resp, body) => {
            if (error) {
              console.error(error);
              return ctx.replyWithHTML("Error");
            }
            let ocrDataArr= JSON.parse(body).ParsedResults[0].ParsedText.split("\r\n");
            let includeAadhar = ocrDataArr.findIndex(data => data.includes('Your Aadhaar No'));
            if(includeAadhar !== -1){
              aadharNumber = ocrDataArr[includeAadhar+1];
              console.log("aadharNumber: "+aadharNumber);
              return ctx.replyWithHTML(CONSTANTS.OCRSUCCESSMESSAGE1+aadharNumber+CONSTANTS.OCRSUCCESSMESSAGE2);
            }else{
              return ctx.replyWithHTML(CONSTANTS.OCRERRORMESSAGE);
            }
    //ocr call end
    });    
});
    console.log("AadharNumber: "+aadharNumber);
    return ctx.reply("");
});


bot.on("text", ctx => {
    if (ctx.session.name && (CONSTANTS.SKILLARR.includes(ctx.message.text) || ctx.session.skillTemp) && !ctx.session.skill) {
        console.log(ctx.message.text);
      let skillArrDb = (ctx.message.text).split(CONSTANTS.COMMASTRING);
      if(skillArrDb.length>3){
        return ctx.replyWithHTML(CONSTANTS.MAXSKILLSERRORMSG);
      } else if(skillArrDb.filter(item => item.trim() !== "").length !==skillArrDb.length){
        return ctx.replyWithHTML(CONSTANTS.EMPTYSKILLSERRORMSG);
      }
        
        ctx.session.skill = ctx.message.text;
        console.log(
            "Through session: " +
            ctx.session.name +
            " " +
            ctx.session.phone +
            " " +
            ctx.session.pincode +
            " " +
            ctx.session.skill +
            " " +
            ctx.session.gender
        );
        
        if(ctx.session.language ==="hi"){
          //google translator api call and db save api call
          runTranslatorAndDBSaveApi(ctx);
        }else{
        //dbsaveapicall
        dbSaveApiCall(ctx,skillArrDb)
        }
        return;
    }

    if (ctx.session.name && ctx.session.skill) {
        return ctx.replyWithHTML(CONSTANTS.ALREADYMESSAGE);
    }

    let errMsg = checkForValidations(ctx);
    console.log(ctx.message.text);
    if (errMsg === CONSTANTS.EMPTYSTRING) {
        return ctx.replyWithHTML(CONSTANTS.ENTERDETAILSSUCCESS,Markup.keyboard(CONSTANTS.SKILLKEYBOARDARRAY).oneTime().resize().extra());
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
        let arr = userText.split(CONSTANTS.COMMASTRING);

        if (arr.length < 6) {
            errText += CONSTANTS.ENTERDETAILSFAILUREMSG;
            console.log(errText);
        } else {
            let name = arr[0].trim();
            let phone = arr[1].trim();
            let aadhar = arr[2].trim();
            let gender = arr[3].trim();
            let pincode = arr[4].trim();
            let address = userText.substring(nthIndex(userText, ",", 5) + 1).trim();
            console.log("Address: " + address);
            
            if (!name.match(CONSTANTS.NAMEREGEX)) {
                errText += CONSTANTS.NAMEERRORMSG;
            }
            
            if (!phone.match(/^\d{10}$/)) {
                errText += CONSTANTS.PHONEERRORMSG;
            }
            
            if (!aadhar.match(/^\d{12}$/)) {
                errText += CONSTANTS.AADHARERRORMSG;
            }
          
            if (!gender.match(CONSTANTS.GENDERREGEX)) {
                errText += CONSTANTS.GENDERERRORMSG;
            }
            
            if (!pincode.match(/^\d{6}$/)) {
                errText += CONSTANTS.PINCODEERRORMSG;
            }
            
            if (!address.match(CONSTANTS.ADDRESSREGEX)) {
                errText += CONSTANTS.ADDRESSERRORMSG;
            }
            
            if (errText === CONSTANTS.EMPTYSTRING) {
                ctx.session.name = name;
                ctx.session.phone = phone;
                ctx.session.aadhar = aadhar;
                ctx.session.pincode = pincode;
                ctx.session.address = address;
                if(ctx.session.language==="hi"){
                ctx.session.gender = genderMapHi.get(gender);
                }else{
                ctx.session.gender = genderMapEn.get(gender.toUpperCase());
                }
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

async function runTranslatorAndDBSaveApi(ctx) {
      ctx.session.name=await translate(ctx.session.name, { client: 'gtx', to: 'en' }).then(res => res.text);
      ctx.session.address=await translate(ctx.session.address, { client: 'gtx', to: 'en' }).then(res => res.text);
      ctx.session.skill= await translate(ctx.session.skill, { client: 'gtx', to: 'en' }).then(res => res.text);
      console.log("RunTask completed "+ctx.session.name+ctx.session.address+ctx.session.skill);
      let skillArrDbHi = (ctx.session.skill).split(CONSTANTS.COMMASTRING);
      dbSaveApiCall(ctx,skillArrDbHi);
}

function dbSaveApiCall(ctx,skillArrDb){
  let dbApiBody = {
            "Name": ctx.session.name,
            "AadharNumber": Number(ctx.session.aadhar),
            "Phone": Number(ctx.session.phone),
            "Address": ctx.session.address,
            "Pincode": Number(ctx.session.pincode),
            "Gender": ctx.session.gender,
            "Mode": "Telegram",
            "Skill": skillArrDb
        };
    console.log("Going to hit DB : "+ctx.session.name+" "+ctx.session.aadhar+" "+ctx.session.address+" "+ctx.session.skill);
  
        request.post(CONSTANTS.DBAPICALL, {
            json: dbApiBody
          }, (error, res, body) => {
            if (error) {
              console.error(error);
              return ctx.replyWithHTML(CONSTANTS.FAILUREDBMESSAGE);
            }
            console.log("DB save response code: " +body.status);
          let resMsg= CONSTANTS.EMPTYSTRING;
          switch (body.status) {
            case 401:
             resMsg= ctx.replyWithHTML(CONSTANTS.SUCCESSMESSAGE);
              break;
            case 402:
              resMsg= ctx.replyWithHTML(CONSTANTS.AADHARPPENDINGMESSAGE);
              break;
              case 403:
              resMsg= ctx.replyWithHTML(CONSTANTS.ALREADYEXISTMESSAGE);
              break;
              case 404:
              resMsg= ctx.replyWithHTML(CONSTANTS.FAILUREDBMESSAGE);
              break;
              case 405:
              resMsg= ctx.replyWithHTML(CONSTANTS.WRONGPINCODEMESSAGE);
              break;
            default:
              resMsg= ctx.replyWithHTML(CONSTANTS.FAILUREDBMESSAGE);
          }
          return resMsg;
          }); 
}

function resetSession(ctx){
    ctx.session.aadhar=null;
    ctx.session.skill=null;
    ctx.session.name=null;
    ctx.session.pincode=null;
    ctx.session.gender=null;
    ctx.session.address=null;
    ctx.session.skillTemp=null;
    ctx.session.address=null;
    ctx.session.language=null;
  }