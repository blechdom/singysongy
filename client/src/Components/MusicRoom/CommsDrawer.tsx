import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import Divider from '@material-ui/core/Divider';
import FormGroup from '@material-ui/core/FormGroup';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Typography from '@material-ui/core/Typography';
import Drawer from '@material-ui/core/Drawer';
import ChevronRight from '@material-ui/icons/ChevronRight';
import IconButton from '@material-ui/core/IconButton';
import {sendMessage} from './SocketsAndPeers';

const drawerWidth = 350;

const useStyles = makeStyles((theme) => ({
  switch: {
    align: 'center',
    left: '40px'
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
  },
  drawerBody: {
    padding: theme.spacing(1),
    margin: theme.spacing(1),
  },
  select: {
    minWidth: 240,
    paddingLeft: theme.spacing(4)
  },
}));

export default function CommsDrawer({ commsOpen, handleCommsDrawerClose, chatMessage }) {
  const classes = useStyles();

  useEffect(() => {
    if(chatMessage){
      console.log('in comms drawer receiving chat ', chatMessage);
    }
  }, [chatMessage]);

  function sendChatMessage() {
    sendMessage({ msg:'hi this is a test', isLocal: true});
  }

  return(
    <div > 
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="right"
        open={commsOpen}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={handleCommsDrawerClose}>
            <ChevronRight />
          </IconButton>
          <h1>COMMS</h1>
        </div>
        <Divider />
        <div className={classes.drawerBody}>
        more to come <br/><br/>(chat and foldover audio using sockets)<br/><br/>
        <Button onClick={sendChatMessage}>
          Send Test Message
        </Button>
        </div>
      </Drawer>
    </div>
  );
}