module.exports = {
    loggingEnabled: false,

    logServerRouteUpload: function (describer, value) {
        if (!this.loggingEnabled) return;
        this.logServerRoute(`upload:${describer}:\n\t${value}`);
    },

    logServerRouteDownload: function (describer, value) {
        if (!this.loggingEnabled) return;
        this.logServerRoute(`download:${describer}:\n\t${value}`);
    },

    logServerRoute: function (route) {
        if (!this.loggingEnabled) return;
        this.logServer(`route:${route}`);
    },

    logServer: function (message) {
        if (!this.loggingEnabled) return;
        console.log(`server:${message}`);
    },

    logAttribute: function (attribute, value) {
        if (!this.loggingEnabled) return;
        this.logServer(`attribute:${attribute}:\n\t${value}`);
    },

    logDeletedFile: function (filename) {
        if (!this.loggingEnabled) return;
        console.log(`Deleted file:\n\t${filename}`);
    },

    logCreatedFile: function (filename) {
        if (!this.loggingEnabled) return;
        console.log(`Created file:\n\t${filename}`);
    }
}