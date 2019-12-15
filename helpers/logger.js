
let LOGS_ENABLED = true;
console.log("Logging is",LOGS_ENABLED?"ON":"OFF");
exports.log = function (...args) {
    if(LOGS_ENABLED) {
        console.log(args.toString().replace(/,/g," "));
    }
} 