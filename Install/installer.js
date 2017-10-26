const readline = require('readline');
const fs = require('fs');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
rl.question('Input the ID of the user whom you want to be owner:\n', (answer) => {
    if (answer.length == 18)
    {
        fs.open(`../../database/Users/${answer}.json`, 'w+', () => {
            fs.writeFileSync(`././database/Users/${answer}.json`, '{"Whitelisted" : true, "Blacklisted" : false, "Permissions" : ["Alpha","Beta"], "Prefix" : "?", "Owner" : true, "canBypassPermissions" : true}');
        });
                    
	    console.log(`Set the Super Owner to ${answer}.`);
		rl.question("Input a default prefix:\n", (answer) => {
			if (answer.length > 0 || answer.length < 3)
			{
				var conf = JSON.parse(fs.readFileSync("././Config/config.json"));
				conf['basic']['defaultPrefix'] = answer;
				fs.writeFileSync("././Config/config.json", JSON.stringify(conf));
				console.log(`Set default prefix to ${answer}.`);
			
				rl.question("Input a startup status message:\n", (answer) => {
					var conf = JSON.parse(fs.readFileSync("././Config/config.json"));
					conf['basic']['game'] = answer;
					fs.writeFileSync("././Config/config.json", JSON.stringify(conf));
					console.log(`Set start up status message to ${answer}.`);
					console.log("Starie set up complete, please restart the application for changes to show up!");
					fs.unlinkSync("././Commands/Administration/install.js");
					fs.unlinkSync("././Install/installer.js")
					fs.rmdirSync("././Install");
				});
			}
			else
			{
				console.log("Invalid default prefix length, using !.");
				var conf = JSON.parse(fs.readFileSync("././Config/config.json"));
				conf['basic']['defaultPrefix'] = "!";
				fs.writeFileSync("././Config/config.json", JSON.stringify(conf));
			}
	    });
	}
    else
    {
        console.log("Invalid ID, using the !install sender as the owner.");
		fs.open(`../../database/Users/${message.author.id}.json`, 'w+', () => {
            fs.writeFileSync(`././database/Users/${message.author.id}.json`, '{"Whitelisted" : true, "Blacklisted" : false, "Permissions" : ["Alpha","Beta"], "Prefix" : "?", "Owner" : true, "canBypassPermissions" : true}');
        });
    }
});
