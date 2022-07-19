/**
 * Custom angular webpack configuration
 */
const JavaScriptObfuscator = require('webpack-obfuscator');

console.log('############## custom webpack config ################');

module.exports = (config, options) => {
   
    if (config.mode === 'production') {
        config.plugins.push(new JavaScriptObfuscator({
            // rotateUnicodeArray: true,
            unicodeEscapeSequence: false,
            compact: true,
            controlFlowFlattening: true,
            controlFlowFlatteningThreshold: 0.75,
            // deadCodeInjection: true,
            // deadCodeInjectionThreshold: 0.4,
            debugProtection: false,
            debugProtectionInterval: false,
            disableConsoleOutput: true,
            identifierNamesGenerator: 'hexadecimal',
            log: false,
            seed: 1,
            renameGlobals: false,
            rotateStringArray: true,
            selfDefending: true,
            stringArray: true,
            //stringArrayEncoding: 'base64',
            stringArrayThreshold: 0.75
        }, []));
    }
    return config;
}