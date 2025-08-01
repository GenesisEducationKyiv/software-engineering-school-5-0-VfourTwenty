const fs = require('fs');
const path = require('path');

const SETUP_PATH = path.join(__dirname, '../../src/setup.js');

// architectural dependencies:
// application     => domain (Service Interfaces, Types)
// services        => domain (Provider Interfaces, Types)
// Infrastructure  => application (use-cases (for cron), Provider and Repo Interfaces)
// Presentation    => application (use-cases)

const layerMap = [
    { prefix: 'domain/', layer: 'domain' },
    { prefix: 'application/', layer: 'application' },
    { prefix: 'services/', layer: 'services' },
    { prefix: 'infrastructure/', layer: 'infrastructure' },
    { prefix: 'presentation/', layer: 'presentation' },
    { prefix: 'common/', layer: 'common' },
];

function getLayerFromPath(importPath) 
{
    for (const { prefix, layer } of layerMap) 
    {
        if (importPath.includes(prefix)) return layer;
    }
    return 'unknown';
}

function parseRequires(fileContent) 
{
    const requireRegex = /const\s+(\w+)\s*=\s*require\(['"]\.?([\w/-]+)['"]\);/g;
    const destructureRequireRegex = /const\s*{([^}]+)}\s*=\s*require\(['"]\.?([\w/-]+)['"]\);/g;
    const propertyRequireRegex = /const\s+(\w+)\s*=\s*require\(['"]\.?([\w/-]+)['"]\)\.(\w+);/g;
    const varToLayer = {};
    let match;

    // Handle simple requires
    while ((match = requireRegex.exec(fileContent)) !== null) 
    {
        const varName = match[1];
        const importPath = match[2];
        varToLayer[varName] = getLayerFromPath(importPath);
    }

    // Handle destructured requires
    while ((match = destructureRequireRegex.exec(fileContent)) !== null) 
    {
        const varNames = match[1].split(',').map(s => s.trim());
        const importPath = match[2];
        const layer = getLayerFromPath(importPath);
        varNames.forEach(varName => 
        {
            varToLayer[varName] = layer;
        });
    }

    // Handle property requires
    while ((match = propertyRequireRegex.exec(fileContent)) !== null) 
    {
        const varName = match[1];
        const importPath = match[2];
        varToLayer[varName] = getLayerFromPath(importPath);
    }

    return varToLayer;
}

// Parse array assignments
function parseArrayAssignments(fileContent) 
{
    const arrayAssignRegex = /const\s+(\w+)\s*=\s*\[([^\]]*)\];/g;
    const arrayVarToElements = {};
    let match;
    while ((match = arrayAssignRegex.exec(fileContent)) !== null) 
    {
        const arrayName = match[1];
        arrayVarToElements[arrayName] = match[2].split(',').map(s => s.trim()).filter(Boolean);
    }
    return arrayVarToElements;
}

function parseConstructorCalls(fileContent) 
{
    const constructorRegex = /const\s+(\w+)\s*=\s*new\s+(\w+)\s*\(([^)]*)\)/g;
    let match;
    const instantiations = [];
    while ((match = constructorRegex.exec(fileContent)) !== null) 
    {
        const varName = match[1];
        const className = match[2];
        const args = match[3]
            .split(',')
            .map(s => s.trim())
            .filter(Boolean);
        instantiations.push({ varName, className, args });
    }
    return instantiations;
}

function buildAssignmentMap(instantiations)
{
    const varAssignment = {};
    instantiations.forEach(({ varName, className, args }) => 
    {
        varAssignment[varName] = { className, args };
    });
    return varAssignment;
}

function resolveLayer(varName, varToLayer, varAssignment, arrayVarToElements, depth = 0) 
{
    if (depth > 10) return 'unknown';
    if (varToLayer[varName]) return varToLayer[varName];
    if (arrayVarToElements[varName]) 
    {
        const elementLayers = arrayVarToElements[varName].map(
            el => resolveLayer(el, varToLayer, varAssignment, arrayVarToElements, depth + 1)
        );
        return Array.from(new Set(elementLayers));
    }
    if (varAssignment[varName]) 
    {
        if (varToLayer[varAssignment[varName].className]) 
        {
            return varToLayer[varAssignment[varName].className];
        }
        if (varAssignment[varName].args.length > 0) 
        {
            return resolveLayer(varAssignment[varName].args[0], varToLayer, varAssignment, arrayVarToElements, depth + 1);
        }
    }
    return 'unknown';
}

// infrastructure adapters implement domain interfaces and should be initialized first
// services implement domain interfaces and should be initialized with infrastructure adapters injected
// application layer depends on service domain interfaces and should be initialized with services injected
// presentation and infrastructure entry-points depend on the application layer and should be initialized with use-cases injected

// domain entities are not initialized as they are prototypes and are not implemented
const layerRules = {
    services:         { allowed: ['common', 'infrastructure'] },
    application:      { allowed: ['common', 'application', 'services'] },
    infrastructure:   { allowed: ['common'] },
    presentation:     { allowed: ['common', 'application', 'presentation'] },
};

const setupContent = fs.readFileSync(SETUP_PATH, 'utf-8');
const varToLayer = parseRequires(setupContent);
const instantiations = parseConstructorCalls(setupContent);
const assignments = buildAssignmentMap(instantiations);
const arrayVarToElements = parseArrayAssignments(setupContent);

// log composition root chain:

console.log('Variable to Layer Map:');
console.log(varToLayer);

console.log('\nConstructor Calls:');
let violations = [];
instantiations.forEach(({ varName, className, args }) => 
{
    const varLayer = resolveLayer(varName, varToLayer, assignments, arrayVarToElements);
    const argLayers = args.map(arg => ({
        arg,
        layer: resolveLayer(arg, varToLayer, assignments, arrayVarToElements)
    }));
    console.log(`- ${varName} (layer: ${varLayer}) = new ${className}(${args.join(', ')})`);
    argLayers.forEach(({ arg, layer }) => 
    {
        if (Array.isArray(layer)) 
        {
            layer.forEach(l => 
            {
                console.log(`    Arg: ${arg} (element layer: ${l})`);
                if (
                    varLayer in layerRules &&
                    !layerRules[varLayer].allowed.includes(l) &&
                    l !== 'unknown'
                ) 
                {
                    violations.push(
                        `[VIOLATION] ${varName} (layer: ${varLayer}) = new ${className}(...), Arg: ${arg} (element layer: ${l}) is not allowed`
                    );
                }
            });
        }
        else 
        {
            console.log(`    Arg: ${arg} (layer: ${layer})`);
            if (
                varLayer in layerRules &&
                !layerRules[varLayer].allowed.includes(layer) &&
                layer !== 'unknown'
            ) 
            {
                violations.push(
                    `[VIOLATION] ${varName} (layer: ${varLayer}) = new ${className}(...), Arg: ${arg} (layer: ${layer}) is not allowed`
                );
            }
        }
    });
});

if (violations.length > 0) 
{
    console.error('\nARCHITECTURE VIOLATIONS FOUND:');
    violations.forEach(v => console.error(v));
    process.exit(1);
}
else 
{
    console.log('\nAll constructor dependencies respect layer rules.');
    process.exit(0);
} 
