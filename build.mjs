import { simpleGit } from 'simple-git';
import fs from 'node:fs/promises';

async function cloneRepo() {
    const option = {
        baseDir: "/tmp/",
        binary: 'git',
    };

    const git = simpleGit(option);
    await git.clone("git@github.com:lampewebdev/JDSL.git")
}

async function main() {
    await fs.rm("/tmp/JDSL", { recursive: true, force: true });
    await cloneRepo();
    const option = {
        baseDir: "/tmp/JDSL",
        binary: 'git',
    };

    const git = simpleGit(option);
    const data = await fs.readFile('./src/customers.json', 'utf8');
    const jsonData = JSON.parse(data);
    const someHash = jsonData.Functions[0];
    await git.checkout(someHash);
    const customerFile = await fs.readFile('/tmp/JDSL/src/customers.js', 'utf8');
    fs.appendFile('./dist/customers.js', customerFile);
    // await fs.rm("./dist/", { recursive: true, force: true });
    // await fs.mkdir("./dist/");
}

main();
console.log("Building with the power of JDSL");
