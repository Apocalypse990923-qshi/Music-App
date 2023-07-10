import * as musicMetadata from 'music-metadata';
import fs from 'fs-extra';
import path from 'path';
import os from 'os';
import crypto from 'crypto';
import jpeg from 'jpeg-js';
import mongoose from 'mongoose';

async function libraryInit(filePath) {
    const metadata = await musicMetadata.parseFile(filePath);
    let artist = metadata.common.artists || "Unknown Artist";
    let title = metadata.common.title || "Unknown Title";
    let album = metadata.common.album || "Unknown Album";
    let genre = metadata.common.genre ? metadata.common.genre[0] : "Unknown Genre";
    let copyright = metadata.common.copyright || "Unknown Copyright";
    let trackNumber = metadata.common.track.no || 0;
    let length = metadata.format.duration || 0;
    const trackid = crypto.createHash('md5').update(artist + title + album).digest('hex').substring(0, 16);
    const albumid = crypto.createHash('md5').update(album).digest('hex').substring(0, 16);
    const data = {
        track_id: trackid,
        title: title,
        artist: artist,
        album: album,
        album_id: albumid,
        genre: genre,
        copyright: copyright,
        length: length,
        track_number: trackNumber,
        quality: 'STD',
        file: filePath
    };
    if (metadata.common.picture && metadata.common.picture.length > 0) {
        const pic = metadata.common.picture[0];
        let picData = pic.data;
        if (pic.format !== 'image/jpeg') {
            const rawImageData = {
                data: picData,
                width: pic.width,
                height: pic.height
            };
            picData = jpeg.encode(rawImageData, 100).data;
        }
        await fs.writeFile(path.join(path.dirname(filePath), 'cover', `${data.album_id}.jpg`), picData);
    }
    const jsonFilePath = filePath.replace('.mp3', '.json');
    await fs.writeFile(jsonFilePath, JSON.stringify(data, null, 4));
    console.log(`Index Created: ${data.track_id} ${path.basename(filePath)}`);
}

async function libraryLoad(filePath) {
    const jsonFilePath = filePath.replace('.mp3', '.json');
    if (!await fs.pathExists(jsonFilePath)) {
        return null;
    }
    const data = await fs.readFile(jsonFilePath, 'utf8');
    return JSON.parse(data);
}

async function libraryUpdate(lib, filePath) {
    const jsonFilePath = filePath.replace('.mp3', '.json');
    if (!await fs.pathExists(filePath)) {
        await fs.unlink(jsonFilePath);
        console.log(`Index Deleted: ${lib.track_id} ${path.basename(filePath)}`);
        return;
    }
    const metadata = await musicMetadata.parseFile(filePath);
    let artist = metadata.common.artists || "Unknown Artist";
    let title = metadata.common.title || "Unknown Title";
    let album = metadata.common.album || "Unknown Album";
    let genre = metadata.common.genre ? metadata.common.genre[0] : "Unknown Genre";
    let copyright = metadata.common.copyright || "Unknown Copyright";
    let trackNumber = metadata.common.track.no || 0;
    let length = metadata.format.duration || 0;
    const trackid = crypto.createHash('md5').update(artist + title + album).digest('hex').substring(0, 16);
    const albumid = crypto.createHash('md5').update(album).digest('hex').substring(0, 16);

    lib.track_id = trackid;
    lib.title = title;
    lib.artist = artist;
    lib.album = album;
    lib.album_id = albumid;
    lib.genre = genre;
    lib.copyright = copyright;
    lib.length = length;
    lib.track_number = trackNumber;

    await fs.writeFile(jsonFilePath, JSON.stringify(lib, null, 4));
    console.log(`Index Updated: ${lib.track_id} ${path.basename(filePath)}`);

    //cover
    if (metadata.common.picture && metadata.common.picture.length > 0) {
        const pic = metadata.common.picture[0];
        let picData = pic.data;
        if (pic.format !== 'image/jpeg') {
            const rawImageData = {
                data: picData,
                width: pic.width,
                height: pic.height
            };
            picData = jpeg.encode(rawImageData, 100).data;
        }
        await fs.writeFile(path.join(path.dirname(filePath), 'cover', `${lib.album_id}.jpg`), picData);
    }

    //Album Playlist
	const existingAlbum = await PlaylistIndex.findOne({ pid: lib.album_id });
	if(existingAlbum){
		const Playlist = mongoose.model(existingAlbum.pid, SinglePlaylistSchema);
		const track = await Playlist.findOne({ tid: lib.track_id });
		if(!track){
			const new_track = {
		        tid: lib.track_id,
				order: existingAlbum.added
		    };
			const NewTrack = new Playlist(new_track);
			NewTrack.save().then(() => console.log('New track saved in album!')).catch(err => console.error('Error:', err));
			existingAlbum.added = existingAlbum.added + 1;
			existingAlbum.save().then(() => console.log('Album updated!')).catch(err => console.error('Error:', err));
		}else{
            console.log('Track already exist in album! Order:',track.order);
        }
        if(existingAlbum.name=='Unknown Album' || !(await fs.pathExists(path.join(path.dirname(filePath), 'cover', `${existingAlbum.pid}.jpg`)))){
            existingAlbum.image = 'No Cover Image';
        }
	}else{
		const new_album = {
			pid: lib.album_id,
			name: lib.album,
			added: 1,
			image: 'No Cover Image',
			type: 'album'
		};
        if(new_album.name!='Unknown Album' && await fs.pathExists(path.join(path.dirname(filePath), 'cover', `${new_album.pid}.jpg`))){
            new_album.image = path.join(path.dirname(filePath), 'cover', `${new_album.pid}.jpg`);
        }
		const NewAlbum = new PlaylistIndex(new_album);
		NewAlbum.save().then(() => console.log('New album created!')).catch(err => console.error('Error:', err));
		const Playlist = mongoose.model(new_album.pid, SinglePlaylistSchema);
		const new_track = {
			tid: lib.track_id,
			order: 0
		};
		const NewTrack = new Playlist(new_track);
		NewTrack.save().then(() => console.log('New track saved in album!')).catch(err => console.error('Error:', err));
	}
}

async function processFiles(dirPath) {
    const files = await fs.readdir(dirPath);
    const audioFiles = files.filter(file => path.extname(file) === '.mp3');

    const numCPUs = os.cpus().length;
    const filesPerCPU = Math.ceil(audioFiles.length / numCPUs);

    const promises = [];
    for (let i = 0; i < numCPUs; i++) {
        const start = i * filesPerCPU;
        const end = start + filesPerCPU;
        const filesForThisCPU = audioFiles.slice(start, end);
        promises.push(processFilesOnCPU(filesForThisCPU, dirPath));
    }

    await Promise.all(promises);
    console.log('Library initialization/updating completed.');
}

async function processFilesOnCPU(files, dirPath) {
    for (let file of files) {
        const filePath = path.join(dirPath, file);
        console.log('Start to load file:',filePath);
        var lib = await libraryLoad(filePath);
        if (lib === null) {
            await libraryInit(filePath);
            lib = await libraryLoad(filePath);
        } else {
            await libraryUpdate(lib, filePath);
        }
        const newLibrary = new Library(lib);
		//await fs.appendFile(path.join(dirPath, 'index.json'), JSON.stringify(lib, null, 4));
        newLibrary.save().then(() => console.log('Lib saved!')).catch(err => console.error('Error:', err));
    }
}

import { Library, User, PlaylistIndex, SinglePlaylistSchema, UserLibrarySchema } from './model.js';
processFiles('./Library').catch(console.error);
