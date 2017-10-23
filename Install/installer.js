const readline = require('readline');
const fs = require('fs');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
var loop = true;

while (loop) {
    loop = false;
    rl.question('Input the ID of the user whom you want to be owner:\n', (answer) => {
        if (answer.length == 18)
        {
            fs.open(`../../database/Users/${answer}.json`, 'w', () => {
                fs.writeFileSync(`../../database/Users/${answer}.json`, '{"Whitelisted" : true, "Blacklisted" : false, "Permissions" : ["Alpha","Beta"], "Prefix" : "?", "Owner" : true, "canBypassPermissions" : true}');
            });
                    
	          console.log("Set the Super Owner to " + answer);
        }
        else
        {
            console.log("This ID isn't valid, it MUST be exactly 18 characters.");
            loop = true;
        }
    });
}

loop = true;

while (loop) 
{
    loop = false;
    rl.question("Input a default prefix.", (answer) => {
        if (answer.length > 0 || answer.length < 3)
        {
            var conf = JSON.parse(fs.readFileSync("../../Config/config.json"));
            conf['basic']['defaultPrefix'] = answer;
            fs.writeFileSync("../../Config/config.json", JSON.stringify(conf));
        }
        else
        {
            console.log("The default prefix MUST be 3 characters or less."); 
        }
    })
}

loop = true;

while (loop) 
{
    loop = false;
    rl.question("Input a startup status message.", (answer) => {
        var conf = JSON.parse(fs.readFileSync("../../Config/config.json"));
        conf['basic']['game'] = answer;
        fs.writeFileSync("../../Config/config.json", JSON.stringify(conf));
    })
}
