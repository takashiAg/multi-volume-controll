const audioDevices = require("macos-audio-devices");

const main = async () => {
  const inputDevices = await audioDevices.getInputDevices();
  const outputDevices = await audioDevices.getOutputDevices();
  console.log(inputDevices);
  console.log(outputDevices);
};

main();
