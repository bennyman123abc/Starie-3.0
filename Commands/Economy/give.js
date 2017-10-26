//permission: Everyone;
//usage: <amount> | <userResolve>;
//module: GLOBAL_ECONOMY;
// Make sure there are 2 arguments
if (args.length == 2) {

    if (isOwner(message.author.id, message.guild.id)) {
        // Get the server.
        var server = JSON.parse(String(fs.readFileSync(`./././${config["local"]["serverSettings"]}/${message.guild.id}.json`)));

        // Get the user and their information
        var user = getUserResolvable(args[1], message.guild.id);

        var userInfo = JSON.parse(String(fs.readFileSync(`./././${config["local"]["userSettings"]}/${user.id}.json`)));

        // Get the user's current amount of money
        if (userInfo["money"] == undefined) {
            var currentMoney = 0;
        } else {
            var currentMoney = userInfo["money"];
        }

        // Add the money
        userInfo["money"] = currentMoney + args[0];
        fs.writeFileSync(`./././${config["local"]["userSettings"]}/${user.id}.json`, JSON.stringify(userInfo));

        // Send confirmation message
        message.reply("You now have $" + String(userInfo["money"]) + ".")
    }
} else {
    message.reply(errorStrings["commands"]["arguments"]);
}
