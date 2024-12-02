import React from 'react';

import { Button } from '@mui/material';
import axios from "../axios/axios";


export default function LogoutButton(props) {

	let logoutHandler = () => {
		axios.post("/admin/logout", {})
			.then(
				() => {
					props.SetUser({}, false);
				},
				(err) => {
					console.log(`Error ${err?.response?.status}: Must login`);
				}
			);
	};

	return (
		<Button
			type="submit"
			variant="contained"
			sx={{ mt: 3, mb: 2 }}
			onClick={logoutHandler}
		>
			Logout
		</Button>
	);
}