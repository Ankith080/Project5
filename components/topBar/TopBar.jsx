import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';
import { withRouter, useLocation } from 'react-router-dom';
// import FetchModel from '../../lib/fetchModelData';
import axios from 'axios';

function TopBar() {
  const [version, setVersion] = useState('');
  const [name, setName] = useState({f: '', l:'',});

  const location = useLocation();

  const pathname = location.pathname;
  // Extracting the user name from the pathname (if applicable)
  const userId = pathname.includes('/users/')
	? pathname.split('/users/')[1]
	: null;
  const photo = pathname.includes('/photos/')
	? pathname.split('/photos/')[1]
	: null;

	
	useEffect(() => {
		axios
		.get('/test/info')
		.then((response) => {
			const versionNumber = response.data.version;
			setVersion(versionNumber);
		})
		.catch((error) => {
			console.error('Error fetching version number:', error);
		});
	}, []);
	
	useEffect(() => {
		
		if (userId || photo) {
			axios
			.get(`/user/${userId !== null ? userId : photo}`)
			.then((response) => {
				let n = {f: response.data.first_name, l: response.data.last_name};
				setName(n);
			})
		  .catch((error) => {
			console.error('Error fetching name:', error);
		  });
	}
  }, [location]);



	//console.log(props);
  return (
    <AppBar className='topbar-appBar' position='absolute'>
      <Toolbar style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant='h5' color='inherit'>
          Group2
        </Typography>
        <Typography variant='h5' color='inherit'>
          {userId
            ? `Details of ${name.f} ${name.l}`
            : photo
            ? `Photos of ${name.f} ${name.l}`
            : ''}
        </Typography>
        <Typography variant='body2' color='inherit'>
          Version: {version}
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default withRouter(TopBar);
