import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';
import { withRouter } from 'react-router-dom';
import FetchModel from '../../lib/fetchModelData';

function TopBar(props) {
    const [version, setVersion] = useState('');

    useEffect(() => {
        FetchModel('http://localhost:3000/test/info')
            .then((response) => {
                const versionNumber = response.data.load_date_time;
                setVersion(versionNumber);
            })
            .catch((error) => {
                console.error('Error fetching version number:', error);
            });
    }, []);

    const pathname = props.location.pathname;
    const userId = pathname.includes('/users/') ? pathname.split('/users/')[1] : null;
    const photo = pathname.includes('/photos/') ? pathname.split('/photos/')[1] : null;

    return (
        <>
            {/* AppBar with fixed positioning */}
            <AppBar className="topbar-appBar" position="fixed">
                <Toolbar style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="h5" color="inherit">
                        Bastions
                    </Typography>
                    <Typography variant="h5" color="inherit">
                        {userId
                            ? `Details of ${models.userModel(userId).first_name}`
                            : photo
                            ? `Photos of ${models.userModel(photo).first_name}`
                            : ''}
                    </Typography>
                    <Typography variant="body2" color="inherit">
                        Version: {version}
                    </Typography>
                </Toolbar>
            </AppBar>

            {/* Add margin to avoid content overlap */}
            <div className="main-content">
                {/* This is where the rest of your content goes */}
                {props.children}
            </div>
        </>
    );
}

export default withRouter(TopBar);
