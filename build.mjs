import { simpleGit } from 'simple-git';
import fs from 'node:fs/promises';
import path from 'node:path';

async function cloneRepo() {
    const option = {
        baseDir: "/tmp/",
        binary: 'git',
    };

    const git = simpleGit(option);
    await git.clone("git@github.com:lampewebdev/JDSL.git")
}

async function find_all_json() {
    const files = await fs.readdir('./src/');
    return files.filter(file => path.extname(file) === '.json');
}

async function git_worker() {
    const option = {
        baseDir: "/tmp/JDSL",
        binary: 'git',
    };

    return simpleGit(option);
}

async function create_class(git, jsonData) {

    await fs.appendFile('./dist/server.js', "class " + jsonData.Class + "{};");
    for (const funcHash in jsonData.Functions) {
        await git.checkout(jsonData.Functions[funcHash]);
        const customerFile = await fs.readFile('/tmp/JDSL/src/' + jsonData.File, 'utf8');
        await fs.appendFile('./dist/server.js', customerFile);
    }
}

async function main() {
    await fs.rm("./dist/", { recursive: true, force: true });
    await fs.mkdir("./dist/");

    await fs.rm("/tmp/JDSL", { recursive: true, force: true });
    await cloneRepo();
    const git = await git_worker();
    const jsonFiles = await find_all_json();
    for (const jsonFile of jsonFiles) {
        const data = await fs.readFile('./src/' + jsonFile, 'utf8');
        const jsonData = JSON.parse(data);
        await create_class(git, jsonData);
    };

    const serverFile = await fs.readFile("./server.js");
    await fs.appendFile("./dist/server.js", serverFile);
}

main();
console.log("Building with the power of JDSL");
