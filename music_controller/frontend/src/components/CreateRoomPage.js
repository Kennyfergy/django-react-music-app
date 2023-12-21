import React, { useState } from "react";
import {
  Button,
  Grid,
  Typography,
  TextField,
  FormHelperText,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Collapse,
} from "@material-ui/core";
import { Link, useHistory } from "react-router-dom";
import Alert from "@material-ui/lab/Alert";

const CreateRoomPage = ({
  votesToSkip = 2,
  guestCanPause = true,
  update = false,
  roomCode = null,
  updateCallback = () => {},
}) => {
  const [state, setState] = useState({
    guestCanPause,
    votesToSkip,
    errorMsg: "",
    successMsg: "",
  });
  const history = useHistory();

  const handleVotesChange = (e) => {
    setState({ ...state, votesToSkip: e.target.value });
  };

  const handleGuestCanPauseChange = (e) => {
    setState({ ...state, guestCanPause: e.target.value === "true" });
  };

  const handleRoomButtonPressed = () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        votes_to_skip: state.votesToSkip,
        guest_can_pause: state.guestCanPause,
      }),
    };
    fetch("/api/create-room", requestOptions)
      .then((response) => response.json())
      .then((data) => history.push("/room/" + data.code));
  };

  const handleUpdateButtonPressed = () => {
    const requestOptions = {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        votes_to_skip: state.votesToSkip,
        guest_can_pause: state.guestCanPause,
        code: roomCode,
      }),
    };
    fetch("/api/update-room", requestOptions).then((response) => {
      if (response.ok) {
        setState({ ...state, successMsg: "Room updated successfully!" });
      } else {
        setState({ ...state, errorMsg: "Error updating room..." });
      }
      updateCallback();
    });
  };

  const renderCreateButtons = () => (
    <Grid container spacing={1}>
      <Grid item xs={12} align="center">
        <Button color="primary" variant="contained" onClick={handleRoomButtonPressed}>
          Create A Room
        </Button>
      </Grid>
      <Grid item xs={12} align="center">
        <Button color="secondary" variant="contained" to="/" component={Link}>
          Back
        </Button>
      </Grid>
    </Grid>
  );

  const renderUpdateButtons = () => (
    <Grid item xs={12} align="center">
      <Button color="primary" variant="contained" onClick={handleUpdateButtonPressed}>
        Update Room
      </Button>
    </Grid>
  );

  const title = update ? "Update Room" : "Create a Room";

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} align="center">
        <Collapse in={state.errorMsg !== "" || state.successMsg !== ""}>
          {state.successMsg !== "" ? (
            <Alert severity="success" onClose={() => setState({ ...state, successMsg: "" })}>
              {state.successMsg}
            </Alert>
          ) : (
            <Alert severity="error" onClose={() => setState({ ...state, errorMsg: "" })}>
              {state.errorMsg}
            </Alert>
          )}
        </Collapse>
      </Grid>
      <Grid item xs={12} align="center">
        <Typography component="h4" variant="h4">
          {title}
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
        <FormControl component="fieldset">
          <FormHelperText>
            <div align="center">Guest Control of Playback State</div>
          </FormHelperText>
          <RadioGroup row defaultValue={guestCanPause.toString()} onChange={handleGuestCanPauseChange}>
            <FormControlLabel
              value="true"
              control={<Radio color="primary" />}
              label="Play/Pause"
              labelPlacement="bottom"
            />
            <FormControlLabel
              value="false"
              control={<Radio color="secondary" />}
              label="No Control"
              labelPlacement="bottom"
            />
          </RadioGroup>
        </FormControl>
      </Grid>
      <Grid item xs={12} align="center">
        <FormControl>
          <TextField
            required
            type="number"
            onChange={handleVotesChange}
            defaultValue={votesToSkip}
            inputProps={{
              min: 1,
              style: { textAlign: "center" },
            }}
          />
          <FormHelperText>
            <div align="center">Votes Required To Skip Song</div>
          </FormHelperText>
        </FormControl>
      </Grid>
      {update ? renderUpdateButtons() : renderCreateButtons()}
    </Grid>
  );
};

export default CreateRoomPage;
