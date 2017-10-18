const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');
const inter = require('my-interface');
const em = inter.getInterface();
const config = JSON.parse(fs.readFileSync('./Config/config.json'));
console.log(JSON.stringify(config));
const mysql = require('mysql');
if (config['basic']['storage'] == 'mysql') {
    var connection = mysql.createConnection({
        host: config['mySQL']['host'],
        user: config['mySQL']['username'],
        password: config['mySQL']['password'],
        database: config['mySQL']['database']
    });
}
var defaultPrefix = "!";

// Create the default directories if they don't exist & only in local mode.
if (config['basic']['storage'] == 'local')
{
	// Check if it doesn't exist.
    if (!fs.existsSync('database'))
	{
	    // Create it if it doesn't.
		fs.mkdirSync('database');
	}
    // Check if it doesn't exist.
    if (!fs.existsSync(config['local']['userSettings']))
	{
	    // Create it if it doesn't.
		fs.mkdirSync(config['local']['userSettings']);
	}
	// Check if it doesn't exist.
    if (!fs.existsSync(config['local']['serverSettings']))
	{
	    // Create it if it doesn't.
		fs.mkdirSync(config['local']['serverSettings']);
	}
	// Check if it doesn't exist.
    if (!fs.existsSync(config['local']['Logs']))
	{
	    // Create it if it doesn't.
		fs.mkdirSync(config['local']['Logs']);
	}
}

client.on('ready', () => {
    console.log(`Started up as user ${client.user.username}!`);
    client.user.setGame("with the building blocks of life.");
});

client.on('message', (message) => {
    var msg = message.content;
    var msgLow = msg.toLowerCase();

	// Don't let bots interact with Starie.
    if (message.author.bot) return;

	// Get the prefix of the poster.
    var prefix = getUserPrefix(message.member);
    console.log(prefix);

	// Quickly create the user config when someone new posts a message.
	if (!fs.existsSync(`${config['local']['userSettings']}/${message.author.id}.json`))
	{
	    // Open the user's file.
	    fs.open(`${config['local']['userSettings']}/${message.author.id}.json`, 'wx', () => {
	        // And write the default information to it.
			fs.writeFileSync(`${config['local']['userSettings']}/${message.author.id}.json`, `{"Whitelisted" : false, "Blacklisted" : false, "Permissions" : [], "Prefix" : "!", "Owner" : false, "canBypassPermissions" : false}`);
	    });
	}
	
	// If a message starts with the prefix, check the command.
    if (msgLow.startsWith(prefix)) {
        var cmd = trimPrefix(msg, message.member);
        checkCommand(cmd, message, message.author);
    }

	// Add to the message log.
    try {
        if (config['basic']['storage'] == 'mysql') {
            connection.query(`INSERT INTO messageLog(content,user,guild,nickname,time) VALUES("${connection.escape(msg)}","${connection.escape(message.member.id)}","${connection.escape(message.guild.id)}","${connection.escape(message.member.displayName)}","${connection.escape(new Date())}");`, function(error, results, fields) {
                if (error) throw error;
                console.log(msg);
            });
        } else if (config['basic']['storage'] == 'local') {
            fs.open(config['local']['Logs'] + "/" + config['local']['messageLog'], 'w+', () => {
                fs.appendFileSync(config['local']['Logs'] + "/" + config['local']['messageLog'], `[${message.member.displayName}]: ${message.content}\n\n`);
            });
        }

    } catch (e) {
        console.log(e);
    }
});

client.on('messageReactionAdd', (message, user) => {
    if (message.emoji.name == "ðŸš«") {
        if (message.message.author.bot) {
            message.message.delete();
        }
    }
});

