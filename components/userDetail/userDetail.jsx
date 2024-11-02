
import React from 'react';
import { Box,Paper,Typography, Button, Grid } from '@mui/material';
import { Link } from 'react-router-dom';
import './userDetail.css';
import axios from 'axios'; // Import Axios


class UserDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
    };
  }

  componentDidMount() {
    this.fetchUserDetails();
  }

  componentDidUpdate(prevProps) {
    const { match } = this.props;
    const { userId } = match.params;

    if (prevProps.match.params.userId !== userId || !this.state.user) {
      this.fetchUserDetails();
    }
  }

  fetchUserDetails() {
    const { match } = this.props;
    const { userId } = match.params;

    // Use Axios to fetch user details from the server
    axios.get(`/user/${userId}`)
      .then((response) => {
        this.setState({ user: response.data });
      })
      .catch((error) => {
        console.error('Error fetching user details:', error);
      });
  }

  render() {
    const { user } = this.state;
    return (
      <div>
        {user ? (
          <div>
            <Grid container justifyContent="center">
              <Grid item>
                <Button
                  component={Link}
                  to={`/photos/${user._id}`}
                  variant="contained"
                  color="primary"
                >
                  User Photos
                </Button>
              </Grid>
            </Grid>

            <Box display="flex" justifyContent="center" m={2}>
              <Paper elevation={3} sx={{ padding: 4, maxWidth: 600, width: '100%' }}>
                <Typography variant="h3" gutterBottom>User Profile</Typography>
                <Typography variant="body1"><strong>First Name:</strong> {user.first_name}</Typography>
                <Typography variant="body1"><strong>Last Name:</strong> {user.last_name}</Typography>
                <Typography variant="body1"><strong>Location:</strong> {user.location}</Typography>
                <Typography variant="body1"><strong>Description:</strong> {user.description}</Typography>
                <Typography variant="body1"><strong>Occupation:</strong> {user.occupation}</Typography>
              </Paper>
            </Box>
          </div>
        ) : (
          <Typography variant="body1" className="user-detail-box loading-text">
            Loading user details...
          </Typography>
        )}
      </div>
    );
  }
}

export default UserDetail;
