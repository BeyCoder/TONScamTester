import * as fs from 'fs';
import * as path from 'path';
import {TestCase} from "./TestCase";

const testersDir = path.resolve(__dirname, '');

export const importTestCaseModules = async () => {
    const files = fs.readdirSync(testersDir).filter(file => file.endsWith('.ts') || file.endsWith('.js'));
    const modules: any[] = [];

    for (const file of files) {
        if (file.toLowerCase() === "testcase.ts" || file.toLowerCase() == "index.ts")
            continue;

        const modulePath = path.join(testersDir, file);
        const module = await import(modulePath);
        modules.push(...Object.values(module));
    }

    const cases: any[] = [];
    for (const Module of modules) {
        if (!Module.prototype.test) {
            console.warn(`${Module.prototype.constructor.name} must extend ${TestCase.name}! Module is skipped...`)
            continue;
        }

        cases.push(Module)
    }
    return cases;
};