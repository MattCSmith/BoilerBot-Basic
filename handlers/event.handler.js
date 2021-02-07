const { readdirSync } = require("fs");
const CliTable = require("cli-table3");
const colors = require("ansi-colors");

// ##################################################################################
// #                            EVENT HANDLER                                       #
// ##################################################################################
// #                                                                                #
// #  This handler will first process each item inside of the /events/ directory    #
// #  Loading each item into memory where possible and reporting back the status.   #
// #                                                                                #
// ##################################################################################

// Declare a new cli-table and configure it
const eventTable = new CliTable({
    head: [
        colors.bold.bgMagenta.white(" EVENT "),
        colors.bgMagenta.white(" LOAD STATUS "),
    ],
});

// Declare a stats variable we can use in the table to display how many events were loaded
const stats = {
    total: 0,
    failed: 0,
    loaded: 0,
};

module.exports = (client) => {
    // Read everything inside of the /events/ directory, using the 'withFileTypes' param will
    // let us check if its a file or directory.
    readdirSync("./events/", { withFileTypes: true }).forEach((item) => {
        // If the item being read is a 'File', report it
        if (item.isFile()) {
            eventTable.push([
                item.name,
                " ❌ File cannot be in the events root, must be inside a folder!",
            ]);
            stats.failed++;
            stats.total++;
            return;
        }

        // Otherwise delcare the current event directory, this will be an array of the files in the directory
        const currentEventFiles = readdirSync(`./events/${item.name}/`);

        // Ensure the directory isnt empty
        if (currentEventFiles.length === 0) {
            eventTable.push([
                `${item.name}`,
                colors.yellow(`  ⚠  Directory is empty!`),
            ]);
            stats.failed++;
            stats.total++;
        }

        // Now we loop through each file in the directory looking for the correct file
        for (let file of currentEventFiles) {
            try {
                // If the file is not the main event file move on to the next file
                if (file !== `${item.name}.event.js`) continue;

                // Otherwise we declare the events file
                let event = require(`../events/${item.name}/${item.name}.event.js`);

                // Adjust the stats accordinly so we can use them in the table
                stats.total++;
                stats.loaded++;

                // Load the event
                client.on(item.name, event.bind(null, client));

                // Add a row to the cli-table, which we will log once everything is loaded
                eventTable.push([item.name, colors.green(" ✅ Loaded!")]);
            } catch (error) {
                // If there is an error we will log it, update the stats and table
                console.error(error);
                eventTable.push([item.name, colors.red(" ❌ Unknown Error!")]);
                stats.failed++;
                stats.total++;
            }
        }
    });

    // Add the stats to the bottom of the table
    eventTable.push(
        [],
        [
            colors.greenBright(` ✅ LOADED: ${stats.loaded} `),
            colors.red(` ❌ FAILED: ${stats.failed} `),
        ]
    );
    // Output the cli-table
    console.log(eventTable.toString());
};
