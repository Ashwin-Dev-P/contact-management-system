module.exports = async function validEmail(emailToValidate) {



    const emailRegexp = /^[a-zA-Z0-9.! #$%&'*+/=? ^_`{|}~-]+@[a-zA-Z0-9-]+(?:\. [a-zA-Z0-9-]+)*$/;

    return emailRegexp.test(emailToValidate);
};