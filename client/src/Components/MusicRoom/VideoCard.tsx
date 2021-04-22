import React, { VideoHTMLAttributes, useEffect, useState, useRef } from 'react';
import FormGroup from '@material-ui/core/FormGroup';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Slider from '@material-ui/core/Slider';
import Typography from '@material-ui/core/Typography';

import MicIcon from '@material-ui/icons/Mic';
import MicOffIcon from '@material-ui/icons/MicOff';
import VideocamIcon from '@material-ui/icons/Videocam';
import VideocamOffIcon from '@material-ui/icons/VideocamOff';

import { makeStyles } from '@material-ui/core/styles';

type PropsType = VideoHTMLAttributes<HTMLVideoElement> & {
    srcObject: MediaStream
}

const useStyles = makeStyles((theme) => ({
	root: {
    flexGrow: 1,
  },
	slider: {
		color: 'white',
    width: 200,
		padding: '10px'
  },
  videoCard: {
    background: "#fff",
    '&:hover': {
			background: "#fff",
			position: "relative",
			top:0,
			left: 0,   
			height: "100%",
			width: "100%",
			zIndex: 9999,
			display:'inline-block',
    },
		bottom: 5,
  },
	video: {
		width: '100%',
    height: 'auto',
		bottom: 5,
	},
  videoOverlay: {
		position: 'absolute',
    bottom: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex:300000,
    padding: '10px',
    width: '100%',
    textAlign: 'center',
  },
	white: {
		color: 'white',
	}
}));

export default function VideoCard({srcObject, ...props }: PropsType) {
  const classes = useStyles();
  const refVideo = useRef<HTMLVideoElement>(null);

  const [mouseEnter, setMouseEnter] = useState(false);
  const [isShowing, setIsShowing] = useState(false);
	const [micOn, setMicOn] = useState(true);
	const [camOn, setCamOn] = useState(true);
	const [sliderVal, setSliderVal] = useState(1);

	useEffect(() => {
		if (!refVideo.current) return
		refVideo.current.srcObject = srcObject
	}, [srcObject])

	useEffect(() => {
		setIsShowing(mouseEnter);
	}, [mouseEnter]);

	useEffect(() => {
		props.updatePeersAudioVolume(props.socketId, sliderVal);
	}, [sliderVal]);

	useEffect(() => {
		props.updatePeersMute(props.socketId, micOn);
	}, [micOn]);

	let sizes = [12, 6, 4, 3, 2];
	if(props.numberOfVideos <=2){
		sizes = [12, 6, 6, 6, 6];
	}
	else if(props.numberOfVideos<=3){
		sizes = [6, 6, 4, 4, 4];
	}
	else if(props.numberOfVideos<=4){
		sizes = [6, 6, 4, 3, 3];
	}
	else if(props.numberOfVideos<=6){
		sizes = [6, 6, 4, 4, 2];
	}
	else if(props.numberOfVideos<=8){
		sizes = [6, 4, 4, 2, 2];
	}
	else{
		sizes = [4, 4, 3, 2, 2];
	}

	function handleMouseEnter() {
		setMouseEnter(true);
	}
	function handleMouseLeave() {
		setMouseEnter(false);
	}

	function toggleMic() {
		setMicOn(!micOn);
	}

	function toggleCam() {
		let newCam = !camOn;
		setCamOn(newCam);
		if(props.socketId === 'local'){
			props.updateLocalCam(newCam);
		}
	}

	const handleSliderChange = (event: any, newValue: number | number[]) => {
		setSliderVal(newValue as number);
	};

	return (
		<Grid item xs={sizes[0]} sm={sizes[1]} md={sizes[2]} lg={sizes[3]} xl={sizes[4]}>
			<div className={classes.videoCard} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
				<div className={classes.video}>
					<video
						ref={refVideo}
						autoPlay={true}
						width={'100%'}
						muted={true}
					/>
				</div>
				{ mouseEnter && 
					<div className={classes.videoOverlay}>
						<Grid 
							container 
							className={classes.root} 
							spacing={2} 
							direction="row"
							justify="space-between"
							alignItems="center"
						>
							<Grid item>
								<Typography align='center' variant='h5' className={classes.white}>{props.socketId}</Typography>
							</Grid>
						</Grid>
						<Grid 
							container 
							className={classes.root} 
							spacing={2} 
							direction="row"
							justify="space-between"
							alignItems="center"
						>
							<Grid item>
								<Slider 
									className={classes.slider}
									value={sliderVal}
									onChange={handleSliderChange}
									min={0.0} 
									max={1.0} 
									step={0.00000001}
								/> 
							</Grid>
							<Grid item>
								<IconButton aria-label="delete" color="primary" onClick={toggleMic}>
									{ micOn ? <MicIcon style={{fill: "white"}}/> : <MicOffIcon style={{fill: "red"}}/> }
								</IconButton>
								{ (props.socketId == 'local') && <IconButton aria-label="delete" color="primary" onClick={toggleCam}>
										{ camOn ? <VideocamIcon style={{fill: "white"}}/> : <VideocamOffIcon style={{fill: "red"}}/> }
									</IconButton>
								}
							</Grid>
						</Grid>
					</div>
				}
			</div>
		</Grid>
    );
  }
  