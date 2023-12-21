import React, { useState, useEffect } from "react";
import { Grid, Button, Typography } from "@material-ui/core";
import { useHistory, useParams } from "react-router-dom";
import CreateRoomPage from "./CreateRoomPage";

const Room = (props) => {
  const [roomDetails, setRoomDetails] = useState({
    votesToSkip: 2,
    guestCanPause: false,
    isHost: false,
    showSettings: false,
    spotifyAuthenticated: false,
  });
  const history = useHistory();
  const { roomCode } = useParams();

  useEffect(() => {
    getRoomDetails();
    if (roomDetails.isHost) {
      authenticateSpotify();
    }
  }, [roomCode, roomDetails.isHost]);

  const getRoomDetails = () => {
    fetch(`/api/get-room?code=${roomCode}`)
      .then((response) => {
        if (!response.ok) {
          props.leaveRoomCallback();
          history.push("/");
        }
        return response.json();
      })
      .then((data) => {
        setRoomDetails({
          ...roomDetails,
          votesToSkip: data.votes_to_skip,
          guestCanPause: data.guest_can_pause,
          isHost: data.is_host,
        });
      });
  };

  const authenticateSpotify = () => {
    fetch("/spotify/is-authenticated")
      .then((response) => response.json())
      .then((data) => {
        setRoomDetails({ ...roomDetails, spotifyAuthenticated: data.status });
        if (!data.status) {
          fetch("/spotify/get-auth-url")
            .then((response) => response.json())
            .then((data) => {
              window.location.replace(data.url);
            });
        }
      });
  };

  const leaveButtonPressed = () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    };
    fetch("/api/leave-room", requestOptions).then((_response) => {
      props.leaveRoomCallback();
      history.push("/");
    });
  };

  const updateShowSettings = (value) => {
    setRoomDetails({ ...roomDetails, showSettings: value });
  };

  const renderSettings = () => (
    <Grid container spacing={1}>
      <Grid item xs={12} align="center">
        <CreateRoomPage
          update={true}
          votesToSkip={roomDetails.votesToSkip}
          guestCanPause={roomDetails.guestCanPause}
          roomCode={roomCode}
          updateCallback={getRoomDetails}
        />
      </Grid>
      <Grid item xs={12} align="center">
        <Button variant="contained" color="secondary" onClick={() => updateShowSettings(false)}>
          Close
        </Button>
      </Grid>
    </Grid>
  );

  const renderSettingsButton = () => (
    <Grid item xs={12} align="center">
      <Button variant="contained" color="primary" onClick={() => updateShowSettings(true)}>
        Settings
      </Button>
    </Grid>
  );

  return roomDetails.showSettings ? (
    renderSettings()
  ) : (
    <Grid container spacing={1}>
      <Grid item xs={12} align="center">
        <Typography variant="h4" component="h4">
          Code: {roomCode}
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
        <Typography variant="h6" component="h6">
          Votes: {roomDetails.votesToSkip}
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
        <Typography variant="h6" component="h6">
          Guest Can Pause: {roomDetails.guestCanPause.toString()}
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
        <Typography variant="h6" component="h6">
          Host: {roomDetails.isHost.toString()}
        </Typography>
      </Grid>
      {roomDetails.isHost && renderSettingsButton()}
      <Grid item xs={12} align="center">
        <Button variant="contained" color="secondary" onClick={leaveButtonPressed}>
          Leave Room
        </Button>
      </Grid>
    </Grid>
  );
};

export default Room;
