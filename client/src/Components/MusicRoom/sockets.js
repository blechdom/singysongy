import io from 'socket.io-client';
import SimplePeer from 'simple-peer';
import { ICE_CONFIGURATION, SOCKET_URL } from './constants';

export default function Sockets(localStream, handleVideoListAdd, handleVideoListRemove, addChat) {
  
  this.socket = io(SOCKET_URL);
  this.localStream = localStream;
	this.handleVideoListAdd = handleVideoListAdd;
	this.handleVideoListRemove = handleVideoListRemove;
  this.peers = {};

	this.socket.on('connect', () => {
		console.log('I AM ', this.socket.id);
		this.socket.emit('subscribe', { room: 'default', socketId: this.socket.id });
	});

	this.socket.on('initReceive', socket_id => {
		console.log('INIT RECEIVE ' + socket_id)  
		this.addPeer(socket_id, false)
	});

	this.socket.on('initSend', data => {
		console.log('INIT SEND RECEIVED from ' + JSON.stringify(data))
		this.addPeer(data, true)
	});

	this.socket.on('chat', data => {
		addChat(data, false);
	});

	this.socket.on('signal', data => {
		this.peers[data.socket_id].signal(data.signal)
	});

	this.socket.on('removePeer', socket_id => {
		console.log('removing peer ' + socket_id);
		this.removePeer(socket_id);
	});

	this.socket.on('disconnect', () => {
		console.log('GOT DISCONNECTED')
		for (let socket_id in this.peers) {
			this.removePeer(socket_id);
		}
	});
}

Sockets.prototype.addPeer = async function (socket_id: String, am_initiator: Boolean) {
	console.log('add peer ' + socket_id + ' initiator? ' + am_initiator);
	this.peers[socket_id] = await new SimplePeer({
			initiator: am_initiator,
			stream: this.localStream,
			config: ICE_CONFIGURATION
	});

	if (am_initiator === false) {
		this.socket.emit('initSend', socket_id);
	}
	
	this.peers[socket_id].on('signal', data => {
		this.socket.emit('signal', {
			signal: data,
			socket_id: socket_id
		})
	})

	this.peers[socket_id].on('stream', stream => {
		const videoProps = {src: stream, socketId: socket_id};
		this.handleVideoListAdd(videoProps);
		console.log('handleVideoListAdd: ', videoProps);
	})
}
  
Sockets.prototype.removePeer = function(socket_id: String) {
  this.handleVideoListRemove(socket_id);
	console.log("handleVideoListRemove: ", socket_id);
	if (this.peers[socket_id]) this.peers[socket_id].destroy();
	delete this.peers[socket_id];
}

Sockets.prototype.closeSockets = function() {
  this.socket.disconnect();
}

Sockets.prototype.updateLocalStream = function(updatedStream) {
  this.localStream = updatedStream;
}