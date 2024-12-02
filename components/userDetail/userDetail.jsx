import React from 'react';
import { Typography, Button } from '@mui/material'; // Import Button from Material-UI
import './userDetail.css'; // Change this if you create a specific CSS for user details
// import fetchModel from '../../lib/fetchModelData';
import axios from "../axios/axios";


class UserDetail extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {},
    };

    this.getUserDetails();
  }

  handleViewPhotosClick = () => {
    // Implement navigation to the user's photos when the button is clicked
    const { history, match } = this.props;
    const userId = match.params.userId;
    history.push(`/photos/${userId}`);
  };

  getUserDetails() {
    axios.get(`/user/${this.props.match.params.userId}`).then(
      (data) => {
        this.setState({ user: data.data });
      },
      (err) => {
        console.log(err);
      }
    );
  }

  render() {
    return this.state.user.length === 0 ? (
      <p>Loading user details</p>
    ) : (
      <div className='user-details-container'>
        <Typography
          className='user-details-header'
          variant='h2'
          sx={{ fontSize: '40px' }}
        >
          User Details
        </Typography>
        <div className='user-details-main'>
          <Typography variant='body1'>
            <strong>Name: </strong>
            {`${this.state.user.first_name} ${this.state.user.last_name}`}
          </Typography>
          <Typography variant='body1'>
            <strong>Location: </strong>
            {this.state.user.location}
          </Typography>
          <Typography variant='body1'>
            <strong>Description: </strong>
            {this.state.user.description}
          </Typography>
          <Typography variant='body1'>
            <strong>Occupation: </strong>
            {this.state.user.occupation}
          </Typography>
        </div>
        <Button
          variant='contained'
          color='primary'
          onClick={this.handleViewPhotosClick}
        >
          View Photos
        </Button>
      </div>
    );
  }
}

export default UserDetail;
