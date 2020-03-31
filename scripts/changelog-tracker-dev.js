const path = require('path');
const fs = require('fs');
const yaml = require('js-yaml');

const directoryPath = path.resolve(__dirname, '../changelogs');

// Read directory path and exclude the template.yml file.
const changelogs = fs.readdirSync(directoryPath).filter(function(file) {
    return file.match(/^.*\.yml$/g) && file!== "template.yml";
});

if (!changelogs || changelogs.length<1) {
    console.log('Nothing to release today!')
    process.exit(1);
}

let changeTypes = [];
let impacts = [];
let changeContents = {};
let newLogs = [];

/** Loop through each changelog in the changelogs directory,
 * consolidate changelogs with the same changeTypes together
 */
changelogs.forEach((fileName) => {
    const content = yaml.safeLoad(fs.readFileSync(`${directoryPath}/${fileName}`, 'utf8'));
    Object.keys(content).forEach((changeType) => {
        // If it encounters a new change type
        if(changeTypes.indexOf(changeType) < 0) {
            // add it to the changeType array
            changeTypes.push(changeType);
            // add the content of the changelog to changeContents object under the changeType key
            changeContents[changeType] = content[changeType]
        } else {
            // If it's an existing change type, append the content of the changelog into the existing changeType array
            changeContents[changeType] = [...changeContents[changeType], ...content[changeType]]
        }
    });
});

/** Format consolidated changelogs data into a string with desired markdown syntax */
changeTypes.forEach((changeType) => {
    newLogs.push(`\n### ${changeType} \n`)
    changeContents[changeType].forEach((change) => {
        const { project, component, issue, description, impact } = change;
        const newChange = `- (${project}) [${component}] ${issue ? `${issue}: ` : ''}${description}\n`
        impacts.push(impact);
        newLogs.push(newChange);
    });
})

// Export data to use in release.branch
module.exports = {
    changelogs
};



