import React, { VideoHTMLAttributes, useEffect, useState, useRef } from 'react';
import Grid from '@material-ui/core/Grid';

type PropsType = VideoHTMLAttributes<HTMLVideoElement> & {
    srcObject: MediaStream
}

export default function VideoCard({srcObject, ...props }: PropsType) {
    const refVideo = useRef<HTMLVideoElement>(null);

    const [muted, setMuted] = useState(false);

    useEffect(() => {
      if (!refVideo.current) return
      refVideo.current.srcObject = srcObject
    }, [srcObject])

    useEffect(() => {
      if(props.socketId === 'local'){
        setMuted(true);
      }
    }, [props.socketId]);
  
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
    return (
      <Grid item xs={sizes[0]} sm={sizes[1]} md={sizes[2]} lg={sizes[3]} xl={sizes[4]}>
        <h4>{props.socketId}</h4>
          <video
            ref={refVideo}
            autoPlay={true}
            width={'100%'}
            muted={muted}
           />
      </Grid>
    );
  }
  