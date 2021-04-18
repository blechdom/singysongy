import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import SimplePeer from 'simple-peer';
import { ICE_CONFIGURATION, SOCKET_URL } from './constants';

export default function SocketsAndPeers({localStream, handleVideoListAdd, handleVideoListRemove}) {
  
  const socket = io(SOCKET_URL);
  
  const peers = {};
  useEffect(() => {
    initSockets();
    return function cleanup() {
      socket.disconnect();
    };
  }, []);

  function initSockets() {

    console.log('init sockets and peers');
    socket.on('connect', () => {
      console.log('I AM ', socket.id);
      socket.emit('subscribe', { room: 'aivxRoom', socketId: socket.id });
    });
  
    socket.on('initReceive', socket_id => {
      console.log('INIT RECEIVE ' + socket_id)  
      addPeer(socket_id, false)
    });
  
    socket.on('initSend', data => {
      console.log('INIT SEND RECEIVED from ' + JSON.stringify(data))
      addPeer(data, true)
    });

    socket.on('signal', data => {
      peers[data.socket_id].signal(data.signal)
    });
  
    socket.on('removePeer', socket_id => {
      console.log('removing peer ' + socket_id);
      removePeer(socket_id);
    })
  
    socket.on('disconnect', () => {
      console.log('GOT DISCONNECTED')
      for (let socket_id in peers) {
        removePeer(socket_id);
      }
    });
  }

  const addPeer = async function (socket_id: String, am_initiator: Boolean) {
      console.log('add peer ' + socket_id + ' initiator? ' + am_initiator);
      peers[socket_id] = await new SimplePeer({
          initiator: am_initiator,
          stream: localStream,
          config: ICE_CONFIGURATION
      });
  
      if (am_initiator === false) {
        socket.emit('initSend', socket_id);
      }
      
      peers[socket_id].on('signal', data => {
        socket.emit('signal', {
          signal: data,
          socket_id: socket_id
        })
      })
  
      peers[socket_id].on('stream', stream => {
        const videoProps = {src: stream, socketId: socket_id};
        handleVideoListAdd(videoProps);
      })
  }
  
  function removePeer(socket_id: String) {
    handleVideoListRemove(socket_id);
    if (peers[socket_id]) peers[socket_id].destroy();
    delete peers[socket_id];
  }
    
  return <div></div>;
      
}