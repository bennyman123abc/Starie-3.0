//permission: Everyone;
//usage: <text>;
//module: FUN;
// Check how many arguments exist.
if (args.length != 1){
    // If there's less than or more than 1, stop it.
    message.reply("Only 1 argument is allowed!")
}
else{
    // Reply the text.
    message.reply(args[0]);
    
    // Delete the previous message.
    message.delete();
}
