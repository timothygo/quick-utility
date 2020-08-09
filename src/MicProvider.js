import React, { createContext, useContext, useState, useCallback } from "react";
import { RecordRTCPromisesHandler, StereoAudioRecorder } from "recordrtc";
import hark from "hark";
import getUserMedia from "getusermedia";

const context = createContext(null);

const MicProvider = ({ children }) => {
  const [talking, setTalking] = useState(null);
  const [speech, setSpeech] = useState(null);

  const talk = useCallback(
    (onStream) => {
      if (talking) return;

      getUserMedia({ video: false, audio: true }, (err, stream) => {
        if (err) return;
        setSpeech(null);

        const harkOptions = { interval: 150 };
        const speechEvents = hark(stream, harkOptions);

        const recorderOptions = {
          type: "audio",
          mimeType: "audio/webm",
          sampleRate: 44100,
          desiredSampRate: 8000,
          recorderType: StereoAudioRecorder,
          numberOfAudioChannels: 1,
          disableLogs: true,
        };

        //returns a blob
        if (onStream) {
          recorderOptions["timeSlice"] = 500;
          recorderOptions["ondataavailable"] = onStream;
        }

        const recorder = new RecordRTCPromisesHandler(stream, recorderOptions);
        recorder.startRecording();

        // used for displaying animations
        speechEvents.on("volume_change", (volume) => {
          setTalking({ decibel: volume });
        });

        speechEvents.on("stopped_speaking", async () => {
          // stop recording
          await recorder.stopRecording();
          speechEvents.stop();

          setSpeech({
            type: (await recorder.getBlob().type) || "audio/wav",
            dataURL: await recorder.getDataURL(),
          });
          setTalking(null);
        });
      });
    },
    [talking]
  );

  const record = useCallback(() => {
    return talk(null);
  }, [talk]);

  const stream = useCallback(
    (onStream) => {
      return () => talk(onStream);
    },
    [talk]
  );

  return (
    <context.Provider value={{ record, stream, talking, speech }}>
      {children}
    </context.Provider>
  );
};

const useMic = () => {
  const value = useContext(context);
  return value;
};

export { useMic };
export default MicProvider;
