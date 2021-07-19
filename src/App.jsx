import React from "react";
import ReactDOM from "react-dom";
import Grid from "@material-ui/core/Grid";
import Slider from "@material-ui/core/Slider";
import VolumeDown from "@material-ui/icons/VolumeDown";
import VolumeUp from "@material-ui/icons/VolumeUp";
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
import TextField from "@material-ui/core/TextField";

export function VolumeControll({ label = "ラベル", value, setValue }) {
  // const [value, setValue] = React.useState(30);
  const handleChange = (_, newValue) => setValue(newValue);
  const volumeUp = () =>
    setValue((value) => (value + 10 > 100 ? 100 : value + 10));
  const volumeDown = () =>
    setValue((value) => (value - 10 < 0 ? 0 : value - 10));

  return (
    <>
      <Typography id="continuous-slider" gutterBottom>
        {label}
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={2}>
          <TextField
            id="standard-basic"
            value={value}
            fullWidth
            onChange={(e) => setValue(e.target.value - 0)}
            type="number"
            InputLabelProps={{
              shrink: true,
            }}
            label="Standard"
          />
        </Grid>
        <Grid item>
          <Tooltip title="音量を下げる" aria-label="volume-down">
            <VolumeDown onClick={volumeDown} />
          </Tooltip>
        </Grid>
        <Grid item xs>
          <Slider
            value={value}
            onChange={handleChange}
            aria-labelledby="continuous-slider"
          />
        </Grid>
        <Grid item>
          <Tooltip title="音量を上げる" aria-label="volume-up">
            <VolumeUp onClick={volumeUp} />
          </Tooltip>
        </Grid>
      </Grid>
    </>
  );
}

const { setOutputDeviceVolume } = window.requires.audioDevices;
export function Test() {
  const [inputDevices, setInputDevices] = React.useState([]);
  const [outputDevices, setOutputDevices] = React.useState([]);

  const getDevices = () => {
    window.requires.audioDevices
      .getInputDevices()
      .then((d) => setInputDevices(d));

    window.requires.audioDevices
      .getOutputDevices()
      .then((devices) =>
        Promise.all(
          devices.map((device) => {
            return window.requires.audioDevices
              .getOutputDeviceVolume(device.id)
              .then((volume) => ({
                ...device,
                volume: ~~(Number.parseFloat(volume) * 100),
              }));
          })
        )
      )
      .then((d) => setOutputDevices(d));
  };

  React.useEffect(() => {
    getDevices();
    const interval = setInterval(getDevices, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {outputDevices.map((outputDevice, index) => {
        return (
          <>
            <VolumeControll
              label={outputDevice.name}
              value={outputDevice.volume}
              setValue={(v) => {
                setOutputDevices(
                  outputDevices.map((outputDevice, i) => {
                    if (i !== index) return outputDevice;
                    setOutputDeviceVolume(outputDevice.id, v / 100.0);
                    return { ...outputDevice, volume: v };
                  })
                );
              }}
            />
          </>
        );
      })}
    </>
  );
}

const App = () => {
  return <Test />;
};
ReactDOM.render(<App />, document.getElementById("app"));
