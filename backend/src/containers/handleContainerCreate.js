import Docker from 'dockerode';
import path from 'path';

import { PROJECTS_DIR } from '../config/serverConfig.js';

const docker = new Docker();

// Remove any leftover sandbox containers — e.g. orphans from a backend that was

export const cleanupSandboxContainers = async () => {
    try {
        const containers = await docker.listContainers({
            all: true,
            filters: { ancestor: ['sandbox'] },
        });
        for (const c of containers) {
            await docker.getContainer(c.Id).remove({ force: true }).catch(() => {});
        }
        if (containers.length) {
            console.log(`Removed ${containers.length} orphan sandbox container(s) on startup`);
        }
    } catch (error) {
        console.log('Error during orphan cleanup', error);
    }
};

export const handleContainerCreate = async (projectId, socket) => {
    // Mount the actual app folder (projects/<id>/<id>) so package.json sits at the workdir.
    const hostPath = path.resolve(PROJECTS_DIR, projectId, projectId);

    const container = await docker.createContainer({
        Image: 'sandbox',
        AttachStdin: true,
        AttachStdout: true,
        AttachStderr: true,
        Tty: true,
        OpenStdin: true,
        Cmd: ['/bin/bash'],
        User: 'sandbox',
        HostConfig: {
            Binds: [`${hostPath}:/home/sandbox/app`],
            PortBindings: { '5173/tcp': [{ HostPort: '' }] }, // random host port; for preview later
        },
        ExposedPorts: { '5173/tcp': {} },
    });

    await container.start();

    // Docker assigns a random host port to the container's 5173 — tell the frontend so it can preview.
    const info = await container.inspect();
    const hostPort = info.NetworkSettings?.Ports?.['5173/tcp']?.[0]?.HostPort;
    if (hostPort) {
        socket.emit('preview:url', { url: `http://localhost:${hostPort}` });
    }

    const exec = await container.exec({
        Cmd: ['/bin/bash'],
        AttachStdin: true,
        AttachStdout: true,
        AttachStderr: true,
        Tty: true,
        User: 'sandbox',
    });

    const stream = await exec.start({ hijack: true, stdin: true });

    socket.on('shell:input', (data) => stream.write(data)); // keystrokes -> container
    stream.on('data', (chunk) => socket.emit('shell:output', chunk.toString())); // output -> browser

    return container;
};
