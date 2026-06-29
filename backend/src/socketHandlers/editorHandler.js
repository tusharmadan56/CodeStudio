import fs from 'fs/promises';
import path from 'path';

import { PROJECTS_DIR } from '../config/serverConfig.js';

export const handleEditorSocketEvents = (socket) => {
    const projectId = socket.handshake.query.projectId;
    const projectRoot = projectId ? path.resolve(PROJECTS_DIR, projectId) : null;

    // Every fs operation is confined to the connection's own project directory.
    const isWithinProject = (target) => {
        if (!projectRoot) return false;
        const resolved = path.resolve(target);
        return resolved === projectRoot || resolved.startsWith(projectRoot + path.sep);
    };

    const rejectIfOutside = (errorEvent, target) => {
        if (isWithinProject(target)) return false;
        socket.emit(errorEvent, { data: 'Invalid path' });
        return true;
    };

    socket.on('writeFile', async ({ data, pathToFileOrFolder }) => {
        if (rejectIfOutside('writeFileError', pathToFileOrFolder)) return;
        try {
            await fs.writeFile(pathToFileOrFolder, data);
            // notify every OTHER editor client so they can sync the same file live
            socket.broadcast.emit('writeFileSuccess', { path: pathToFileOrFolder, value: data });
        } catch (error) {
            console.log('Error writing the file', error);
            socket.emit('writeFileError', { data: 'Error writing the file' });
        }
    });

    socket.on('createFile', async ({ pathToFileOrFolder }) => {
        if (rejectIfOutside('createFileError', pathToFileOrFolder)) return;
        try {
            await fs.stat(pathToFileOrFolder);
            socket.emit('createFileError', { data: 'File already exists' });
            return;
        } catch {
            // ENOENT: does not exist yet, safe to create
        }
        try {
            await fs.writeFile(pathToFileOrFolder, '');
            socket.emit('createFileSuccess', { data: 'File created successfully' });
        } catch (error) {
            console.log('Error creating the file', error);
            socket.emit('createFileError', { data: 'Error creating the file' });
        }
    });

    socket.on('readFile', async ({ pathToFileOrFolder }) => {
        if (rejectIfOutside('readFileError', pathToFileOrFolder)) return;
        try {
            const content = await fs.readFile(pathToFileOrFolder);
            socket.emit('readFileSuccess', { value: content.toString(), path: pathToFileOrFolder });
        } catch (error) {
            console.log('Error reading the file', error);
            socket.emit('readFileError', { data: 'Error reading the file' });
        }
    });

    socket.on('deleteFile', async ({ pathToFileOrFolder }) => {
        if (rejectIfOutside('deleteFileError', pathToFileOrFolder)) return;
        try {
            await fs.unlink(pathToFileOrFolder);
            socket.emit('deleteFileSuccess', { data: 'File deleted successfully' });
        } catch (error) {
            console.log('Error deleting the file', error);
            socket.emit('deleteFileError', { data: 'Error deleting the file' });
        }
    });

    socket.on('createFolder', async ({ pathToFileOrFolder }) => {
        if (rejectIfOutside('createFolderError', pathToFileOrFolder)) return;
        try {
            await fs.mkdir(pathToFileOrFolder);
            socket.emit('createFolderSuccess', { data: 'Folder created successfully' });
        } catch (error) {
            console.log('Error creating the folder', error);
            socket.emit('createFolderError', { data: 'Error creating the folder' });
        }
    });

    socket.on('deleteFolder', async ({ pathToFileOrFolder }) => {
        if (rejectIfOutside('deleteFolderError', pathToFileOrFolder)) return;
        try {
            await fs.rm(pathToFileOrFolder, { recursive: true });
            socket.emit('deleteFolderSuccess', { data: 'Folder deleted successfully' });
        } catch (error) {
            console.log('Error deleting the folder', error);
            socket.emit('deleteFolderError', { data: 'Error deleting the folder' });
        }
    });
};
