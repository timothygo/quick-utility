import React, { createContext, useContext, useCallback } from "react";
import {
  invokeSaveAsDialog,
  RecordRTCPromisesHandler,
  StereoAudioRecorder,
} from "recordrtc";

const context = createContext(null);

const MicProvider = ({ children }) => {
  const speak = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new RecordRTCPromisesHandler(stream, {
      type: "audio",
      mimeType: "audio/webm",
      sampleRate: 44100,
      desiredSampRate: 8000,
      recorderType: StereoAudioRecorder,
      numberOfAudioChannels: 1,
    });
    recorder.startRecording();

    //save
    setTimeout(async () => {
      await recorder.stopRecording();
      invokeSaveAsDialog(await recorder.getBlob());
    }, 3000);
  });
  return <context.Provider value={{ speak }}>{children}</context.Provider>;
};

const useMic = () => {
  const value = useContext(context);
  return value;
};

export { useMic };
export default MicProvider;
