const c = require("ansi-colors");
const moment = require("moment");

module.exports = (client) => {

    // Creates a colored timestamp to use in the log
    const timeStamp = `${c.bgCyan.white.bold(` ${moment().format("YYYY-MM-DD | HH:mm:ss")} `)}`

    // Add padding around the log action, to create some uniformed logs - recursive function
    const pad = (width, string, padding) => {
        return (width <= string.length) ? string : pad(width, padding + string + padding, padding)
    }

    // Makes the string even in length so the padding function looks even. 
    const formatText = (string) => {
        const evenString = string.length % 2 == 0 ? string : `${string} `
        return evenString.toUpperCase()
    }

    const logTag = (tag, bgColor, text = "white") => { return c[bgColor][text].bold(` [ ${pad(8, formatText(tag), " ")} ] `) }
    const logAction = (action, bgColor) => { return c[bgColor].gray.bold(` [ ${pad(28, formatText(action), " ")} ] `) }

    // Checks the CLI flags to ensure the log should be sent. 
    const shouldLog = (loglevel) => {
        const requestedLogLevel = client.cliFlags.verbosity ? client.cliFlags.verbosity : 0
        return loglevel <= requestedLogLevel;
    }

    /**
     * A function to create a standard log.
     * @param {Number} verbosityLevel - 0: Always logs | 1: High priority | 5: Debug Only
     * @param {string} action - Short action that will be displayed in the whitebox.
     * @param {string} logContent - The main content of the log
     * @param {string} bgColor - defaults to 'bgWhite', this controls the action bg
     */
    const defaultLog = (verbosityLevel, action, logContent, bgColor = "bgWhite") => {
        if (!shouldLog(verbosityLevel)) return;

        return console.log(
            timeStamp,
            logTag("LOG", "bgBlue"),
            logAction(action, bgColor),
            logContent
        )
    }

    /**
     * A function to create a standard log.
     * @param {Number} verbosityLevel - 0: Always logs | 1: High priority | 5: Debug Only
     * @param {string} action - Short action that will be displayed in the whitebox.
     * @param {string} logContent - The main content of the log
     * @param {string} bgColor - defaults to 'bgWhite', this controls the action bg
     */
    const debugLog = (verbosityLevel, action, logContent, bgColor = "bgWhite") => {
        if (!shouldLog(verbosityLevel)) return;
        return console.log(
            timeStamp,
            logTag("DEBUG", "bgMagentaBright"),
            logAction(action, bgColor),
            logContent
        )
    }

    /**
     * A function to create a standard log.
     * @param {Number} verbosityLevel - 0: Always logs | 1: High priority | 5: Debug Only
     * @param {string} action - Short action that will be displayed in the whitebox.
     * @param {string} logContent - The main content of the log
     * @param {string} bgColor - defaults to 'bgWhite', this controls the action bg
     */
    const errorLog = (verbosityLevel, action, logContent, whPayload = null, bgColor = "bgWhite") => {
        if (!shouldLog(verbosityLevel)) return;

        if (whPayload) client.sendWebhook("generalLogs", {
            title: whPayload.title ? whPayload.title : `${action.toUpperCase()} - ERROR`,
            avatar: whPayload.avatar ? whPayload.avatar : "https://www.setra.com/hubfs/Sajni/crc_error.jpg",
            desc: whPayload.desc ? whPayload.desc : logContent,
            color: whPayload.color ? whPayload.color : "red",
            fields: whPayload.fields ? whPayload.fields : null,
        })

        return console.log(
            timeStamp,
            logTag("ERROR", "bgRed"),
            logAction(action, bgColor),
            logContent
        )
    }

    /**
     * A function to create a standard log.
     * @param {Number} verbosityLevel - 0: Always logs | 1: High priority | 5: Debug Only
     * @param {string} action - Short action that will be displayed in the whitebox.
     * @param {string} logContent - The main content of the log
     * @param {string} bgColor - defaults to 'bgWhite', this controls the action bg
     */
    const systemLog = (verbosityLevel, action, logContent, bgColor = "bgWhite") => {
        if (!shouldLog(verbosityLevel)) return;
        return console.log(
            timeStamp,
            logTag("SYSTEM", "bgGreen"),
            logAction(action, bgColor),
            logContent
        )
    }

    /**
     * A function to create a standard log.
     * @param {Number} verbosityLevel - 0: System & Errors | 1: High priority | 5: Debug Only
     * @param {string} action - Short action that will be displayed in the whitebox.
     * @param {string} logContent - The main content of the log
     * @param {string} bgColor - defaults to 'bgWhite', this controls the action bg
     */
    const infoLog = (verbosityLevel, action, logContent, bgColor = "bgWhite") => {
        if (!shouldLog(verbosityLevel)) return;
        return console.log(
            timeStamp,
            logTag("INFO", "bgYellow", "black"),
            logAction(action, bgColor),
            logContent
        )
    }

    const newLoggers = { defaultLog: defaultLog, debugLog: debugLog, errorLog: errorLog, systemLog: systemLog, infoLog: infoLog }
    Object.assign(client, newLoggers);

};
