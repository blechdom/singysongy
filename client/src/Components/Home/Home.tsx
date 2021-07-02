import React from "react";
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';


import { Link } from "react-router-dom";
import './Home.css';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      maxWidth: 360,
      backgroundColor: theme.palette.background.paper,
    },
  }),
);

export default function Home() {

  const classes = useStyles();

  return (
    <div className="Home">
      <header className="Home-header">
        <h1>
          Singy Songy
        </h1>
        <List component="nav" className={classes.root} aria-label="contacts">
          <ListItem button component={Link} to="/videoChat">
            <ListItemText secondary="Join Video Chat Room" />
          </ListItem>
          <ListItem button component={Link} to="/playRoom">
            <ListItemText secondary="Join Play Room" />
          </ListItem>
          <ListItem button component={Link} to="/radioFeed">
            <ListItemText secondary="Radio Feed (coming soon)" />
          </ListItem>
        </List>
      </header>
    </div>
  );
}
