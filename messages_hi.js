module.exports = Object.freeze({
    ENTERDETAILS: 'कृपया दिए गए प्रारूप में पंजीकरण के लिए अपना विवरण प्रदान करें - <b>नाम, फोन नंबर, आधार संख्या, लिंग, पिनकोड, पता</b>. \n\nउदाहरण के लिए <b>गरिमा नागपाल, 9999999999, 123456789012, महिला, 201010, इंदिरापुरम गाजियाबाद</b>.',
    MULTIOTHERSSKILLMSG: 'कृपया अपना कौशल प्रदान करें। यदि एकाधिक, तो उन्हें अलग से अल्पविराम प्रदान करें। अधिकतम 3 की अनुमति है।',
    DBAPICALL: 'http://localhost/saviours/api/migrants/',
    SUCCESSMESSAGE: 'अपना विवरण प्रदान करने के लिए धन्यवाद। हम आपसे शीघ्र ही संपर्क करेंगे। अधिक अपडेट के लिए आप <b>http://migrantwarriors.com</b> चेक कर सकते हैं।',
    FAILUREDBMESSAGE: 'विवरणों को सहेजने में कुछ त्रुटि है। कृपया 5-10 मिनट के बाद क्लिक /start करके फिर से प्रयास करें।',
    ALREADYEXISTMESSAGE:'विवरण प्रदान करने के लिए धन्यवाद। सिस्टम में आपका विवरण पहले से मौजूद है। हम आपसे शीघ्र ही संपर्क करेंगे।',
    AADHARPPENDINGMESSAGE:'अपना विवरण प्रदान करने के लिए धन्यवाद। वर्तमान में आपका आधार सत्यापन लंबित है। हम आपसे शीघ्र ही संपर्क करेंगे।',
    ALREADYMESSAGE: 'हमें आपका विवरण पहले ही मिल गया है। हम आपसे शीघ्र ही संपर्क करेंगे। अधिक अपडेट के लिए आप <b>http://migrantwarriors.com</b> चेक कर सकते हैं।',
    ENTERDETAILSSUCCESS: 'अपना विवरण प्रदान करने के लिए धन्यवाद। \n\nकृपया नीचे के कीबोर्ड से अपना <b>कौशल</b> चुनें। \n\n<b>यदि सूची में नहीं दिया गया है या एक से अधिक कौशल बहु-कौशल/अन्य का चयन करते हैं।</b>',
    ENTERDETAILSFAILURE: '\n<b>कृपया दिए गए सही प्रारूप में फिर से अपना विवरण दर्ज करें। </b> \n\nउदाहरण के लिए <b>गरिमा नागपाल, 9999999999, 123456789012, महिला, 201010, इंदिरापुरम गाजियाबाद</b>',
    ENTERDETAILSFAILUREMSG: 'अमान्य निवेश। कृपया सभी अनुरोधित जानकारी प्रदान करें।',
    NAMEERRORMSG: '<b>नाम</b> अमान्य है। यह सभी अक्षर होना चाहिए और इसमें कोई विशेष अक्षर शामिल नहीं होना चाहिए।',
    PHONEERRORMSG: '\n<b>फ़ोन नंबर</b> अमान्य है। यह 10 अंकों का होना चाहिए और सभी संख्या होनी चाहिए।',
    AADHARERRORMSG: '\n<b>आधार संख्या</b> अमान्य है। यह 12 अंकों का होना चाहिए और सभी संख्या होनी चाहिए।',
    PINCODEERRORMSG: '\n<b>पिनकोड</b> अमान्य है। यह 6 अंकों का होना चाहिए और सभी संख्या होनी चाहिए।',
    ADDRESSERRORMSG: '\n<b>पता</b> अमान्य है। इसमें - और / के अलावा अन्य विशेष वर्ण शामिल नहीं होने चाहिए।',
    EMPTYSTRING: '',
    COMMASTRING: ',',
    GENDERERRORMSG: '\n<b>लिंग</b> अमान्य है. यह पुरुष या महिला या पारलैंगिक होना चाहिए।',
    MAXSKILLSERRORMSG: 'अधिकतम 3 कौशल की अनुमति दी। कृपया फिर से दर्ज करें।',
    LANGUAGECHOOSEMSG: 'Please choose your <b>preferred Language.</b>\n\nकृपया अपनी <b>पसंदीदा भाषा</b> चुनें।',
    NAMEREGEX: /^[\u0900-\u097F ]+$/,
    ADDRESSREGEX: /^[\u0900-\u097F /-\d]+$/,
    GENDERREGEX: /^(पुरुष|महिला|पारलैंगिक)$/,
    SKILLARR: ["मेसन", "प्लम्बर", "ड्राइवर", "टेलर", "ब्यूटीशियन", "पेंटर", "गार्डनर", "इलेक्ट्रीशियन", "फिटर", "कंस्ट्रक्शन लेबर", "किसान", "हेंपर", "बढ़ई","पोर्टर","सुरक्षा गार्ड","घरेलू मदद","कपड़ा श्रम","हॉकर","लोहार","फैक्टरी कर्मचार ","मोटर मैकेनिक","वेल्डर","प्रिंटिंग वर्क","फाउंड्रीमैन","स्ट्रीट वेंडर","ऑफिस हेल् ","लेदर वर्","रिक्शा पुलर","वेस्ट/स्क्रेप पिकर","प्लास्टिक फैक्ट्री लेबर","बीड़ी फैक्ट्री वर्कर","ब्रसेन किचन वर्क","कसाई","इलेक्ट्रोप्लेटिंग","फिश प्रोसेसिंग","जेम कटिंग","माचिस निर्माण","मिनरल एंड माइन्स वर्","स्कैवेंजिंग","टोबैको प्रोसेसिंग","स्टोन क्रशिंग"],
    SKILLKEYBOARDARRAY:[
                ["बहु-कौशल/अन्य", "मेसन", "प्लम्बर", "ड्राइवर"],
                ["दर्जी", "ब्यूटीशियन", "पेंटर", "माली"],
                ["इलेक्ट्रीशियन", "फिटर", "कंस्ट्रक्शन लेबर", "किसान"],
                ["स्वीपर", "बढ़ई", "पोर्टर", "सुरक्षा गार्ड"],
                ["घरेलू मदद", "कपड़ा श्रम", "हॉकर", "लोहार"],
                ["फैक्टरी कर्मचारी", "मोटर मैकेनिक", "वेल्डर", "प्रिंटिंग वर्क"],
                ["फाउंड्रीमैन", "स्ट्रीट वेंडर", "ऑफिस हेल्प", "लेदर वर्क"],
                ["रिक्शा पुलर", "अपशिष्ट / स्क्रैप पिकर", "प्लास्टिक फैक्टरी श्रम"],
                ["बीड़ी कारखाना कार्यकर्ता", "ईंट भट्ठा काम", "कसाई"],
                ["इलेक्ट्रोप्लेटिंग", "मछली प्रसंस्करण", "जेम कटिंग"],
                ["माचिस निर्माण", "खनिज और खान काम"],
                ["स्कैवेंजिंग", "तंबाकू प्रसंस्करण", "स्टोन क्रशिंग"]
            ]
});