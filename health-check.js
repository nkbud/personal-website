#!/usr/bin/env node

/**
 * Simple health check script for the personal website
 * Tests connectivity to Supabase services
 */

const http = require('http');

// Colors for terminal output
const colors = {
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    reset: '\x1b[0m'
};

function log(level, message) {
    const timestamp = new Date().toISOString();
    const colorMap = {
        'INFO': colors.blue,
        'SUCCESS': colors.green,
        'WARNING': colors.yellow,
        'ERROR': colors.red
    };
    
    console.log(`${colorMap[level]}[${level}]${colors.reset} ${timestamp} - ${message}`);
}

function checkEndpoint(url, name) {
    return new Promise((resolve) => {
        const req = http.get(url, (res) => {
            if (res.statusCode >= 200 && res.statusCode < 300) {
                log('SUCCESS', `${name} is accessible (${res.statusCode})`);
                resolve(true);
            } else {
                log('WARNING', `${name} returned status ${res.statusCode}`);
                resolve(false);
            }
        });

        req.on('error', (err) => {
            log('ERROR', `${name} is not accessible: ${err.message}`);
            resolve(false);
        });

        req.setTimeout(5000, () => {
            req.destroy();
            log('ERROR', `${name} request timed out`);
            resolve(false);
        });
    });
}

async function runHealthCheck() {
    log('INFO', 'Starting health check...');
    
    const endpoints = [
        { url: 'http://localhost:5173', name: 'Frontend' },
        { url: 'http://localhost:3000', name: 'Supabase Studio' },
        { url: 'http://localhost:8000/health', name: 'Supabase API Health' },
        { url: 'http://localhost:8000/rest/v1/', name: 'Supabase REST API' },
    ];

    let successCount = 0;
    
    for (const endpoint of endpoints) {
        const isHealthy = await checkEndpoint(endpoint.url, endpoint.name);
        if (isHealthy) successCount++;
        
        // Add a small delay between checks
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    log('INFO', `Health check complete: ${successCount}/${endpoints.length} services accessible`);
    
    if (successCount === endpoints.length) {
        log('SUCCESS', 'All services are running correctly!');
        log('INFO', 'You can access:');
        log('INFO', '  - Frontend: http://localhost:5173');
        log('INFO', '  - Supabase Studio: http://localhost:3000');
        log('INFO', '  - Supabase API: http://localhost:8000');
        process.exit(0);
    } else {
        log('WARNING', 'Some services are not accessible. Check the logs with: docker compose logs');
        process.exit(1);
    }
}

// Run the health check
runHealthCheck().catch((err) => {
    log('ERROR', `Health check failed: ${err.message}`);
    process.exit(1);
});