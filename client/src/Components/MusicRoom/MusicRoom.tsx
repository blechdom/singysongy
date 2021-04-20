import React, { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import RecordVoiceOverIcon from '@material-ui/icons/RecordVoiceOver';
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import SocketsAndPeers from './SocketsAndPeers';
import { USER_MEDIA_CONSTRAINTS } from './constants';
import VideoCard from './VideoCard';
import AudioFXDrawer from './AudioFXDrawer';
import CommsDrawer from './CommsDrawer';
import PeersAudio from './webAudio/peersAudio.js';

const drawerWidth = 350;

const useStyles = makeStyles((theme) => ({
  audioFXButton: {
    position: 'absolute',
    right: '20px',
    top: '10px', 
  },
  commsButton: {
    position: 'absolute',
    right: '60px',
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
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginRight: 0,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: +drawerWidth,
  },
}));

export default function MusicRoom() {
  const AudioContext = window.AudioContext || window.webkitAudioContext;

  const classes = useStyles();

  const [audioFXOpen, setAudioFXOpen] = React.useState<boolean>(false);
  const [commsOpen, setCommsOpen] = React.useState<boolean>(false);
  const [videoList, setVideoList] = React.useState([]);
  const [socketComponent, setSocketComponent] = React.useState([]);
  const [audioCtx, setAudioCtx] = useState(null);
  const [chatMessage, setChatMessage] = useState(null);
  const [remoteGain, setRemoteGain] = useState(1.0);

  let localStream = useRef(null);
  let mediaStream = useRef(null);
  let peersAudio = useRef(null);

  useEffect(() => {
    if(audioCtx === null){
      setAudioCtx(new AudioContext());
    }
    return () => { 
      setAudioCtx(null);
    };
  }, []);

  useEffect(() => {
    if(audioCtx !== null){
      
      peersAudio.current = new PeersAudio(audioCtx);

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
    return () => { 
      if(localStream.current){
        localStream.current.getTracks().forEach(track => {
          track.stop();
        });
      }
    };
    
  }, [audioCtx]);
  
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
          />;
  }

  function createVideos() {
    if(videoList?.length)
      return videoList.map(props => {
        return createVideo(props, videoList.length);
      });
  }

  const handleAudioFXDrawerOpen = () => {
    setAudioFXOpen(true);
  };

  const handleAudioFXDrawerClose = () => {
    setAudioFXOpen(false);
  };

  const handleCommsDrawerOpen = () => {
    setCommsOpen(true);
  };

  const handleCommsDrawerClose = () => {
    setCommsOpen(false);
  };

  return(
    <div > 
        <IconButton
          className={classes.commsButton}
          color="secondary"
          aria-label="open comms drawer"
          edge="end"
          onClick={handleCommsDrawerOpen}
        >
          <ChatBubbleOutlineIcon />
        </IconButton>
        <IconButton
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
          [classes.contentShift]: (audioFXOpen || commsOpen),
        })}
      >
        <Grid container spacing={3}>
          {createVideos()}
        </Grid>
      </main>
        <AudioFXDrawer 
          audioFXOpen={audioFXOpen} 
          audioCtx={audioCtx} 
          stream={mediaStream.current} 
          updateLocalStreamAudio={updateLocalStreamAudio} 
          handleAudioFXDrawerClose={handleAudioFXDrawerClose} 
          remoteGain={remoteGain}
        />
        <CommsDrawer 
          commsOpen={commsOpen} 
          handleCommsDrawerClose={handleCommsDrawerClose} 
          chatMessage={chatMessage}
        />
        {socketComponent}
    </div>
  );
}