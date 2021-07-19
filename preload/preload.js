const audioDevices = require("macos-audio-devices");
const { contextBridge } = require("electron");
contextBridge.exposeInMainWorld("requires", { audioDevices });

console.log("preload has been loaded");

const main = async () => {
  const inputDevices = await audioDevices.getInputDevices();
  const defaultInputDevice = await audioDevices.getDefaultInputDevice();

  const inputVolumes = await Promise.all(
    inputDevices.map((outputDevice) => {
      return audioDevices.getOutputDeviceVolume(outputDevice.id);
    })
  );

  console.log(inputDevices, defaultInputDevice);
  console.log(inputVolumes);

  const outputDevices = await audioDevices.getOutputDevices();
  const defaultOutputDevice = await audioDevices.getDefaultOutputDevice();

  const outputVolumes = await Promise.all(
    outputDevices.map((outputDevice) => {
      console.log(outputDevice.id);
      return audioDevices.getOutputDeviceVolume(outputDevice.id);
    })
  );

  console.log(outputDevices, defaultOutputDevice);
  console.log(outputVolumes);
};

// main();
