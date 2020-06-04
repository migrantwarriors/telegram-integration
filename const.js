module.exports = Object.freeze({
    ENTERDETAILS: 'Please provide your details for employment in the given format - <b>name, phonenumber, aadharnumber, pincode, address</b>. \n\nFor eg. <b>garishma nagpal, 9999999999, 123456789012, 201010, Indirapuram Ghaziabad</b>.',
    MULTIOTHERSSKILL: 'Please provide your skill. If multiple, then provide them comma separated.',
    DBAPICALL: 'http://localhost:5000/api/migrants',
    SUCCESSMESSAGE: 'Thank You for providing your details. We will contact you shortly. You may check <b>http://migrantwarriors.com</b> for more updates.',
    FAILUREDBMESSAGE: 'There is some error in saving the details. Please try again.',
    ALREADYMESSAGE: 'We have already got your details. We will contact you shortly. You may check <b>http://migrantwarriors.com</b> for more updates.',
    ENTERDETAILSSUCCESS: 'Thank You for providing your details. \n\nPlease select your <b>skills:</b> \n1. Carpenter\n2. Mason\n3. Plumber\n4. Tailor\n5. Beautician\n6. Painter\n7. Electrician\n8. Fitter\n9. Construction Labour\n10. Multi-Skill/Others \n\n<b>If not given in the list or more than one skill select Multi-Skill/Others.</b>',
    ENTERDETAILSFAILURE: '\n<b>Please enter your details again in correct format as given. </b> \n\nFor eg. <b>garishma nagpal, 9999999999, 123456789012, 201010, Indirapuram Ghaziabad</b>',
    ENTERDETAILSFAILUREMSG: 'Invalid input. All five values are not given.',
    NAMEERRORMSG: '<b>Name</b> is invalid. It should be all letters.',
    PHONEERRORMSG: '\n<b>Phone number</b> is invalid. It should be 10 in length and all should be numbers.',
    AADHARERRORMSG1: '\n<b>Aadhar number</b> is invalid. It should be 12 in length and all should be numbers.',
    PINCODEERRORMSG: '\n<b>Pincode</b> is invalid. It should be 6 in length and all should be numbers.',
    ADDRESSERRORMSG: '\n<b>Address</b> is invalid. It should not include any special character.',
    EMPTYSTRING: '',
    COMMASTRING: ','
});
