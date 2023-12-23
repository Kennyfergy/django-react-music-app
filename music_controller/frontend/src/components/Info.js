import React, { useState } from "react";
import { Grid, Button, Typography, IconButton } from "@material-ui/core";
import NavigateBeforeIcon from "@material-ui/icons/NavigateBefore";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import { Link } from "react-router-dom";

const pages = {
  JOIN: "pages.join",
  CREATE: "pages.create",
};

export default function Info(props) {
  const [page, setPage] = useState(pages.JOIN);

  function joinInfo() {
    return (
      <>
        <h4>Join Page</h4>
        <Typography paragraph>
          Join the party and be part of the music experience! On the Join page, you can enter a unique party
          code to join an existing Spotify Party. Once you're in, you'll see the current song being played and
          have the ability to vote to skip songs. If enough votes are gathered, the song will skip to the next
          one, so you have a say in what's playing!
        </Typography>
      </>
    );
  }

  function createInfo() {
    return (
      <>
        <h4>Create Page</h4>
        <Typography paragraph>
          Ready to start your own Spotify Party? On the Create page, you set up a new party. You can customize
          settings like the number of votes required to skip a song. Once your party is created, share the
          party code with your friends so they can join in. As the party host, you'll control the playlist and
          see real-time updates of what your guests are enjoying!
        </Typography>
      </>
    );
  }

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} align="center">
        <Typography component="h4" variant="h4">
          What is Spotify Party?
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
        <Typography variant="body1">{page === pages.JOIN ? joinInfo() : createInfo()}</Typography>
      </Grid>
      <Grid item xs={12} align="center">
        <IconButton
          onClick={() => {
            page === pages.CREATE ? setPage(pages.JOIN) : setPage(pages.CREATE);
          }}
        >
          {page === pages.CREATE ? <NavigateBeforeIcon /> : <NavigateNextIcon />}
        </IconButton>
      </Grid>
      <Grid item xs={12} align="center">
        <Button color="secondary" variant="contained" to="/" component={Link}>
          Back
        </Button>
      </Grid>
    </Grid>
  );
}
