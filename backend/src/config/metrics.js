import client from 'prom-client';

export const register = new client.Registry();

client.collectDefaultMetrics({ register });

export const sandboxSpawnSeconds = new client.Histogram({
    name: 'codestudio_sandbox_spawn_seconds',
    help: 'Time from container creation request to an attached shell',
    // container start dominates this; buckets span a fast local start to a stalled one
    buckets: [0.25, 0.5, 1, 2, 3, 5, 10, 30],
    registers: [register],
});

export const activeSandboxes = new client.Gauge({
    name: 'codestudio_active_sandboxes',
    help: 'Sandbox containers currently running',
    registers: [register],
});

export const sandboxOomKills = new client.Counter({
    name: 'codestudio_sandbox_oom_kills_total',
    help: 'Sandbox containers killed by the memory cgroup limit',
    registers: [register],
});

export const sandboxSpawnFailures = new client.Counter({
    name: 'codestudio_sandbox_spawn_failures_total',
    help: 'Container creations that threw before a shell was attached',
    registers: [register],
});
