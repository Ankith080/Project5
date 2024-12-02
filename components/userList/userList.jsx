import React from 'react';
import {
  ListItemAvatar,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography,
  // Typography,
} from '@mui/material';
import { Link } from 'react-router-dom';
import './userList.css';
import axios from "../axios/axios";


/**
 * Define UserList, a React component of project #5
 */
class UserList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      users: [],
      mustLogin: false,
    };

    this.getUsers();
  }

  getUsers() {
    axios.get(`/user/list`).then(
      (data) => {
        this.setState({ users: data.data });
      },
      (err) => {
        console.log(`Status Code UL: ${err?.response?.status}`);
        this.setState({ mustLogin: true });
      }
    );
  }

  render() {
    return this.state.mustLogin ? (
      <Typography variant='h5'>Please Login to View Users</Typography>
    ) : this.state.users.length === 0 ? (
      <p>Loading Users</p>
    ) : (
      <div>
        <List component='nav'>
          {this.state.users.map((user) => (
            <div key={user._id}>
              <ListItem>
                <ListItemAvatar>
                  <Avatar alt={`${user.first_name}`} src='#' />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    (
                      <Link to={`/users/${user._id}`}>
                        {user.first_name} {user.last_name}
                      </Link>
                    )
                  }
                  key={user._id}
                  className='listItemText'
                />
              </ListItem>
              <Divider />
            </div>
          ))}
        </List>
      </div>
    );
  }
}

export default UserList;
