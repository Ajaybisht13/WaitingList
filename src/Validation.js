
export function userEmail(useremail) {
    var validReg = /^[a-zA-Z0-9.]+@[a-zA-Z0-9.]+\.[a-zA-Z]{2,4}/;
    if (useremail.match(validReg)) {
        console.log("Valid email address!");
        return true;
    } else {
        console.log("Invalid email address!");
        return false;
    }
}

export function userPassword(userpassword) {

    var passw = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
    if (userpassword.match(passw) && userpassword != "") {
        console.log('Correct')
        // var status = true
        return true;
    }
    else {
        console.log('Wrong...!')
        return false;
    }
}

export function checkPhone(userphone) {
    var mob = /^[7-9]{1}[0-9]{9}$/;
    if (mob.test(userphone) == false) {
        return false;
    } else {
        console.log("ffhfhfhhf");
        return true;
    }
}

export function checkPincode(pinCode) {
    let numreg = /^\d{6}$/;
    if (pinCode.match(numreg)) {
        return true
    } else {
        return false
    }
}

export function countryCode(countrycode) {

    var regex = /^\+(\d{1}\-)?(\d{1,3})$/
    if (countrycode.match(regex)) {
        return true
    } else {
        return false
    }
}
export function normalAZtext(normaltext) {
    var regName = /^[A-Za-z ]+$/;
    if (normaltext != undefined) {
        if (normaltext.match(regName)) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}
export function gstNumber(gstnumber) {

    var regName = "^[0-9]{2}[A-Z]{5}[0-9]{4}" + "[A-Z]{1}[1-9A-Z]{1}" + "Z[0-9A-Z]{1}$";
    if (gstnumber.match(regName)) {
        return true;
    } else {
        return false;
    }
}


export function validateNumber(number) {
    const pattern = /[0-9]|\./;
    if (number.match(pattern)) {
        return true
    } else {
        return false
    }
}