function getUserPrefix(user){
    var prefix = null;

    try {
        if (config['basic']['storage'] == 'mysql') {
            connection.query(`SELECT prefix FROM userPrefixes WHERE user="${connection.escape(user.id)}"`, function(error, results, fields) {
                if (results.length > 0) {
                    prefix = results[0].prefix;
                }
            });
        } else if (config['basic']['storage'] == 'local') {
            var userSettings = JSON.parse(fs.readFileSync(`${config['local']['userSettings']}/${user.id}.json`));
            var serverSettings = JSON.parse(fs.readFileSync(`${config['local']['serverSettings']}/${user.guild.id}.json`));

            if (userSettings["prefix"] != undefined) {
                var userPrefix = userSettings["prefix"];
                return userPrefix;
            } else if (serverSettings["prefix"] != undefined) {
                var serverPrefix = serverSettings["prefix"];
                return serverPrefix;
            } else {
                return defaultPrefix;
            }
        }
    } catch (e) {
        console.log(e);
    }

    if (prefix == undefined) {
        try {
            if (config['basic']['storage'] == 'mysql') {
                connection.query(`SELECT prefix FROM serverSettings WHERE guildID="${connection.escape(user.guild.id)}"`, function(error, results, fields) {
                    if (results.length) {
                        prefix = results[0].prefix;
                    }
                });
            }
        } catch (e) {
            console.log(e);
        }
    }

    if (prefix == undefined) {
        prefix = defaultPrefix;
    }


    return prefix;
}

// Trim the prefix from the message.
function trimPrefix(message, user) {
    // Get the user's prefix.
    var prefix = getUserPrefix(user);

    // Return the trimmed version.
    return message.slice(prefix.length, message.length);
}

function checkCommand(mess, message, user, other = null, other2 = null) {
    // Log the message.
    console.log(mess)

    // Check if the message contains a colon.
    if (mess.toLowerCase().indexOf(':') != -1) {
        // If it does, it cut at the colon.
        var command = mess.toLowerCase().slice(0, mess.toLowerCase().indexOf(':'));
    } else {
        // If not, copy the entire message.
        var command = mess;
    }

    // Collect all the arguments into a string.
    var arguments = mess.toLowerCase().slice(mess.toLowerCase().indexOf(':') + 2, mess.toLowerCase().length);

    // Convert it into an array.
    var args = arguments.split(" | ");

    // Then log both the command and the number of arguments.
    console.log(args.length)
    console.log(command);

    // Try/Catch the contents.
    try {
        // Sniff through the various folders, and find the one you want.
        var folders = fs.readdirSync('Commands');

        // Create an empty variable for the command name.
        var file;

        // Loop through all the folders, and see if it's there.
        for (var i in folders) {
            console.log(folders[i]);
            var f = String('Commands/' + String(folders[i]) + '/' + command + '.js');

            if (fs.existsSync(f)) {
                file = f;
                console.log(f);
                break;
            }
        }

        // Log the file name.
        console.log(file);

        // Read the file.
        var contents = String(fs.readFileSync(f));

        // Log various things.
        console.log('Loaded command: ' + command + '.js');
        console.log(contents);
    } catch (e) {
        console.log(e);
    }

    try {
        // Run the command within the file.
        eval(contents)

        // And log the use of the command.
        if (config['basic']['storage'] == 'mysql') {
            connection.query(`INSERT INTO commandLog(commandName,user,guild,nickname,time) VALUES("${connection.escape(command)}", "${connection.escape(user.id)}", "${connection.escape(message.guild.id)}", "${connection.escape(message.member.displayName)}", "${connection.escape(new Date())}");`, function(error, results, fields) {

                if (error) throw error;
            });
        }
    } catch (e) {
        try {
            var d = new Date();


            if (config['basic']['storage'] == 'mysql') {
                connection.query(`INSERT INTO errorLog(info,time) VALUES("${connection.escape(e)}","${connection.escape(d)}");`, function(error, results, fields) {

                });
            } else if (config['basic']['storage'] == 'local') {
                fs.open(config['local']['Logs'] + "/" + config['local']['errorLog'], 'w+', () => {
                    fs.appendFileSync(config['local']['Logs'] + "/" + config['local']['errorLog'], `${e}`);
                });
            }
        } catch (e) {
            console.log(e);
        }

        console.log(e)
    }
}

function canBypassPermissions(user) {
    // Get the JSON with all the owners.
    var userSettings = JSON.parse(fs.readFileSync(`${config['local']['userSettings']}/${user.id}`));

    // Check if you are in it.
    if (userSettings['canBypassPermissions'] != undefined && userSettings['canBypassPermissions'] == true) {
        return true;
    } else {
        return false;
    }
}


client.login(config['basic']['token']);
