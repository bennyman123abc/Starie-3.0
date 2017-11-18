//permission: Everyone;
//usage: Nothing;
//module: RPG;
// Get the user by resolvable.
var user = JSON.parse(String(fs.readFileSync(`./././${config["local"]["userSettings"]}/${message.author.id}.json`)));
var server = JSON.parse(String(fs.readFileSync(`${config['local']['serverSettings']}/${message.guild.id}.json`)));

// Check if you have a character.
if (user["stats"] != undefined) {
    // Procedurely generate the item list.
    var list = generateShopList();

    // Get the items and list them.
    var emb = new Discord.RichEmbed();

    // Loop through shoplist and add each item.
    for (var i in list) {
        // Default might.
        var cMight = 0;

        // Get that type's current might level.
        if (user["stats"]["equipment"][list[i]["type"]] != null) {
            cMight = user["stats"]["equipment"][list[i]["type"]]["might"];
        }

        var info = `Relative Strength: ${list[i]["might"] - cMight},\nPrice: $${list[i]["price"]}`;
        console.log(info);

        // Add a Rich Embed field.
        emb.addField(list[i]["name"], info);
    }

    // Send the embed.
    message.channel.send("Enter the name of the item you wish to buy. Seperate item names with commas to purchase multiple or type `cancel` to cancel.", {
        embed: emb
    });

    // Create a message collector
    const collector = message.channel.createMessageCollector(m => m.author.id == message.author.id, {
        time: 50000
    });

    collector.on('collect', m => {
        console.log(`Collected ${m.content}`);

        if (m.content.toUpperCase() != "CANCEL") {
            // Split by commas.
            var items = m.content.split(",");

            // Purchase list.
            var purchaseList = "";

            // The total price of the purchases.
            var price = 0;

            // Get the user by resolvable.
            var user = JSON.parse(String(fs.readFileSync(`./././${config["local"]["userSettings"]}/${message.author.id}.json`)));

            // Loop through each item and do things based on the item.
            for (var i in items) {
                var itemName = items[i].toUpperCase().replace(/ /g, "_");
                console.log(`Passed with: ${itemName}!`);
                if (list[itemName] != undefined) {
                    if (user["money"] >= list[itemName]["price"]) {
                        console.log(`Added ${itemName} to the list!`);
                        purchaseList = purchaseList + ` ${items[i]},`;

                        // Equip it.
                        if (user["stats"]["equipment"][list[itemName]["type"]] == undefined) {
                            user["stats"]["equipment"][list[itemName]["type"]] = null;
                        }

                        user["stats"]["equipment"][list[itemName]["type"]] = {
                            "name": list[itemName]["name"],
                            "might": list[itemName]["might"]
                        };

                        if (server["modules"]["GLOBAL_ECONOMY"] == true) {
                            user["money"] -= list[itemName]["price"];
                        } else {
                            if (server["economy"][message.author.id] == undefined) {
                                server["economy"][message.author.id] = 0;
                            }

                            server["economy"][message.author.id] -= list[itemName]["price"];
                        }

                        price += list[itemName]["price"]
                    }
                }
            }

            if (purchaseList != "") {
                message.reply(`Purchased: ${purchaseList} for ${price} successfully!`);
            } else {
                message.reply("Couldn't afford anything of the items/Items aren't for sale!");
            }

            // Save the file.
            fs.writeFileSync(`./././${config["local"]["userSettings"]}/${message.author.id}.json`, JSON.stringify(user));

            collector.stop();
        } else {
            collector.stop();
        }
    });

    collector.on('end', (collected, reason) => {
        if (reason == "time") {
            message.reply("Timed out.");
        }
        console.log(`Collected ${collected.size} items`)
        console.log(reason);
    });
}

// Generate the list.
function generateShopList() {
    console.log("Called the list generator");
    // Blank shop list.
    var shopList = {};

    // Loop through item types and create the list.
    for (var i = 0; i < 5; i++) {
        // Materials
        var mats = ["Enchanted", "Copper", "Leather", "Iron", "Silver"];
        // Generate the list.
        material = mats[Math.floor(Math.random() * mats.length)];

        console.log(material);

        // Choose Item type.
        var types = ["Sword", "Amulet", "Boots", "Pants", "Chestplate", "Helmet"];


        // Check what is what.
        if (material == "Leather") {
            // Avaliable types based on the material.
            var avaTypes = ["Chestplate", "Pants", "Boots", "Helmet"];

            // Choose the type.
            var type = avaTypes[Math.floor(Math.random() * avaTypes.length)];

            // Choose the might based on the material.
            var might = type.length + (material.length / 2) + (user["stats"]["level"] * 2);

            // Generate price.
            var price = (type.length * 4) + (material.length * 8 / 2) + (user["stats"]["level"] * 2);

            var item = {
                "type": type,
                "might": might,
                "name": `${material}`,
                "price": price
            };
            // Generate the name.
            var name = (material + " " + type).replace(/ /g, "_");

            // Add it to the list.
            shopList[name.toUpperCase()] = item;
        } else {
            // Avaliable types based on the material.
            var avaTypes = types;

            // The stat variation.
            var variation = Math.floor(Math.random() * 10);

            // Choose the type.
            var type = avaTypes[Math.floor(Math.random() * avaTypes.length)];

            if (type == "Voice Changer") {
                mats = ["Darth Vader", "General Grevious", "Solid Snake", "Salvador"];

                // Generate the list.
                material = mats[Math.floor(Math.random() * mats.length)];
            }

            // Choose the might based on the material.
            var might = type.length + material.length + (user["stats"]["level"] * 2) + variation;

            // Generate price.
            var price = (type.length * 4) + (material.length * 8) + (user["stats"]["level"] * 2) + variation;

            var item = {
                "type": type,
                "might": might,
                "name": `${material}`,
                "price": price
            };

            // Generate the name.
            var name = (material + " " + type).replace(/ /g, "_");

            // Add it to the list.
            shopList[name.toUpperCase()] = item;

            console.log(name);
        }
    }

    // Return the value.
    return shopList;
}
