//permission: Everyone
//usage: <number> | <number>
if (args.length != 2){
    message.reply("2 arguments are required!");
}
else{
    // Num1
    try{
        var num1 = parseFloat(args[0]);
    }
    catch{
        message.reply(args[0] + " is not a valid number!");
        return;
    }

    // Num2
    try{
        var num2 = parseFloat(args[1]);
    }
    catch{
        message.reply(args[1] + " is not a valid number!");
        return;
    }

    // Add
    var num3 = num1 + num2;
    message.reply(String(num3));
}