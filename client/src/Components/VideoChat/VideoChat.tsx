import React, { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import RecordVoiceOverIcon from '@material-ui/icons/RecordVoiceOver';
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import MusicNoteIcon from '@material-ui/icons/MusicNote';
import LoopIcon from '@material-ui/icons/Loop';
import ExitIcon from '@material-ui/icons/ExitToApp';
import TextField from '@material-ui/core/TextField';
import SocketsAndPeers from './SocketsAndPeers';
import { USER_MEDIA_CONSTRAINTS } from './constants';
import VideoCard from './VideoCard';
import AudioFXDrawer from './AudioFXDrawer';
import PeersAudio from './webAudio/peersAudio.js';

const useStyles = makeStyles((theme) => ({
  exitButton: {
    position: 'absolute',
    right: '20px',
    top: '10px', 
  },
  audioFXButton: {
    position: 'absolute',
    right: '20px',
    top: '10px', 
  },
  musicRoomTitle: {
    position: 'absolute',
    left: '10px',
    top: '10px', 
  },
  loopButton: {
    position: 'absolute',
    right: '60px',
    top: '10px', 
  },
  commsButton: {
    position: 'absolute',
    right: '100px',
    top: '10px', 
  },
  title: {
    flexGrow: 1,
    align: 'center',
    fontWeight: 600, 
    lineHeight: 1
  },
  slider: {
    width: 270,
    align: 'center',
    left: '40px'
  },
  switch: {
    align: 'center',
    left: '40px'
  },
}));

export default function VideoChat() {
  const AudioContext = window.AudioContext || window.webkitAudioContext;

  const classes = useStyles();

  const [audioFXOpen, setAudioFXOpen] = React.useState<boolean>(false);
  const [commsOpen, setCommsOpen] = React.useState<boolean>(false);
  const [loopOpen, setLoopOpen] = React.useState<boolean>(false);
  const [videoList, setVideoList] = React.useState([]);
  const [socketComponent, setSocketComponent] = React.useState([]);
  const [audioCtx, setAudioCtx] = useState(null);
  const [chatMessage, setChatMessage] = useState(null);
  const [remoteGain, setRemoteGain] = useState(1.0);
  const [remoteMute, setRemoteMute] = useState(1);
  const [roomName, setRoomName] = useState(null);
  const [roomNameSubmitted, setRoomNameSubmitted] = useState(false);

  let localStream = useRef(null);
  let mediaStream = useRef(null);
  let peersAudio = useRef(null);

  useEffect(() => {
    if(roomNameSubmitted){
      if(audioCtx === null){
        setAudioCtx(new AudioContext());
      }
      return () => { 
        setAudioCtx(null);
      };
    }
  }, [roomNameSubmitted]);

  useEffect(() => {
    if(audioCtx !== null){
      peersAudio.current = new PeersAudio(audioCtx);
      initMedia();
    }
    return () => { 
      if(localStream.current){
        localStream.current.getTracks().forEach(track => {
          track.stop();
        });
      }
    };
    
  }, [audioCtx]);

  function initMedia() {
    if ( userMediaAvailable() ) {
      navigator.mediaDevices.getUserMedia(USER_MEDIA_CONSTRAINTS).then(stream => {
        if (stream) {
          setVideoList(currentList => currentList.filter((remoteVid) => remoteVid.socketId !== 'local'));
          const videoProps = {src: stream, socketId: 'local'};
          setVideoList(oldArray => [...oldArray, videoProps]);
        }
        mediaStream.current = stream;
        localStream.current = stream;
        initSocketsAndPeers();
      }).catch(e => alert(`getusermedia error ${e.name}`))
    }
  }
  
  function updateLocalStreamAudio(updatedAudioStream) {
    localStream.current = updatedAudioStream;
  }

  function userMediaAvailable() {
    return !!( navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia );
  }

  function initSocketsAndPeers(){
    setSocketComponent(
      <SocketsAndPeers 
        handleVideoListAdd={handleVideoListAdd} 
        handleVideoListRemove={handleVideoListRemove} 
        localStream={localStream.current} 
        addChat={addChat} 
        roomName={'vid-' + roomName}
      />
    )
  }

  function handleVideoListAdd(videoProps) {
    console.log('video props ', videoProps);
    setVideoList(oldArray => [...oldArray, videoProps]);
    peersAudio.current.addPartner(videoProps.socketId, videoProps.src);
  }

  function handleVideoListRemove(socketId) {
    setVideoList(currentList => currentList.filter((remoteVid) => remoteVid.socketId !== socketId));
    peersAudio.current.removePartner(socketId);
  }

  function updatePeersAudioVolume(socketId, gainVal) {
    if(socketId === 'local'){
      setRemoteGain(gainVal);
    }
    else{
      console.log('update peers volume ', socketId, gainVal);
      peersAudio.current.updatePartnerGain(socketId, gainVal);
    }  
  }

  function updatePeersMute(socketId, micOn) {
    if(socketId === 'local'){
      setRemoteMute(micOn ? 1 : 0);
    }
    else{
      console.log('update peers Mute ', socketId, micOn);
      peersAudio.current.updatePartnerMute(socketId, micOn ? 1 : 0);
    }  
  }
  function updateLocalCam(camOn) {
    localStream.current.getTracks().forEach(function(track) {
      if (track.readyState == 'live' && track.kind === 'video') {
          track.enabled = camOn;
      }
    });
  }

  function addChat(data, isLocal) {
    console.log("chat received ", data, 'is local? ', isLocal);
    setChatMessage({ msg: data, isLocal});
  }

  function createVideo(props, numberOfVideos) {
    return <VideoCard 
            srcObject={props.src} 
            socketId={props.socketId} 
            key={props.socketId} 
            numberOfVideos={numberOfVideos} 
            updatePeersAudioVolume={updatePeersAudioVolume}
            updatePeersMute={updatePeersMute}
            updateLocalCam={updateLocalCam}
          />;
  }

  function createVideos() {
    if(videoList?.length)
      return videoList.map(props => {
        return createVideo(props, videoList.length);
      });
  }

  const handleRoomNameChange = (e) => {
    setRoomName(e.target.value);
  }
  const submitRoomName = (e) => {
    let response = window.confirm(`WARNING: Headphones Required! The audio settting do not protect against feedback!`);
    if (response) {
      if(roomName != null){
        setRoomNameSubmitted(true);
      }
      else{
        alert('room name required to join');
      }
    }  
  }
  const handleExitButton = () => {
   
    let response = window.confirm(`You are leaving the ${roomName} room. Are you sure you would like to exit?`);
    if (response) {
      setRoomName(null);
      setRoomNameSubmitted(false);
    }
  }

  return(
    <div > 
      { !roomNameSubmitted && <div>
        <Box
          display="flex" 
          width='100%' height='100%'
        >
        <Box m='auto' pt='100px'>       
            <Typography variant='h2'>Singy Songy Video Chat</Typography><br/>
            <Typography variant='h6'>Create a Room or Join an Existing Room by Typing the Name Below!</Typography> <br/><br/>    
            <Typography variant='h6' color='Secondary'>Headphones Required!</Typography> <br/><br/>     
            <TextField id="music-room-name" label="Room Name" variant="outlined" onChange={handleRoomNameChange}/><br/><br/>
            <Button variant='contained' color="secondary" onClick={submitRoomName}>Join!</Button>
          </Box>
        </Box>
        </div>
      }
      { roomNameSubmitted && <div> 
        <Box
          display="flex" 
          width='100%' height='100%'
        >
          <Box m='auto' pt={6}> 
            <Typography variant='h6' className={classes.roomTitle}>Room: {roomName}</Typography>
          </Box>
        </Box>
        {/*<IconButton
          className={classes.audioFXButton}
          color="secondary"
          aria-label="open audio FX drawer"
          edge="end"
          onClick={handleAudioFXDrawerOpen}
        >
          <RecordVoiceOverIcon />
        </IconButton>
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: (audioFXOpen || commsOpen || loopOpen),
        })}
      >*/}
        <Grid container spacing={3}>
          {createVideos()}
        </Grid>
      {/*</main>*/}
        <AudioFXDrawer 
          audioCtx={audioCtx} 
          stream={mediaStream.current} 
          updateLocalStreamAudio={updateLocalStreamAudio} 
          remoteGain={remoteGain}
          remoteMute={remoteMute}
        />
        {socketComponent}
        </div> 
      } 
    </div>
  );
}