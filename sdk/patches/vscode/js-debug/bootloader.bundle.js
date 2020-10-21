const fs = require('fs');
const Path = require('path');
const jestBinPattern = Path.join('node_modules', 'jest', 'bin', 'jest');


function findUp(names, from) {
    if (!Array.isArray(names)) {
        names = [names];
    }
    const root = Path.parse(from).root;

    let currentDir = from;
    while (currentDir && currentDir !== root) {
        for (const name of names) {
            const p = Path.join(currentDir, name);
            if (fs.existsSync(p)) {
                return p;
            }
        }

        currentDir = Path.dirname(currentDir);
    }

    return null;
}

// monkey patch _resolveFilename but only if the execution is jest related
for (i = 0; i < process.argv.length; i++) {
    if (process.argv[i].includes(jestBinPattern)) {

        const Module = require('module');

        const oldResolve = Module._resolveFilename;

        Module._resolveFilename = function (request, parent, flag, opts) {
            let resolved = null;
            try {
                resolved = oldResolve.call(this, request, parent, flag, opts);

            } catch (e) {
                if (request.includes(jestBinPattern)) {
                    const workspaceNodeModulesPath = findUp('node_modules', Path.dirname(request))
                    if (fs.existsSync(workspaceNodeModulesPath)) {
                        jestBinPath = Path.join(workspaceNodeModulesPath, 'jest', 'bin', 'jest.js');
                        if (fs.existsSync(`${jestBinPath}`)) {
                            resolved = `${jestBinPath}`;
                            // we resolved what we wanted; restore the oldResolve function
                            Module._resolveFilename = oldResolve;

                        }
                    }
                }
            }
            return resolved;
        }
    }
}

require('./bootloader.bundle.orig');