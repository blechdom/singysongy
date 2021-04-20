import React, { useEffect, useRef, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import Divider from '@material-ui/core/Divider';
import FormGroup from '@material-ui/core/FormGroup';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Typography from '@material-ui/core/Typography';
import Drawer from '@material-ui/core/Drawer';
import ChevronRight from '@material-ui/icons/ChevronRight';
import IconButton from '@material-ui/core/IconButton';
import Slider from '@material-ui/core/Slider';
import { REVERB_PRESET_LIST } from './constants';
import Jungle from './webAudio/jungle.js';
import Reverb from './webAudio/reverb.js';
import Equalizer from './webAudio/equalizer.js';
import Compressor from './webAudio/compressor.js';
import { mixAudioTracks } from './audioUtils.ts';

const drawerWidth = 350;

const useStyles = makeStyles((theme) => ({
  slider: {
    width: 270,
    align: 'center',
    left: '40px'
  },
  switch: {
    align: 'center',
    left: '40px'
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
  },
  drawerBody: {
    padding: theme.spacing(1),
    margin: theme.spacing(1),
  },
  select: {
    minWidth: 240,
    paddingLeft: theme.spacing(4)
  },
}));

export default function AudioFXDrawer({ 
  audioFXOpen, 
  audioCtx, 
  stream, 
  updateLocalStreamAudio, 
  handleAudioFXDrawerClose, 
  remoteGain
}) {
  const classes = useStyles();
  const [monitor, setMonitor] = React.useState<boolean>(false);
  const [monitorGain, setMonitorGain] = React.useState<number>(0);
  const [laughSoundBuffer, setLaughSoundBuffer] = useState(null);
  const [noooSoundBuffer, setNoooSoundBuffer] = useState(null);
  const [whistleSoundBuffer, setWhistleSoundBuffer] = useState(null);
  const [hornSoundBuffer, setHornSoundBuffer] = useState(null);
  const [eq, setEq] = useState(false);
  const [comp, setComp] = useState(false);
  const [pitchShift, setPitchShift] = useState(false);
  const [pitchOffsetAmount, setPitchOffsetAmount] = useState(0);
  const [reverb, setReverb] = useState(false);
  const [reverbWetGain, setReverbWetGain] = useState(0.5);
  const [reverbDryGain, setReverbDryGain] = useState(0.5);
  const [reverbPreset, setReverbPreset] = useState('MediumHall');
  const [pitchShiftWetGain, setPitchShiftWetGain] = useState(0.99);
  const [pitchShiftDryGain, setPitchShiftDryGain] = useState(0);
  const [samples, setSamples] = useState(false);
  const [samplesGainValue, setSamplesGainValue] = useState(0);

  const [compressorGain, setCompressorGain] = useState(1.0);
  const [compressorThreshold, setCompressorThreshold] = useState(-50);
  const [compressorKnee, setCompressorKnee] = useState(40);
  const [compressorRatio, setCompressorRatio] = useState(12);
  const [compressorAttack, setCompressorAttack] = useState(0.003);
  const [compressorRelease, setCompressorRelease] = useState(0.25);

  const [eqGain, setEqGain] = useState(1.0);
  const [lowEQSlider, setLowEQSlider] = useState(0);
  const [lowMidEQSlider, setLowMidEQSlider] = useState(0);
  const [midEQSlider, setMidEQSlider] = useState(0);
  const [highMidEQSlider, setHighMidEQSlider] = useState(0);
  const [highEQSlider, setHighEQSlider] = useState(0);

  let input = useRef(null);
  let equalizer = useRef(null);
  let compressor = useRef(null);
  let pitchShifter = useRef(null);
  let reverberator = useRef(null);
  let samplesGain = useRef(null);
  let samplesDestination = useRef(null);
  let remoteAudioGain = useRef(null);
  let remoteAudioDestination = useRef(null);
  let localOutputVolume = useRef(null);
  let eqToCompressorPassthrough = useRef(null);
  let compressorToPitchshiftPassthrough = useRef(null);
  let pitchshiftToReverbPassthrough = useRef(null);

  useEffect(() => {
    if(audioCtx !== null){
      samplesDestination.current = audioCtx.createMediaStreamDestination();
      remoteAudioDestination.current = audioCtx.createMediaStreamDestination();
      remoteAudioGain.current = audioCtx.createGain();
      remoteAudioGain.current.gain.value = remoteGain;
      localOutputVolume.current = audioCtx.createGain();
      localOutputVolume.current.gain.value = monitorGain;
      eqToCompressorPassthrough.current = audioCtx.createGain();
      compressorToPitchshiftPassthrough.current = audioCtx.createGain();
      pitchshiftToReverbPassthrough.current = audioCtx.createGain();
      samplesGain.current = audioCtx.createGain();
      samplesGain.current.gain.value = samplesGainValue;
      samplesGain.current.connect(samplesDestination.current);
      samplesGain.current.connect(localOutputVolume.current);
      remoteAudioGain.current.connect(remoteAudioDestination.current);

      initSamples();

      input.current = audioCtx.createMediaStreamSource(stream);

      input.current.connect(eqToCompressorPassthrough.current);
      eqToCompressorPassthrough.current.connect(compressorToPitchshiftPassthrough.current);
      compressorToPitchshiftPassthrough.current.connect(pitchshiftToReverbPassthrough.current);
      pitchshiftToReverbPassthrough.current.connect(remoteAudioGain.current);
      pitchshiftToReverbPassthrough.current.connect(localOutputVolume.current);

      equalizer.current =  new Equalizer(audioCtx);
      compressor.current = new Compressor(audioCtx);
      
      pitchShifter.current =  new Jungle(audioCtx);
      pitchShifter.current.setPitchOffset(pitchOffsetAmount);

      reverberator.current =  new Reverb(audioCtx, 'MediumHall');
      reverberator.current.setReverbPreset(reverbPreset);
      reverberator.current.setReverbDryGain(reverbDryGain);
      reverberator.current.setReverbWetGain(reverbWetGain);

      var originalTrack = stream.getAudioTracks()[0];
      stream.removeTrack(originalTrack);
      var mixedTrack = mixAudioTracks(audioCtx, samplesDestination.current.stream, remoteAudioDestination.current.stream);
      stream.addTrack(mixedTrack);
      updateLocalStreamAudio(stream);
    }
  }, [stream]);

  useEffect(() => {
    if(remoteAudioGain.current && remoteGain){
      remoteAudioGain.current.gain.value = remoteGain;
    }
  }, [remoteGain]);

  useEffect(() => {
    if(localOutputVolume.current && monitorGain){
      localOutputVolume.current.gain.value = monitorGain;
    }
  }, [monitorGain]);

  useEffect(() => {
    if(localOutputVolume.current){
      if(monitor){
        localOutputVolume.current.connect(audioCtx.destination);
      }
      else {
        localOutputVolume.current.disconnect();
      }
    }
    
  }, [monitor, audioCtx?.destination]);

  useEffect(() => {
    if (equalizer.current){
      if(eq) {
        input.current.disconnect(eqToCompressorPassthrough.current);
        input.current.connect(equalizer.current.input);
        equalizer.current.output.connect(eqToCompressorPassthrough.current);
      }
      else {
        input.current.disconnect(equalizer.current.input);
        equalizer.current.output.disconnect(eqToCompressorPassthrough.current);
        input.current.connect(eqToCompressorPassthrough.current);
      }
    }
  }, [eq]);

  useEffect(() => {
    if (compressor.current){
      if(comp) {
        eqToCompressorPassthrough.current.disconnect(compressorToPitchshiftPassthrough.current);
        eqToCompressorPassthrough.current.connect(compressor.current.input);
        compressor.current.output.connect(compressorToPitchshiftPassthrough.current);
        compressor.current.setCompressorGain(compressorGain);
      }
      else {
        eqToCompressorPassthrough.current.disconnect(compressor.current.input);
        compressor.current.output.disconnect(compressorToPitchshiftPassthrough.current);
        eqToCompressorPassthrough.current.connect(compressorToPitchshiftPassthrough.current);
      }
    }
  }, [comp]);

  useEffect(() => {
    if (pitchShifter.current){
      if(pitchShift) {
        compressorToPitchshiftPassthrough.current.disconnect(pitchshiftToReverbPassthrough.current);
        compressorToPitchshiftPassthrough.current.connect(pitchShifter.current.input);
        pitchShifter.current.output.connect(pitchshiftToReverbPassthrough.current);
        pitchShifter.current.setJungleWetGain(pitchShiftWetGain);
        pitchShifter.current.setJungleDryGain(pitchShiftDryGain);
      }
      else {
        compressorToPitchshiftPassthrough.current.disconnect(pitchShifter.current.input);
        pitchShifter.current.output.disconnect(pitchshiftToReverbPassthrough.current);
        compressorToPitchshiftPassthrough.current.connect(pitchshiftToReverbPassthrough.current);
      }
    }
  }, [pitchShift]);

  useEffect(() => {
    if(pitchShifter.current){
      pitchShifter.current.setPitchOffset(pitchOffsetAmount);
    }
  }, [pitchOffsetAmount]);

  useEffect(() => {
    if (reverberator.current){
      if(reverb) {
        pitchshiftToReverbPassthrough.current.disconnect(remoteAudioGain.current);
        pitchshiftToReverbPassthrough.current.disconnect(localOutputVolume.current);
        pitchshiftToReverbPassthrough.current.connect(reverberator.current.input);
        reverberator.current.output.connect(remoteAudioGain.current);
        reverberator.current.output.connect(localOutputVolume.current);
      }
      else {
        pitchshiftToReverbPassthrough.current.disconnect(reverberator.current.input);
        reverberator.current.output.disconnect(remoteAudioGain.current);
        reverberator.current.output.disconnect(localOutputVolume.current);
        pitchshiftToReverbPassthrough.current.connect(remoteAudioGain.current);
        pitchshiftToReverbPassthrough.current.connect(localOutputVolume.current);
      }
    }
  }, [reverb]);

  useEffect(() => {
    if(reverberator.current){
      reverberator.current.setReverbPreset(reverbPreset);
    }
  }, [reverbPreset]);

  useEffect(() => {
    if(reverberator.current){
      reverberator.current.setReverbWetGain(reverbWetGain);
    }
  }, [reverbWetGain]);

  useEffect(() => {
    if(reverberator.current){
      reverberator.current.setReverbDryGain(reverbDryGain);
    }
  }, [reverbDryGain]);

  useEffect(() => {
    if(pitchShifter.current){
      pitchShifter.current.setJungleWetGain(pitchShiftWetGain);
    }
  }, [pitchShiftWetGain]);

  useEffect(() => {
    if(pitchShifter.current){
      pitchShifter.current.setJungleDryGain(pitchShiftDryGain);
    }
  }, [pitchShiftDryGain]);

  useEffect(() => {
    if(equalizer.current){
      equalizer.current.setEqGain(eqGain);
    }
  }, [eqGain]);

  useEffect(() => {
    if(equalizer.current){
      equalizer.current.changeHighEQ(highEQSlider);
    }
  }, [highEQSlider]);
  useEffect(() => {
    if(equalizer.current){
      equalizer.current.changeHighMidEQ(highMidEQSlider);
    }
  }, [highMidEQSlider]);
  useEffect(() => {
    if(equalizer.current){
      equalizer.current.changeMidEQ(midEQSlider);
    }
  }, [midEQSlider]);
  useEffect(() => {
    if(equalizer.current){
      equalizer.current.changeLowMidEQ(lowMidEQSlider);
    }
  }, [lowMidEQSlider]);
  useEffect(() => {
    if(equalizer.current){
      equalizer.current.changeLowEQ(lowEQSlider);
    }
  }, [lowEQSlider]);


  useEffect(() => {
    if(compressor.current){
      compressor.current.setCompressorGain(compressorGain);
    }
  }, [compressorGain]);


  useEffect(() => {
    if(compressor.current){
      compressor.current.setCompressorThreshold(compressorThreshold);
    }
  }, [compressorThreshold]);

  useEffect(() => {
    if(compressor.current){
      compressor.current.setCompressorKnee(compressorKnee);
    }
  }, [compressorKnee]);

  useEffect(() => {
    if(compressor.current){
      compressor.current.setCompressorRatio(compressorRatio);
    }
  }, [compressorRatio]);

  useEffect(() => {
    if(compressor.current){
      compressor.current.setCompressorAttack(compressorAttack);
    }
  }, [compressorAttack]);

  useEffect(() => {
    if(compressor.current){
      compressor.current.setCompressorRelease(compressorRelease);
    }
  }, [compressorRelease]);

  useEffect(() => {
    if(samplesGain.current){
      samplesGain.current.gain.value = samplesGainValue;
    }
  }, [samplesGainValue]);

  async function initSamples() {
    await loadSound('audio/laugh.wav', 'laugh');
    await loadSound('audio/horn.wav', 'horn');
    await loadSound('audio/whistle.wav', 'whistle');
    await loadSound('audio/nooo.wav', 'nooo');
  }

  function loadSound(url, soundName) {
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'arraybuffer';
    request.onload = function() {
        audioCtx.decodeAudioData(request.response,
        function(decodedAudio) {
            switch(soundName) {
                case 'laugh':
                    setLaughSoundBuffer(decodedAudio);
                    break;
                case 'horn':
                    setHornSoundBuffer(decodedAudio);
                    break;
                case 'whistle':
                    setWhistleSoundBuffer(decodedAudio);
                    break;
                case 'nooo':
                    setNoooSoundBuffer(decodedAudio);
                    break;
            }
        },
        function() {
            alert('error decoding file data: ' + url);
        });
    };
    request.send();
  }

  function laugh() {
    var laughSound = audioCtx.createBufferSource(); 
    laughSound.buffer = laughSoundBuffer;
    if (samplesGain.current) {
      laughSound.connect(samplesGain.current);
      laughSound.start(0);
    }
  }
  function whistle() {
      var whistleSound = audioCtx.createBufferSource();
      whistleSound.buffer = whistleSoundBuffer;
      if (samplesGain.current) {
          whistleSound.connect(samplesGain.current);
          whistleSound.start(0);
      }
  }
  function nooo() {
      var noooSound = audioCtx.createBufferSource();
      noooSound.buffer = noooSoundBuffer;
      if (samplesGain.current) {
          noooSound.connect(samplesGain.current);
          noooSound.start(0);
      }
  }
  function horn() {
      var hornSound = audioCtx.createBufferSource();
      hornSound.buffer = hornSoundBuffer;
      if (samplesGain.current) {
          hornSound.connect(samplesGain.current);
          hornSound.start(0);
      }
  }

  const handleMonitorCheckbox = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMonitor(event.target.checked);
  };

  const handleMonitorGainChange = (event: any, newValue: number | number[]) => {
    setMonitorGain(newValue as number);
  };

  const handlePitchShiftCheckbox = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPitchShift(event.target.checked);
  };

  const handlePitchOffsetChange = (event: any, newValue: number | number[]) => {
    setPitchOffsetAmount(newValue as number);
  };
  const handlePitchShiftGainChange = (event: any, newValue: number | number[]) => {
    setPitchShiftWetGain(newValue as number);
    setPitchShiftDryGain(1.0 - newValue as number);
  };

  const handleReverbCheckbox = (event: React.ChangeEvent<HTMLInputElement>) => {
    setReverb(event.target.checked);
  };

  const handleReverbGainChange = (event: any, newValue: number | number[]) => {
    setReverbWetGain(newValue as number);
    setReverbDryGain(1 - newValue as number);
  };

  const handleReverbPresetSelect = (event: React.ChangeEvent<{ value: string }>) => {
    setReverbPreset(event.target.value);
  };

  const handleEqCheckbox = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEq(event.target.checked);
  };

  const handleEqGain = (event: any, newValue: number | number[]) => {
    setEqGain(newValue as number);
  };

  const handleHighEQ = (event: any, newValue: number | number[]) => {
    setHighEQSlider(newValue as number);
  };

  const handleLowMidEQ = (event: any, newValue: number | number[]) => {
    setLowMidEQSlider(newValue as number);
  };

  const handleMidEQ  = (event: any, newValue: number | number[]) => {
    setMidEQSlider(newValue as number);
  };

  const handleHighMidEQ = (event: any, newValue: number | number[]) => {
    setHighMidEQSlider(newValue as number);
  };

  const handleLowEQ = (event: any, newValue: number | number[]) => {
    setLowEQSlider(newValue as number);
  };

  const handleCompCheckbox = (event: React.ChangeEvent<HTMLInputElement>) => {
    setComp(event.target.checked);
  };

  const handleCompressorGainChange = (event: any, newValue: number | number[]) => {
    setCompressorGain(newValue as number);
  };

  const handleCompressorThresholdChange = (event: any, newValue: number | number[]) => {
    setCompressorThreshold(newValue as number);
  };

  const handleCompressorKneeChange = (event: any, newValue: number | number[]) => {
    setCompressorKnee(newValue as number);
  };

  const handleCompressorRatioChange = (event: any, newValue: number | number[]) => {
    setCompressorRatio(newValue as number);
  };

  const handleCompressorAttackChange = (event: any, newValue: number | number[]) => {
    setCompressorAttack(newValue as number);
  };

  const handleCompressorReleaseChange = (event: any, newValue: number | number[]) => {
    setCompressorRelease(newValue as number);
  };

  const handleSamplesCheckbox = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSamples(event.target.checked);
  };

  const handleSamplesGainChange = (event: any, newValue: number | number[]) => {
    setSamplesGainValue(newValue as number);
  };

  return(
    <div > 
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="right"
        open={audioFXOpen}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={handleAudioFXDrawerClose}>
            <ChevronRight />
          </IconButton>
          <h1>AUDIO</h1>
        </div>
        <Divider />
        <div className={classes.drawerBody}>
        <FormGroup row>
          <FormControlLabel
            control={   
              <Checkbox
                checked={monitor}
                onChange={handleMonitorCheckbox}
                color="secondary"
              /> 
            }
            label='Monitor My Audio'
          />
        </FormGroup> 
        {monitor && <div>
          <Slider 
            className={classes.slider}
              padding={3} 
              value={monitorGain} 
              onChange={handleMonitorGainChange} 
              min={0.0} 
              max={1.0} 
              step={0.00000001}
            /> 
          </div>
        } 
        <FormGroup row>
          <FormControlLabel
            control={   
              <Checkbox
                checked={eq}
                onChange={handleEqCheckbox}
                color="secondary"
              /> 
            }
            label='Equalizer'
          />
        </FormGroup> 
        { eq && 
          <div>
            <Typography id="highEq" gutterBottom>
              High
            </Typography>
            <Slider 
              className={classes.slider}
              padding={3} 
              value={highEQSlider} 
              onChange={handleHighEQ} 
              min={-40} 
              max={40} 
              step={0.1}
              aria-labelledby="highEq"
            /> 
            <Typography id="highMidEq" gutterBottom>
              High-Mid
            </Typography>
            <Slider 
              className={classes.slider}
              padding={3} 
              value={highMidEQSlider} 
              onChange={handleHighMidEQ} 
              min={-40} 
              max={40} 
              step={0.1}
              aria-labelledby="highMidEq"
            /> 
            <Typography id="midEq" gutterBottom>
              Mid
            </Typography>
            <Slider 
              className={classes.slider}
              padding={3} 
              value={midEQSlider} 
              onChange={handleMidEQ} 
              min={-40} 
              max={40} 
              step={0.1}
              aria-labelledby="midEq"
            /> 
            <Typography id="lowMidEq" gutterBottom>
              Low-Mid
            </Typography>
            <Slider 
              className={classes.slider}
              padding={3} 
              value={lowMidEQSlider} 
              onChange={handleLowMidEQ} 
              min={-40} 
              max={40} 
              step={0.1}
              aria-labelledby="lowMidEq"
            /> 
            <Typography id="lowEq" gutterBottom>
              Low
            </Typography>
            <Slider 
              className={classes.slider}
              padding={3} 
              value={lowEQSlider} 
              onChange={handleLowEQ} 
              min={-40} 
              max={40} 
              step={0.1}
              aria-labelledby="lowEq"
            /> 
            <Typography id="eqGain" gutterBottom>
              Gain
            </Typography>
            <Slider 
              className={classes.slider}
              padding={3} 
              value={eqGain} 
              onChange={handleEqGain} 
              min={0} 
              max={1.0} 
              step={0.00001}
              aria-labelledby="eqGain"
            />
          </div>
        }
        <FormGroup row>
          <FormControlLabel
            control={   
              <Checkbox
                checked={comp}
                onChange={handleCompCheckbox}
                color="secondary"
              /> 
            }
            label='Compressor'
          />
        </FormGroup> 
        { comp && 
          <div>
            <Typography id="compressorThreshold" gutterBottom>
              Threshold
            </Typography>
            <Slider 
              className={classes.slider}
              padding={3} 
              value={compressorThreshold} 
              onChange={handleCompressorThresholdChange} 
              min={-100} 
              max={0} 
              step={0.1}
              aria-labelledby="compressorThreshold"
            />  
            <Typography id="compressorKnee" gutterBottom>
              Knee
            </Typography>
            <Slider 
              className={classes.slider}
              padding={3} 
              value={compressorKnee} 
              onChange={handleCompressorKneeChange} 
              min={0} 
              max={40} 
              step={0.1}
              aria-labelledby="compressorKnee"
            />  
            <Typography id="compressorRatio" gutterBottom>
              Ratio
            </Typography>
            <Slider 
              className={classes.slider}
              padding={3} 
              value={compressorRatio} 
              onChange={handleCompressorRatioChange} 
              min={1} 
              max={20} 
              step={0.1}
              aria-labelledby="compressorRatio"
            />  
            <Typography id="compressorAttack" gutterBottom>
              Attack
            </Typography>
            <Slider 
              className={classes.slider}
              padding={3} 
              value={compressorAttack} 
              onChange={handleCompressorAttackChange} 
              min={0} 
              max={1.0} 
              step={0.00001}
              aria-labelledby="compressorAttack"
            />  
            <Typography id="compressorRelease" gutterBottom>
              Release
            </Typography>
            <Slider 
              className={classes.slider}
              padding={3} 
              value={compressorRelease} 
              onChange={handleCompressorReleaseChange} 
              min={0} 
              max={1.0} 
              step={0.00001}
              aria-labelledby="compressorRelease"
            />  
            <Typography id="compressorGain" gutterBottom>
              Gain
            </Typography>
            <Slider 
              className={classes.slider}
              padding={3} 
              value={compressorGain} 
              onChange={handleCompressorGainChange} 
              min={0} 
              max={1.0} 
              step={0.00001}
              aria-labelledby="compressorGain"
            />
          </div>
        }
        <FormGroup row>
          <FormControlLabel
            control={   
              <Checkbox
                checked={pitchShift}
                onChange={handlePitchShiftCheckbox}
                color="secondary"
              /> 
            }
            label='Pitch Shifter'
          />
        </FormGroup> 
        { pitchShift && 
          <div>
            <Typography id="pitch" gutterBottom>
              Pitch ({pitchOffsetAmount})
            </Typography>
            <Slider 
            className={classes.slider}
              padding={3} 
              value={pitchOffsetAmount} 
              onChange={handlePitchOffsetChange} 
              min={-1.5} 
              max={1.5} 
              step={0.01}
              aria-labelledby="pitch"
            /> 
            <Typography id="pitch-shift-gain" gutterBottom>
              Dry - Wet
            </Typography>
            <Slider 
              className={classes.slider}
              padding={3} 
              value={pitchShiftWetGain} 
              onChange={handlePitchShiftGainChange} 
              min={0.0} 
              max={1.0} 
              step={0.00000001}
              aria-labelledby="pitch-shift-gain"
            /> 
          </div>
        }
        <FormGroup row>
          <FormControlLabel
            control={   
              <Checkbox
                checked={reverb}
                onChange={handleReverbCheckbox}
                color="secondary"
              /> 
            }
            label='Reverb'
          />
        </FormGroup> 
        { reverb && 
          <div>
            <Typography gutterBottom>
              Preset
            </Typography>
            <FormControl className={classes.select}>
              <Select
              variant="outlined"
                value={reverbPreset}
                onChange={handleReverbPresetSelect}
              >
                {REVERB_PRESET_LIST.map((preset) => (
                  <MenuItem key={preset} value={preset}>
                    {preset}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Typography id="reverb-wet" gutterBottom>
              Dry - Wet
            </Typography>
            <Slider 
              className={classes.slider}
              padding={3} 
              value={reverbWetGain} 
              onChange={handleReverbGainChange} 
              min={0.0} 
              max={1.0} 
              step={0.00000001}
              aria-labelledby="reverb-wet"
            /> 
          </div>
        }
        <FormGroup row>
          <FormControlLabel
            control={   
              <Checkbox
                checked={samples}
                onChange={handleSamplesCheckbox}
                color="secondary"
              /> 
            }
            label='Samples'
          />
        </FormGroup> 
        { samples && <div>
          <Typography id="samples-gain" gutterBottom>
            Volume
          </Typography>
          <Slider 
          className={classes.slider}
            padding={3} 
            value={samplesGainValue} 
            onChange={handleSamplesGainChange}
            max={1.0} 
            step={0.00000001}
            aria-labelledby="samples-gain"
          /> 
            <Button variant="outlined" id='laugh' onClick={laugh}>
              Laugh
            </Button>
            <Button variant="outlined" id='nooo' onClick={nooo}>
              Nooo
            </Button>
            <Button variant="outlined" id='horn' onClick={horn}>
              Horn
            </Button>
            <Button variant="outlined" id='whistle' onClick={whistle}>
              Whistle
            </Button>
          </div>
        }
        </div>
        </Drawer>
    </div>
  );
}