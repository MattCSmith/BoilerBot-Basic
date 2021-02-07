const { readdirSync } = require("fs");
const CliTable = require("cli-table3");
const colors = require("ansi-colors");

// ################################################################################## //
// #                             COMMAND HANDLER                                    # //
// ################################################################################## //
// #                                                                                # //
// #  This handler will process each item inside of the /commands/ directory        # //
// #  Loading each item into memory where possible and report back the status.      # //
// #                                                                                # //
// ################################################################################## //

// Declare a new cli-table and configure it
const cTable = new CliTable({
    head: [
        colors.bold.bgBlue.white(" COMMAND "),
        colors.bgBlue.white(" LOAD STATUS "),
    ],
});

// Declare a stats variable we can use in the table to display how many commands were loaded
const stats = {
    total: 0,
    failed: 0,
    loaded: 0,
};

module.exports = (client) => {
    // Fetch the command prefix
    const PREFIX = client.settings.general.prefix
        ? client.settings.general.prefix
        : "{PREFIX_HERE}";
    // Read everything inside of the /commands/ directory, using the 'withFileTypes' param will
    // let us check if its a file or directory.
    readdirSync("./commands/", { withFileTypes: true }).forEach((item) => {
        // If the item being read is a 'File', report it
        if (item.isFile()) {
            cTable.push([
                item.name,
                colors.red(
                    " ❌ File cannot be in the commands root, must be inside a folder!"
                ),
            ]);
            stats.failed++;
            stats.total++;
            return;
        }

        // Otherwise delcare the current command directory, this will be an array of the files in the directory
        const currentcommandFiles = readdirSync(`./commands/${item.name}/`);

        // Ensure directory isnt empty
        if (currentcommandFiles.length === 0) {
            cTable.push([
                `${PREFIX}${item.name}`,
                colors.yellow(`  ⚠  Directory is empty!`),
            ]);
            stats.failed++;
            stats.total++;
        }

        // Now we loop through each file in the directory looking for the correct file
        for (let file of currentcommandFiles) {
            try {
                // If the file is not the main command file move on to the next file
                if (file !== `${item.name}.command.js`) continue;

                // Otherwise lets declare the commands file
                let thecommand = require(`../commands/${item.name}/${item.name}.command.js`);

                // Check if the command has a Meta Export
                if (thecommand.meta === undefined) {
                    cTable.push([
                        `${PREFIX}${item.name}`,
                        colors.red(" ❌ Meta Export Missing!"),
                    ]);
                    stats.failed++;
                    stats.total++;
                } else if (!thecommand.meta.name) {
                    cTable.push([
                        `${PREFIX}${item.name}`,
                        colors.red(` ❌ Help.name Missing!`),
                    ]);
                    stats.failed++;
                    stats.total++;
                    continue;
                }

                // Load the command if the command file has a command name in the Meta Section
                else if (thecommand.meta.name) {
                    client.commands.set(thecommand.meta.name, thecommand);
                    cTable.push([
                        `${PREFIX}${thecommand.meta.name}`,
                        colors.green(" ✅ Loaded!"),
                    ]);
                    stats.loaded++;
                    stats.total++;
                }

                // Else log report it as failed
                else {
                    cTable.push([
                        `${PREFIX}${item.name}`,
                        colors.red(` ❌ Something is wrong with the cmd meta`),
                    ]);
                    stats.failed++;
                    stats.total++;
                }
            } catch (error) {
                // If there is an error we will log it, update the stats and table
                console.error(error);
                if (error.code === "MODULE_NOT_FOUND") {
                    cTable.push([
                        `${PREFIX}${item.name}`,
                        colors.red(` ❌ Index file not found!`),
                    ]);
                } else {
                    cTable.push([
                        `${PREFIX}${item.name}`,
                        colors.red(` ❌ Unknown Error!`),
                    ]);
                }

                stats.failed++;
                stats.total++;
            }
        }
    });

    // Add the stats to the bottom of the table
    cTable.push(
        [],
        [
            colors.greenBright(` ✅ LOADED: ${stats.loaded} `),
            colors.red(` ❌ FAILED: ${stats.failed} `),
        ]
    );
    // Output the table
    console.log(cTable.toString());
};
