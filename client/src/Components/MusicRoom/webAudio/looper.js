import Recorder from './recorder.js';

export default function Looper (context, createLoopControl, updateButtonText) {

	this.context = context;
	this.createLoopControl = createLoopControl;
	this.updateButtonText = updateButtonText;
	this.input = context.createGain();
	this.output = context.createGain();

	this.recorder = new Recorder(this.input);
	
	this.input.gain.value = 0.5;
	this.input.connect(this.output);
						
	this.playback = false;
	this.overdubbing = false;
	this.overdubFlag = false;

	this.rec1 = null;
	this.loopLength = null;
	this.loopRepetition = null;
	this.loopBuffers = [];
	this.loopSources = [];
	this.loopGains = [];
	this.stopLoop = false;
	this.loopInterval = null;
}

Looper.prototype.recordNewLoop = function() {
	this.recorder.record();
}

Looper.prototype.getNewLoopAndPlay = function() {
	console.log('get new loop and play');
	this.recorder.stop();
	this.playLoops();
}

Looper.prototype.startOverdubRecording = function() {
	if(this.overdubFlag){
		this.updateButtonText('Overdubbing Now... Will Auto-Stop');
		this.overdubFlag = false;
		this.recorder.record();
		const this2 = this;
		setTimeout(function(){
			this2.updateButtonText('Push to Overdub');
			console.log('inside start to play overdub');
			this2.getNewLoopAndPlay();
		}, this2.loopLength*1000 );
	}
}

Looper.prototype.addOverdub = function() {
	this.overdubFlag = true;
	console.log('set overdub flag, then move to event listener that recieves a trigger at loop beginning, and times out at looplength');
}

Looper.prototype.addLoop = function() {
	console.log('playing last recording');
	let this2 = this;
	this.recorder.getBuffer(function (buffers) {
	
		this2.loopBuffers.push(this2.context.createBuffer(2, buffers[0].length, this2.context.sampleRate));
		const loopId = this2.loopBuffers.length - 1;
		console.log('new loop ID ', loopId);

		this2.loopBuffers[loopId].getChannelData(0).set(buffers[0]);
		this2.loopBuffers[loopId].getChannelData(1).set(buffers[1]);
		this2.recorder.clear();

		if(loopId === 0){
			this2.loopLength = this2.loopBuffers[loopId].duration;
		}

		this2.loopGains[loopId] = this2.context.createGain();
		this2.loopGains[loopId].connect(this2.output);

		this2.createLoopControl(loopId);
	});
}
Looper.prototype.playLoops = function() {
	console.log('play loops');
	let this2 = this;
	this.recorder.getBuffer(function (buffers) {
	
		this2.loopBuffers.push(this2.context.createBuffer(2, buffers[0].length, this2.context.sampleRate));
		const loopId = this2.loopBuffers.length - 1;
		console.log('new loop ID ', loopId);

		this2.loopBuffers[loopId].getChannelData(0).set(buffers[0]);
		this2.loopBuffers[loopId].getChannelData(1).set(buffers[1]);
		
		if(loopId === 0){
			this2.loopLength = this2.loopBuffers[loopId].duration;
		}

		this2.loopGains[loopId] = this2.context.createGain();
		this2.loopGains[loopId].connect(this2.output);

		this2.createLoopControl(loopId);
		this2.stop();
		this2.loopIt();
	});
}

Looper.prototype.loopIt = function() {
	this.loopBuffers.forEach((loopBuffer, index) => {
		this.loopSources[index] = this.context.createBufferSource();
		this.loopSources[index].buffer = loopBuffer;
		this.loopSources[index].connect(this.loopGains[index]);
		this.loopSources[index].start(0);
	});

	const this2 = this;
	this2.loopInterval = setInterval(function(){
		this2.startOverdubRecording();
		this2.loopBuffers.forEach((loopBuffer, index) => {
			this2.loopSources[index] = this2.context.createBufferSource();
			this2.loopSources[index].buffer = loopBuffer;
			this2.loopSources[index].connect(this2.loopGains[index]);
			this2.loopSources[index].start(0);
		});
	}, this2.loopLength * 1000 );
}

Looper.prototype.stop = function() {
	this.recorder.stop();
	this.recorder.clear();
	this.loopSources.forEach((loopSource) => {
		loopSource.stop();
	});
	clearInterval(this.loopInterval);
}

Looper.prototype.play = function() {	
	this.stop();	
	this.loopIt();
}

Looper.prototype.clearAll = function() {
	this.recorder.stop();
	this.recorder.clear();		
	clearInterval(this.loopInterval);
	this.loopSources.forEach((loopSource) => {
		loopSource.stop();
	});
	this.loopBuffers = [];
	this.loopGains = [];
	this.loopSources = [];
	this.loopLength = null;
}



