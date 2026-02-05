require('dotenv').config();
const readline = require("readline");
const { isUint8ClampedArray } = require('util/types');

const io = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let attempts = 0;
const MAX_ATTEMPTS = 3;
const puid = process.env.UID;
const ppswd = process.env.PSWD;

function authenticateUser(step, userContext = "") {
    let remaining = MAX_ATTEMPTS - attempts;

    if (remaining <= 0) {
        console.log("! You are out of attempts. Access Denied.");
        io.close();
        return;
    }

    if (step === "uid") {
        io.question('What is your UID? ', (input) => {
            if (input === puid) {
                authenticateUser("password", input);
            } else {
                attempts++;
                console.log(`Incorrect UID. ${MAX_ATTEMPTS - attempts} attempts left.`);
                authenticateUser("uid");
            }
        });
    } 
    
    else if (step === "password") {
        io.question(`What is your Password, ${userContext}? `, (input) => {
            if (input === ppswd) {
                console.log('Login Successful! Welcome.');
                io.close();
            } else {
                attempts++;
                console.log(`Incorrect Password. ${MAX_ATTEMPTS - attempts} attempts left.`);
                authenticateUser("password", userContext);
            }
        });
    }
}

function main() {
    // Hidden start
    console.warn('--- Secure Terminal ---');
    authenticateUser("uid");
}

main();