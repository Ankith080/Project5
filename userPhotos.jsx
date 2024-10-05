import React, { useState, useEffect } from 'react';
import { Typography, Button, Checkbox } from '@mui/material';
import { Link, useParams, useHistory } from 'react-router-dom';
import FetchModel from '../../lib/fetchModelData';
import './userPhotos.css';

function UserPhotos() {
    const { userId, photoIndex } = useParams();
    const [photos, setPhotos] = useState([]);
    const [advancedFeaturesEnabled, setAdvancedFeaturesEnabled] = useState(false);
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
    const [showAdvancedFeatures, setShowAdvancedFeatures] = useState(false);
    const history = useHistory();

    useEffect(() => {
        FetchModel(`/photosOfUser/${userId}`)
            .then((response) => {
                const userPhotos = response.data;
                setPhotos(userPhotos);

                if (photoIndex) {
                    setAdvancedFeaturesEnabled(true);
                    setCurrentPhotoIndex(parseInt(photoIndex));
                }
            })
            .catch((error) => {
                console.error('Error fetching user photos:', error);
            });
    }, [userId, photoIndex]);

    const navigateToPhoto = (index) => {
        if (index >= 0 && index < photos.length) {
            setCurrentPhotoIndex(index);
        }
    };

    const handleCheckboxChange = () => {
        setShowAdvancedFeatures(!showAdvancedFeatures);
    };

    const handleGoBack = () => {
        history.push(`/users/${userId}`);
    };

    const handleNextPhoto = () => {
        if (currentPhotoIndex < photos.length - 1) {
            setCurrentPhotoIndex(currentPhotoIndex + 1);
        }
    };

    const handlePreviousPhoto = () => {
        if (currentPhotoIndex > 0) {
            setCurrentPhotoIndex(currentPhotoIndex - 1);
        }
    };

    return (
        <div className="user-photos-container">
            <Button variant="contained" color="primary" onClick={handleGoBack}>
                Go back to user details
            </Button>
            <Typography variant="h2">Photos</Typography>
            <Checkbox
                checked={showAdvancedFeatures}
                onChange={handleCheckboxChange}
                inputProps={{ 'aria-label': 'Show advanced features' }}
            />
            Show Advanced Features

            {showAdvancedFeatures && (
                <div className="photo-navigation">
                    <Button variant="outlined" color="primary" onClick={handlePreviousPhoto}>
                        Previous
                    </Button>
                    <Button variant="outlined" color="primary" onClick={handleNextPhoto}>
                        Next
                    </Button>
                </div>
            )}

            {showAdvancedFeatures ? (
                <div className="photo">
                    <img src={`/images/${photos[currentPhotoIndex].file_name}`} alt={photos[currentPhotoIndex].file_name} />
                    <p>Creation Date/Time: {photos[currentPhotoIndex].date_time}</p>
                    <Typography variant="h3">Comments</Typography>
                    {photos[currentPhotoIndex].comments && photos[currentPhotoIndex].comments.length > 0 ? (
                        <ul className="comments">
                            {photos[currentPhotoIndex].comments.map((comment) => (
                                <li key={comment._id} className="comment">
                                    <p>Comment Date/Time: {comment.date_time}</p>
                                    <p>
                                        Comment by:{' '}
                                        <Link to={`/users/${comment.user._id}`}>
                                            {`${comment.user.first_name} ${comment.last_name}`}
                                        </Link>
                                    </p>
                                    <p>Comment: {comment.comment}</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <Typography variant="body2">No comments for this photo</Typography>
                    )}
                </div>
            ) : (
                photos.map((photo, index) => (
                    <div
                        key={photo._id}
                        className={`photo ${index === currentPhotoIndex ? 'visible' : 'hidden'}`}
                    >
                        <img src={`/images/${photo.file_name}`} alt={photo.file_name} />
                        <p>Creation Date/Time: {photo.date_time}</p>
                        <Typography variant="h3">Comments</Typography>
                        {photo.comments && photo.comments.length > 0 ? (
                            <ul className="comments">
                                {photo.comments.map((comment) => (
                                    <li key={comment._id} className="comment">
                                        <p>Comment Date/Time: {comment.date_time}</p>
                                        <p>
                                            Comment by:{' '}
                                            <Link to={`/users/${comment.user._id}`}>
                                                {`${comment.user.first_name} ${comment.last_name}`}
                                            </Link>
                                        </p>
                                        <p>Comment: {comment.comment}</p>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <Typography variant="body2">No comments for this photo</Typography>
                        )}
                    </div>
                ))
            )}
        </div>
    );
}

export default UserPhotos;
