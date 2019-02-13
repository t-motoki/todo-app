import React, { Component, Fragment } from 'react';
import axios from 'axios';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Fab from '@material-ui/core/Fab';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import MenuIcon from '@material-ui/icons/Menu';
import AddIcon from '@material-ui/icons/Add';
import SearchIcon from '@material-ui/icons/Search';
import MoreIcon from '@material-ui/icons/MoreVert';

const styles = theme => ({
  text: {
    paddingTop: theme.spacing.unit * 2,
    paddingLeft: theme.spacing.unit * 2,
    paddingRight: theme.spacing.unit * 2,
  },
  paper: {
    paddingBottom: 50,
  },
  list: {
    marginBottom: theme.spacing.unit * 2,
  },
  subHeader: {
    backgroundColor: theme.palette.background.paper,
  },
  appBar: {
    top: 'auto',
    bottom: 0,
  },
  toolbar: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  fabButton: {
    position: 'absolute',
    zIndex: 1,
    top: -30,
    left: 0,
    right: 0,
    margin: '0 auto',
  },
});

class Todo extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data:[
       {
        done: false,
        subject: '',
        detail: ''
       }
      ]
    };
    this.bottomAppBar.propTypes = {
      classes: PropTypes.object.isRequired,
    };
    this.fetchItems = this.fetchItems.bind(this);
    this.bottomAppBar = this.bottomAppBar.bind(this);

  }

  fetchItems() {
    axios.get('/todo')
      .then( (response) => {
        if("result" in response.data){
          if(!response.data.result){
            this.setState({
              data:response.data.data
            });
          }
        }
      })
      .catch( (error) => {
        console.log(error);
      });
  }
  componentWillMount() {
    this.fetchItems();
    setInterval(this.fetchItems, 1000);
  }

  bottomAppBar(props) {
    const { classes } = props;
    return (
      <React.Fragment>
        <CssBaseline />
        <Paper square className={classes.paper}>
          <Typography className={classes.text} variant="h5" gutterBottom>
            Todo List demo
          </Typography>
          <List className={classes.list}>
            {this.state.data.map(({ subject, detail, done },id) => (
              <Fragment key={id}>
                <ListItem button>
                  <ListItemText done={done} primary={subject} secondary={detail} />
                </ListItem>
              </Fragment>
            ))}
          </List>
        </Paper>
        <AppBar position="fixed" color="primary" className={classes.appBar}>
          <Toolbar className={classes.toolbar}>
            <IconButton color="inherit" aria-label="Open drawer">
              <MenuIcon />
            </IconButton>
            <Fab color="secondary" aria-label="Add" className={classes.fabButton}>
              <AddIcon />
            </Fab>
            <div>
              <IconButton color="inherit">
                <SearchIcon />
              </IconButton>
              <IconButton color="inherit">
                <MoreIcon />
              </IconButton>
            </div>
          </Toolbar>
        </AppBar>
      </React.Fragment>
    );
  }
  render() {
    const TODOLIST = withStyles(styles)(this.bottomAppBar);
    return (
      <TODOLIST />
    );
  }
}


export default Todo;
