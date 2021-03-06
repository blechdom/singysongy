import React, { useState } from 'react';
import clsx from 'clsx';
import { Router, Route, Link } from "react-router-dom";
import { createBrowserHistory } from "history";
import { withStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

import Home from "../Home/Home";
import VideoChat from "../VideoChat/VideoChat";
import PlayRoom from "../PlayRoom/PlayRoom";
import MusicRoom from "../PlayRoom/MusicRoom";

import RadioFeed from "../RadioFeed/RadioFeed";
import '../App/App.css';

const drawerWidth = 240;
const history = createBrowserHistory();

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: '#fff'
  },
  flex: {
    flex: 1
  },
  drawerPaper: {
    position: "relative",
    width: drawerWidth
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  },
  toolbarMargin: theme.mixins.toolbar,
  aboveDrawer: {
    zIndex: theme.zIndex.drawer + 1
  }
});

function ToolBarInteraction({ classes, variant }) {
  const [drawer, setDrawer] = useState(false);

  const toggleDrawer = () => {
    setDrawer(!drawer);
  };

  const onItemClick = title => () => {
    console.log('title', title);
    setDrawer(variant === 'temporary' ? false : drawer);
    setDrawer(!drawer);
  };

  return (
    <div className={classes.root}>
      <Toolbar>
        <IconButton
          className={classes.menuButton}
          color="secondary"
          aria-label="Menu"
          onClick={toggleDrawer}
        >
          <MenuIcon />
        </IconButton>
        <Typography
          variant="h6"
          color="secondary"
          className={classes.flex}
        >
          Singy Songy
        </Typography>
      </Toolbar>
      <Router history={history}>
        <Drawer variant={variant} open={drawer} onClose={toggleDrawer}
          classes={{
            paper: classes.drawerPaper
          }}
        >
          <div
            className={clsx({
              [classes.toolbarMargin]: variant === 'persistent'
            })}
          />
          <List>
            <ListItem button component={Link} to="/" onClick={onItemClick('Home')}>
              <ListItemText>Home</ListItemText>
            </ListItem>
            <ListItem button component={Link} to="/videoChat" onClick={onItemClick('Video Chat')}>
              <ListItemText>Video Chat</ListItemText>
            </ListItem>
            <ListItem button component={Link} to="/playRoom" onClick={onItemClick('Play Room')}>
              <ListItemText>Play Room</ListItemText>
            </ListItem>
            <ListItem button component={Link} to="/musicRoom" onClick={onItemClick('Music Room')}>
              <ListItemText>Music Room</ListItemText>
            </ListItem>
            <ListItem button component={Link} to="/radioFeed" onClick={onItemClick('Radio Feed')}>
              <ListItemText>Radio Feed</ListItemText>
            </ListItem>
          </List>
        </Drawer>
        <main className={classes.content}>
            <Route exact path="/" component={Home} />
            <Route path="/videoChat" component={VideoChat} />
            <Route path="/playRoom" component={PlayRoom} />
            <Route path="/musicRoom" component={MusicRoom} />
            <Route path="/radioFeed" component={RadioFeed} />
        </main>
      </Router>
    </div>
  );
}

export default withStyles(styles)(ToolBarInteraction);
