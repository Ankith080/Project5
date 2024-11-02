/* eslint-disable no-unused-vars */
import React from 'react';
import {
  Button,
  Box,
  TextField,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography
} from '@mui/material';
import axios from 'axios';

class LoginRegister extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {
        first_name: '',
        last_name: '',
        location: '',
        description: '',
        occupation: '',
        login_name: '',
        password: '',
        password_repeat: '',
      },
      showLoginError: false,
      showRegistrationError: false,
      showRegistrationSuccess: false,
      openRegistration: false,
      showRequiredFieldsWarning: false,
    };

    this.handleLogin = this.handleLogin.bind(this);
    this.handleRegister = this.handleRegister.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleShowRegistration = this.handleShowRegistration.bind(this);
    this.handleCloseRegistration = this.handleCloseRegistration.bind(this);
  }

  handleShowRegistration = () => {
    this.setState({
      openRegistration: true,
      showRegistrationError: false,
      showRequiredFieldsWarning: false,
    });
  };

  handleCloseRegistration = () => {
    this.setState({
      openRegistration: false,
      showRegistrationSuccess: false,
      showRegistrationError: false,
      showRequiredFieldsWarning: false,
    });
  };

  handleLogin = () => {
    const currentState = JSON.stringify(this.state.user);
    axios.post(
      "/admin/login",
      currentState,
      {
        headers: {
          'Content-Type': 'application/json',
        }
      })
      .then((response) => {
        const user = response.data;
        this.setState({
          showLoginError: false,
          showRegistrationSuccess: false,
          showRegistrationError: false,
        });
        this.props.changeUser(user);
      })
      .catch(error => {
        this.setState({
          showLoginError: true,
          showRegistrationSuccess: false,
          showRegistrationError: false,
        });
        console.log(error);
      });
  };

  handleRegister = () => {
    // Validate matching passwords
    if (this.state.user.password !== this.state.user.password_repeat) {
      this.setState({
        showRegistrationError: true,
        showRequiredFieldsWarning: false,
      });
      // eslint-disable-next-line no-alert
      alert("Passwords don't match");
      return;
    }

    // Check for required fields
    const requiredFields = ['login_name', 'password', 'password_repeat', 'first_name', 'last_name'];
    if (requiredFields.some(field => !this.state.user[field])) {
      this.setState({
        showRequiredFieldsWarning: true,
        showRegistrationError: false,
      });
      return;
    }

    const currentState = JSON.stringify(this.state.user);
    axios.post(
      "/user/",
      currentState,
      {
        headers: {
          'Content-Type': 'application/json',
        }
      })
      .then((response) => {
        const user = response.data;
        this.setState({
          showRegistrationSuccess: true,
          showRegistrationError: false,
          showLoginError: false,
          openRegistration: false,
          showRequiredFieldsWarning: false,
        });
        this.props.changeUser(user);
      })
      .catch(error => {
        this.setState({
          showRegistrationError: true,
          showLoginError: false,
          showRegistrationSuccess: false,
          showRequiredFieldsWarning: false,
        });
        console.log(error);
      });
  };

  handleChange(event) {
    // eslint-disable-next-line no-return-assign
    this.setState((state) => state.user[event.target.id] = event.target.value);
  }

  render() {
    return this.state.user ? (
      <div>
        <Box component="form" autoComplete="off">
          {this.state.showLoginError && <Alert severity="error">Login Failed</Alert>}
          {this.state.showRegistrationError && <Alert severity="error">Please correct the registration details.</Alert>}
          {this.state.showRegistrationSuccess && <Alert severity="success">Registration Succeeded</Alert>}
          <div>
            <TextField id="login_name" label="Login Name" variant="outlined" fullWidth
              margin="normal" required={true} onChange={this.handleChange} />
          </div>
          <div>
            <TextField id="password" label="Password" variant="outlined" fullWidth
              margin="normal" type="password" required={true} onChange={this.handleChange} />
          </div>
          <Box mb={2}>
            <Button type="submit" variant="contained" onClick={this.handleLogin}>
              Login
            </Button>
          </Box>
        </Box>
        <Box>
          <Button variant="contained" onClick={this.handleShowRegistration}>
            Register
          </Button>
          <Dialog open={this.state.openRegistration} onClose={this.handleCloseRegistration}>
            <DialogTitle>User Registration</DialogTitle>
            <DialogContent>
              {this.state.showRequiredFieldsWarning && <Alert severity="warning">Please fill in all required fields.</Alert>}
              <Box>
                <TextField id="login_name" label="Login Name" variant="outlined" fullWidth
                  margin="normal" required={true} onChange={this.handleChange} />
                <TextField id="password" label="Password" variant="outlined" fullWidth
                  margin="normal" type="password" required={true} onChange={this.handleChange} />
                <TextField id="password_repeat" label="Repeat Password" variant="outlined" fullWidth
                  margin="normal" type="password" required={true} onChange={this.handleChange} />
                <TextField id="first_name" label="First Name" variant="outlined" fullWidth
                  margin="normal" autoComplete="off" required={true} onChange={this.handleChange} />
                <TextField id="last_name" label="Last Name" variant="outlined" fullWidth
                  margin="normal" required={true} onChange={this.handleChange} />
                <TextField id="location" label="Location" variant="outlined" fullWidth
                  margin="normal" onChange={this.handleChange} />
                <TextField id="description" label="Description" variant="outlined" multiline rows={4}
                  fullWidth margin="normal" onChange={this.handleChange} />
                <TextField id="occupation" label="Occupation" variant="outlined" fullWidth
                  margin="normal" onChange={this.handleChange} />
              </Box>
            </DialogContent>
            <DialogActions>
              <Button variant="contained" onClick={this.handleRegister}>
                Register Me
              </Button>
              <Button variant="outlined" onClick={this.handleCloseRegistration}>
                Close
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </div>
    ) : (
      <div />
    );
  }
}

export default LoginRegister;