import React from 'react';
import {
  ListItemAvatar,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemText,
  // Typography,
} from '@mui/material';
import { Link } from 'react-router-dom';
import './userList.css';
import axios from 'axios';
// import ImageIcon from '@mui/icons-material/Image';
// import fetchModel from '../../lib/fetchModelData';

//const users = window.models.userListModel();

/**
 * Define UserList, a React component of project #5
 */
class UserList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      users: [],
    };

    this.getUsers();
  }

  //   getUsers() {
  //     fetchModel(`/user/list`).then(
  //       (data) => {
  //         this.setState({ users: data.data });
  //       },
  //       (err) => {
  //         console.log(err);
  //       }
  //     );
  //   }

  getUsers() {
    axios.get(`/user/list`).then(
      (data) => {
        this.setState({ users: data.data });
      },
      (err) => {
        console.log(err);
      }
    );
  }

  render() {
    return (
	(this.state.users.length === 0) ?
	<p>Loading Users</p>
	:
	(
	<div>
		<List component='nav'>
			{this.state.users.map((user) => (
			<div key={user._id}>
				<ListItem>
					<ListItemAvatar>
					<Avatar
						alt={`${user.first_name}`}
						src='#'
					/>
					</ListItemAvatar>
					<ListItemText
						primary={(
							<Link to={`/users/${user._id}`}>
								{user.first_name} {user.last_name}
							</Link>
						)}
						key={user._id} 
					/>
				</ListItem>
				<Divider />
			</div>
			))}
		</List>
	</div>
	));
  }
}

export default UserList;
