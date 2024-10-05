import React from 'react';
import { Typography, Button } from '@mui/material'; // Import Button from Material-UI
import './userDetail.css';
import { Link } from "react-router-dom";
import { models } from '../../modelData/photoApp';

class UserDetail extends React.Component {
    constructor(props) {
        super(props);
    }

    handleViewPhotosClick = () => {
        // Implement navigation to the user's photos when the button is clicked
        const { history, match } = this.props;
        const userId = match.params.userId;
        history.push(`/photos/${userId}`);
    };

    render() {
        const user = models.userModel(this.props.match.params.userId);
        return (
            <>
                <Typography variant='h2'>User Details</Typography>
                <Typography variant='body1'>Name: {`${user.first_name} ${user.last_name}`}</Typography>
                <Typography variant='body1'>Location: {user.location}</Typography>
                <Typography variant='body1'>Description: {user.description}</Typography>
                <Typography variant='body1'>Occupation: {user.occupation}</Typography>
                <Button variant="contained" color="primary" onClick={this.handleViewPhotosClick}>
                    View Photos
                </Button>
            </>
        );
    }
}

export default UserDetail;
