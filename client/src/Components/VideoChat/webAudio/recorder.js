import WebWorker from '../../../WebWorker';
import RecorderWorker from './recorder.worker';

export default function Recorder(source, cfg) {
  let bufferLen = 4096;
  this.context = source.context;
  this.node = (this.context.createScriptProcessor ||
    this.context.createJavaScriptNode).call(this.context, bufferLen, 2, 2);
  let worker = new WebWorker(RecorderWorker);
  worker.postMessage({
    command: 'init',
    config: {
      sampleRate: this.context.sampleRate
    }
  });
  let recording = false,
    currCallback;

  this.node.onaudioprocess = function(e){
    if (!recording) return;
    worker.postMessage({
      command: 'record',
      buffer: [
        e.inputBuffer.getChannelData(0),
        e.inputBuffer.getChannelData(1)
      ]
    });
  }

  this.record = function(){
    recording = true;
  }

  this.stop = function(){
    recording = false;
  }

  this.clear = function(){
    worker.postMessage({ command: 'clear' });
  }

  this.getBuffer = function(cb) {
    currCallback = cb;
    worker.postMessage({ command: 'getBuffer' })
  }

  this.exportWAV = function(cb, type){
    currCallback = cb;
    type = 'audio/wav';
    if (!currCallback) throw new Error('Callback not set');
    worker.postMessage({
      command: 'exportWAV',
      type: type
    });
  }

  worker.onmessage = function(e){
    let blob = e.data;
    currCallback(blob);
  }

  source.connect(this.node);
  this.node.connect(this.context.destination);    //this should not be necessary
}

Recorder.prototype.forceDownload = function(blob, filename){
  let url = (window.URL || window.webkitURL).createObjectURL(blob);
  let link = window.document.createElement('a');
  link.href = url;
  link.download = filename || 'output.wav';
  let click = document.createEvent("Event");
  click.initEvent("click", true, true);
  link.dispatchEvent(click);
}

