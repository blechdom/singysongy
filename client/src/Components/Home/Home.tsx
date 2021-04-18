import React from "react";
import PropTypes from "prop-types";
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import AddIcon from "@material-ui/icons/Add";
import Icon from "@material-ui/core/Icon";
import DeleteIcon from "@material-ui/icons/Delete";
import Button from "@material-ui/core/Button";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
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
          SingySongy
        </h1>
        <List component="nav" className={classes.root} aria-label="contacts">
          <ListItem button component={Link} to="/videoChatEffects">
            <ListItemText secondary="Default Singy Songy Room - USE HEADPHONES!" />
          </ListItem>
        </List>
      </header>
    </div>
  );
}
