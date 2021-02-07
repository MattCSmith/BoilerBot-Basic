const { readdirSync } = require("fs");
const CliTable = require("cli-table3");
const colors = require("ansi-colors");

// ##################################################################################
// #                            FUNCTION HANDLER                                    #
// ##################################################################################
// #                                                                                #
// #  This handler will process each item inside of the /functions/ directory       #
// #  Loading each item into memory where possible and report back the status.      #
// #                                                                                #
// ##################################################################################

// Declare a new cli-table and configure it
const functionTable = new CliTable({
    head: [
        colors.bold.bgCyan.white(" FUNCTION "),
        colors.bgCyan.white(" LOAD STATUS "),
    ],
});

// Declare a stats variable we can use in the table to display how many functions were loaded
const stats = {
    total: 0,
    failed: 0,
    loaded: 0,
};

module.exports = (client) => {
    // Read everything inside of the /functions/ directory, using the 'withFileTypes' param will
    // let us check if its a file or directory.
    readdirSync("./functions/", { withFileTypes: true }).forEach((item) => {
        // If the item being read is a 'File', report it
        if (item.isFile()) {
            functionTable.push([
                item.name,
                " ❌ File cannot be in the events root, must be inside a folder!",
            ]);
            stats.failed++;
            stats.total++;
            return;
        }

        // Otherwise delcare the current function directory, this will be an array of the files in the directory
        const currentFunctionFiles = readdirSync(`./functions/${item.name}/`);

        // Ensure the directory isnt empty
        if (currentFunctionFiles.length === 0) {
            functionTable.push([
                `${item.name}`,
                colors.yellow(`  ⚠  Directory is empty!`),
            ]);
            stats.failed++;
            stats.total++;
        }

        // Now we loop through each file in the directory looking for the correct file
        for (let file of currentFunctionFiles) {
            try {
                // If the file is not the main function file move on to the next file
                if (file !== `${item.name}.function.js`) continue;

                // Load the function
                require(`../functions/${item.name}/${item.name}.function.js`)(
                    client
                );

                // Adjust the stats accordinly so we can use them in the table
                stats.total++;
                stats.loaded++;

                // Add a row to the cli table, which we will log once everything is loaded
                functionTable.push([item.name, colors.green(" ✅ Loaded! ")]);
            } catch (error) {
                // If there is an error we will log it, update the stats and table
                console.error(error);
                functionTable.addRow([item.name, " ❌ Unknown Error! "]);
                stats.failed++;
                stats.total++;
            }
        }
    });

    // Add the stats to the bottom of the table
    functionTable.push(
        [],
        [
            colors.greenBright(`LOADED: ${stats.loaded}`),
            colors.red(`FAILED: ${stats.failed}`),
        ]
    );
    // Output the cli-table
    console.log(functionTable.toString());
};
