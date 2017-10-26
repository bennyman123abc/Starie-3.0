//permission: Everyone;
//usage: <number> | <number>;
//module: FUN;
// If there isn't 2 arguments, error.
if (args.length != 2) {
    message.reply(errorStrings["commands"]["arguments"]);
    return;
}
else {
    // Parse number 1.
    try {
        var num1 = parseFloat(args[0]);
    }
    catch(e) {
        message.reply(args[0] + " is not a valid number!");
    }

    // Parse number 2.
    try {
        var num2 = parseFloat(args[1]);
    }
    catch(e) {
        message.reply(args[1] + " is not a valid number!");
    }

    // Add it and post it.
    var num3 = num1 + num2;
    message.reply(String(num3));
}
