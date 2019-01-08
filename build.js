const fs = require("fs");
const execSync = require('child_process').execSync;

const isRelease = process.argv.indexOf('--release');
const versionType = process.argv[isRelease + 1] || 'patch';

function parsePackageJson() {
    return JSON.parse(fs.readFileSync("package.json", "utf8"));
}

function exec (command) {
    console.log('EXEC: ' + command);
    execSync(command);
}

function updateVersion () {
    var packageJson = parsePackageJson();
    var currVersion = packageJson.version.match(/\d+/g).map(function(value) {
        return parseInt(value, 10);
    });
    console.log("Old Version: " + packageJson.version);

    if (versionType === "major") {
        currVersion[0]++;
        currVersion[1] = 0;
        currVersion[2] = 0;
    } else if (versionType === "minor") {
        currVersion[1]++;
        currVersion[2] = 0;
    } else {
        currVersion[2]++;
    }

    packageJson.version = currVersion.join(".");
    fs.writeFileSync("package.json", JSON.stringify(packageJson, null, 4));
    console.log("New Version: " + packageJson.version);
    return packageJson.version;
}

exec('npm run compile');

if (isRelease > 0) {
    let version = updateVersion();
    exec(`git add package.json`);
    exec(`git commit -am "Released ${version}"`);
    exec(`git tag "${version}" --force`);
    exec(`git push origin HEAD:master --tags`);
    exec(`npm publish`);
}