import React, { useState } from 'react';

import { Typography, TextField, Box, Button, Grid, Alert } from '@mui/material';

import './loginRegister.css';
import axios from "../axios/axios";


function LoginModal(props) {
  let [invalidLogin, setInvalidLogin] = useState(false);

  const LoginRequest = (event) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    const plain = Object.fromEntries(data.entries());

    axios.post('/admin/login', plain).then(
      (res) => {
        // console.log(res.data);
        props.SetUser(res.data, true);
        debugger
      },
      (err) => {
        console.log(err?.response?.status);
        setInvalidLogin(true);
      }
    );
  };

  return (
    <>
      {invalidLogin ? (
        <Alert severity='error'>
          Incorrect Login Name or Password. Try again.
        </Alert>
      ) : (
        ''
      )}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box component='form' onSubmit={LoginRequest}>
          <Typography component='h1' variant='h5'>
            Sign In
          </Typography>

          <TextField
            margin='normal'
            required
            autoFocus
            fullWidth
            label='Login Name'
            name='login_name'
            id='login_name'
          />

          <TextField
            margin='normal'
            required
            fullWidth
            label='Password'
            name='password'
            type='password'
            id='password'
          />
          <Button
            type='submit'
            fullWidth
            variant='contained'
            sx={{ mt: 3, mb: 2 }}
          >
            Login
          </Button>
          <Grid container>
            <Grid item>
              <Button
                onClick={props.SwitchModes}
                variant='contained'
                color='grey'
              >
                {"Don't have an account? Sign Up"}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
}

function RegisterModal(props) {
  let [, setInvalidRegister] = useState(false);

  const RegistrationRequest = (event) => {
    event.preventDefault();
    // TODO: Add registration functionality
    const data = new FormData(event.currentTarget);
    const plain = Object.fromEntries(data.entries());

    axios.post('/user', plain).then(
      (res) => {
        // console.log(res.data);
        props.SetUser(res.data, true);
      },
      (err) => {
        console.log(err?.response?.status);
        setInvalidRegister(true);
      }
    );
  };

  return (
    <Box
      my={4}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box component='form' onSubmit={RegistrationRequest}>
        <Typography component='h1' variant='h5'>
          Register
        </Typography>

        <TextField
          margin='normal'
          required
          autoFocus
          fullWidth
          label='Login Name'
          name='login_name'
          id='login_name'
        />

        <TextField
          margin='normal'
          required
          fullWidth
          label='Password'
          name='password'
          id='password'
          type='password'
        />

        <TextField
          margin='normal'
          required
          fullWidth
          label='Verify Password'
          name='password2'
          id='password2'
          type='password'
        />
        <TextField
          margin='normal'
          required
          label='First Name'
          name='first_name'
          id='first_name'
          sx={{ width: '50%' }}
        />
        <TextField
          margin='normal'
          required
          label='Last Name'
          name='last_name'
          id='last_name'
          sx={{ width: '50%' }}
        />

        <TextField
          margin='normal'
          required
          label='Occupation'
          name='occupation'
          id='occupation'
          sx={{ width: '50%' }}
        />

        <TextField
          margin='normal'
          required
          label='Location'
          name='location'
          id='location'
          sx={{ width: '50%' }}
        />

        <TextField
          margin='normal'
          required
          fullWidth
          multiline
          label='Description'
          name='description'
          id='description'
        />

        <Button
          type='submit'
          fullWidth
          variant='contained'
          sx={{ mt: 3, mb: 2 }}
        >
          Login
        </Button>
        <Grid container>
          <Grid item>
            <Button
              onClick={props.SwitchModes}
              variant='contained'
              color='grey'
            >
              {'Return to Login'}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

class LoginRegister extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isRegistering: false,
    };

    this.UpdateRegistering = () => this.setState({ isRegistering: !this.state.isRegistering });

    axios.post('/admin/session/resume', {}).then(
      (res) => {
        this.props.SetUser(res.data, true);
      },
      () => {
        console.log('New Session. User Must Login');
      }
    );
  }

  render() {
    return (
      <div>
        {!this.state.isRegistering ? (
          <LoginModal
            SetUser={this.props.SetUser}
            SwitchModes={this.UpdateRegistering}
          />
        ) : (
          <RegisterModal
            SetUser={this.props.SetUser}
            SwitchModes={this.UpdateRegistering}
          />
        )}
      </div>
    );
  }
}

export default LoginRegister;
