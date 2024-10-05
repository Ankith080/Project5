import React, { useState, useEffect } from 'react';
import {
    Divider,
    List,
    ListItem,
    ListItemText,
    Typography,
} from '@mui/material';
import { Link } from 'react-router-dom';
import FetchModel from '../../lib/fetchModelData';
import './userList.css';

/**
 * Define UserList, a React component of project #5
 */
function UserList() {
    const [userList, setUserList] = useState([]);

    useEffect(() => {
        // Fetch the user list from the server
        FetchModel('/user/list')
            .then((response) => {
                const users = response.data;
                setUserList(users);
            })
            .catch((error) => {
                console.error('Error fetching user list:', error);
            });
    }, []);

    return (
        <div>
            <Typography variant="h4">Users List</Typography>
            <List component="nav">
                {userList.map((user) => (
                    <React.Fragment key={user._id}>
                        <ListItem>
                            <Link to={{ pathname: `/users/${user._id}` }}>
                                <ListItemText primary={user.first_name} />
                            </Link>
                        </ListItem>
                        <Divider />
                    </React.Fragment>
                ))}
            </List>
            <Typography variant="body1">
                Click on the item to know the details of each user.
            </Typography>
        </div>
    );
}

export default UserList;
