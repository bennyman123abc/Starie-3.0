//permission: Everyone;
//usage: <amount> | <userResolve>;
//module: ECONOMY;

// Make sure there are 2 arguments
if (args != 2) {
    message.reply(errorStrings["commands"]["arguments"]);
    return;
}

// Get the server.
var server = JSON.parse(String(fs.readFileSync(`./././${config["local"]["serverSettings"]}/${message.guild.id}.json`)));

// Make sure that the module is enabled before continuing. If it isn't, we just quit from here.
if (server["modules"]["GLOBAL_ECONOMY"] == false)
{
    message.reply(String(errorStrings['modules']['globalEconomy']));
    return;
}

// Get the user and their information
var user = getUserResolvable(args[1], message.guild.id);

var userInfo = JSON.parse(String(fs.readFileSync(`./././${config["local"]["userSettings"]}/${user.id}.json`)));

// Get the user's current amount of money
if (userInfo["money"] == undefined){
    var currentMoney = 0;
}

else {
    var currentMoney = userInfo["money"];
}

// Add the money
userInfo["money"] = currentMoney + args[0];
fs.writeFileSync(`./././${config["local"]["userSettings"]}/${user.id}.json`, JSON.stringify(userInfo));

// Send confirmation message
message.reply("You now have $" + String(userInfo["money"]) + ".")