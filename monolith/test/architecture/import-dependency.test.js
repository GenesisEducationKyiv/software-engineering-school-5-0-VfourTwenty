const madge = require('madge');
const path = require('path');

const layerRules = [
    {
        layer: 'src/domain/',
        forbidden: ['src/application/', 'src/services/', 'src/infrastructure/', 'src/presentation/', 'src/setup.js'],
        name: 'domain'
    },
    {
        layer: 'src/application/',
        forbidden: ['src/services/', 'src/infrastructure/', 'src/presentation/', 'src/setup.js'],
        name: 'application'
    },
    {
        // services are a separate layer as they are self-contained
        // and will be made into separate microservice in the near future
        layer: 'src/services/',
        forbidden: ['src/application/', 'src/infrastructure/', 'src/presentation/'],
        name: 'services'
    },
    {
        // infrastructure imports from the composition root - setup.js
        layer: 'src/infrastructure/',
        forbidden: ['src/presentation/'],
        name: 'infrastructure'
    },
    {
        layer: 'src/presentation/',
        forbidden: ['src/infrastructure/', 'src/services/', 'src/domain/'],
        name: 'infrastructure'
    },
    {
        // only uses the presentation layer
        layer: 'src/app.js',
        forbidden: ['src/application/', 'src/services/', 'src/infrastructure/', 'src/domain/'],
        name: 'app.js'
    }
];

function checkLayerImports(graph, rule) 
{
    let violations = [];
    Object.keys(graph).forEach(file => 
    {
        if (file.startsWith(rule.layer)) 
        {
            const deps = graph[file];
            deps.forEach(dep => 
            {
                if (rule.forbidden.some(layer => dep.startsWith(layer))) 
                {
                    violations.push(`${file} imports forbidden layer: ${dep}`);
                }
            });
        }
    });
    return violations;
}

(async () => 
{
    const SRC_DIR = path.join(__dirname, '../../src');
    const res = await madge(SRC_DIR);
    const graph = res.obj();

    let allViolations = [];

    layerRules.forEach(rule => 
    {
        const violations = checkLayerImports(graph, rule);
        if (violations.length > 0) 
        {
            console.error(`\nARCHITECTURE VIOLATION(S) in ${rule.name} layer:`);
            violations.forEach(v => console.error('  -', v));
            allViolations = allViolations.concat(violations);
        }
        else 
        {
            console.log(`No forbidden imports in ${rule.name} layer.`);
        }
    });

    if (allViolations.length > 0) 
    {
        process.exit(1);
    }
    else 
    {
        console.log('Architecture test passed: No forbidden imports in any checked layer.');
        process.exit(0);
    }
})();
