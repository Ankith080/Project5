import React, { useState, useEffect } from 'react';
import { Typography, Button, Checkbox } from '@mui/material';
import { Link, useParams, useHistory } from 'react-router-dom';
// import FetchModel from '../../lib/fetchModelData';
import './userPhotos.css'; // Change this if you create a specific CSS for user photos
import axios from 'axios';
import { MentionsInput, Mention } from 'react-mentions'
import mentionStyle from "./mentionStyles";
import "./mentionsInputStyles.css"
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import {
  Modal,
  Box,
  FormControlLabel,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from "@mui/material";
function UserPhotos(props) {
  const { userId, photoIndex } = useParams();
  const [photos, setPhotos] = useState([]);
  const [, setAdvancedFeaturesEnabled] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [showAdvancedFeatures, setShowAdvancedFeatures] = useState(false);
  const history = useHistory();
  const [reload, setReload] = useState();
  const [userList, setUserList] = useState([]);
  const [comments, setComments] = useState({});
  const [open, setOpen] = useState(false);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [personalPhotoSelected, setPersonalPhotoSelected] = useState(false);

  const handleOpen = () => setOpen(true);

  function handleClose() {
    setPersonalPhotoSelected(false);
    setSelectedUserIds([]);
    setOpen(false);
  }

  const handleUserCheckboxChange = (id) => {
    let userIds = [...selectedUserIds];
    if (userIds.includes(id)) {
      userIds = userIds.filter(userId => userId !== id);
    }
    else {
      userIds.push(id)
    }
    if (userIds.length) {
      setPersonalPhotoSelected(false);
    }
    setSelectedUserIds([...userIds]);

  };

  const handleSubmit = () => {
    setOpen(false);

  };

  let uploadInput = '';
  let handleUploadButtonClicked = (e) => {
    e.preventDefault();
    if (uploadInput.files.length > 0) {
      // Create a DOM form and add the file to it under the name uploadedphoto
      const domForm = new FormData();
      domForm.append('uploadedphoto', uploadInput.files[0]);

      const visibleTo = personalPhotoSelected ? [userId] : selectedUserIds;
      domForm.append('visibleTo', JSON.stringify(visibleTo));

      axios
        .post('/photos/new', domForm)
        .then(() => {
          setReload((preload) => !preload);
          fetchUserPhotos()
        })
        .catch((err) => console.log(`POST ERR: ${err}`));
    }
    handleClose()
    setOpen(false);
  };

  function getUsers() {
    axios.get(`/user/list`).then(
      (data) => {
        setUserList(data.data)
      },
      (err) => {
        console.log(`Status Code UL: ${err?.response?.status}`);
      }
    );
  }

  const fetchUserPhotos = () => {
    axios
      .get(`/photosOfUser/${userId}`)
      .then((response) => {
        let userPhotos = response.data;
        userPhotos.sort((a, b) => {
          const likesA = a.likes ? a.likes.length : 0;
          const likesB = b.likes ? b.likes.length : 0;

          if (likesA !== likesB) {
            return likesB - likesA;
          }

          const dateA = new Date(a.date_time);
          const dateB = new Date(b.date_time);
          return dateB - dateA;
        });
        userPhotos = userPhotos.filter((obj) => {
          if (!obj.visibleTo || obj.visibleTo.length == 0) {
            return true;
          }
          return obj.visibleTo.includes(userId);
        })
        setPhotos(userPhotos);

        if (photoIndex) {
          setAdvancedFeaturesEnabled(true);
          setCurrentPhotoIndex(parseInt(photoIndex, 10));
        }
      })
      .catch((error) => {
        console.error('Error fetching user photos:', error);
      });
  };

  useEffect(() => {
    fetchUserPhotos();
    getUsers();
  }, [userId, photoIndex, reload]);


  function getComment(inputString) {
    return inputString.replace(/@\[(.*?)\]\(.*?\)/, "$1");

  }

  const handleCommentChange = (event, photoId) => {
    setComments((prevComments) => ({
      ...prevComments,
      [photoId]: event.target.value,
    }));
  };
  const handleCommentSubmit = (id) => {
    axios
      .post(`/commentsOfPhoto/${id}`, {
        comment: comments[id] || '', // Use the comment from the state
        userId: userId,
      })
      .then(() => {
        setComments((prevComments) => ({
          ...prevComments,
          [id]: '', // Clear the comment after submission
        }));
        setReload(preload => !preload);
      })
      .catch((error) => {
        console.error('Error adding comment:', error);
      });

  };


  const handleLikeOrUnlike = (photo, likeOrUnlike) => {
    axios
      .post(`/likeOrUnlikePhoto/${photo._id}`, {
        likeOrUnlike: likeOrUnlike,
        userId: userId,
      })
      .then(() => {
        setReload(preload => !preload);
      })
      .catch((error) => {
        console.error('Error likeOrUnlike comment:', error);
      });

  };


  // Show advanced features
  const handleCheckboxChange = () => {
    setShowAdvancedFeatures(!showAdvancedFeatures);
  };

  // Go back to user details
  const handleGoBack = () => {
    history.push(`/users/${userId}`);
  };

  // Advanced features next photo
  const handleNextPhoto = () => {
    if (currentPhotoIndex < photos.length - 1) {
      setCurrentPhotoIndex(currentPhotoIndex + 1);
    }
  };

  // Advanced features previous photo
  const handlePreviousPhoto = () => {
    if (currentPhotoIndex > 0) {
      setCurrentPhotoIndex(currentPhotoIndex - 1);
    }
  };

  const renderUploadForm = () => (
    <div>
      <div className='add-photos'>
        <form action='' onSubmit={handleUploadButtonClicked}>
          <input
            type='file'
            accept='image/*'
            ref={(domFileRef) => {
              uploadInput = domFileRef;
            }}
          />
          <input style={{ marginTop: "10px" }} value='Submit Photo' type='submit' id='submit-photo-btn' />
        </form>
      </div>
      <div style={{ marginTop: "10px" }}>
        <Button
          variant='outlined'
          color='primary'
          onClick={handleOpen}
        >
          Select User
        </Button>
      </div>
    </div>
  );

  const renderUserSelectionModal = () => (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" gutterBottom>
          Select Users
        </Typography>

        <FormControlLabel
          control={
            <Checkbox
              checked={personalPhotoSelected}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedUserIds([]);
                }
                setPersonalPhotoSelected(e.target.checked);
              }}
            />
          }
          label="Personal Photo"
        />

        <List>
          {userList.map((user) => (
            <ListItem key={user._id}>
              <ListItemText primary={user.first_name + " " + user.last_name} />
              <Checkbox
                checked={selectedUserIds.includes(user._id)}
                onChange={() => handleUserCheckboxChange(user._id)}
              />
            </ListItem>
          ))}
        </List>

        <Box mt={2} textAlign="right">
          <Button onClick={handleClose} variant="text" sx={{ mr: 1 }}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="contained">
            Submit
          </Button>
        </Box>
      </Box>
    </Modal>
  );


  // If user has no photos, "loading" otherwise display photos and comments
  return photos.length === 0 ? (
    <div>
      <p>There are no photos!</p>
      {(props.AppState.active_user._id === userId) ?
        (
          renderUploadForm()
        )
        :
        <div></div>}
      {renderUserSelectionModal()}
    </div>
  ) : (
    // Photos header section
    <div className='user-photos-container'>
      <div className='user-photos-header'>
        <Typography variant='h2' sx={{ fontSize: '40px' }}>
          Photos
        </Typography>
        <Button variant='contained' color='primary' onClick={handleGoBack}>
          Go back to user details
        </Button>
      </div>
      {/* Advanced features check box and buttons */}
      <Checkbox
        checked={showAdvancedFeatures}
        onChange={handleCheckboxChange}
        inputProps={{ 'aria-label': 'Show advanced features' }}
      />
      Show Advanced Features
      {showAdvancedFeatures && (
        <div className='photo-navigation'>
          <Button
            variant='outlined'
            color='primary'
            onClick={handlePreviousPhoto}
          >
            Previous
          </Button>
          <Button variant='outlined' color='primary' onClick={handleNextPhoto}>
            Next
          </Button>
        </div>
      )}
      {/* Advanced features checked layout */}
      {showAdvancedFeatures ? (
        <div className='photo'>
          <img
            src={`/images/${photos[currentPhotoIndex].file_name}`}
            alt={photos[currentPhotoIndex].file_name}
          />
          <p>Creation Date/Time: {photos[currentPhotoIndex].date_time}</p>

          {/* Comments in advanced view */}
          <Typography variant='h3' sx={{ fontSize: '38px' }}>
            Comments
          </Typography>
          {photos[currentPhotoIndex].comments &&
            photos[currentPhotoIndex].comments.length > 0 ? (
            <ul className='comments'>
              {photos[currentPhotoIndex].comments.map((comment) => (
                <li key={comment._id} className='comment'>
                  <p>Comment Date/Time: {comment.date_time}</p>
                  <p>
                    Comment by:{'  '}
                    <Link to={`/users/${comment.user._id}`}>
                      {`${comment.user.first_name} ${comment.user.last_name}`}
                    </Link>
                  </p>
                  <p>Comment:  {getComment(comment.comment)}</p>
                </li>
              ))}
            </ul>
          ) : (
            <Typography variant='body2'>No comments for this photo</Typography>
          )}
        </div>
      ) : (
        // Advanced features non-checked layout
        photos.map((photo, index) => (
          <div
            key={photo._id}
            className={`photo ${index === currentPhotoIndex ? 'visible' : 'hidden'
              }`}
          >
            <img src={`/images/${photo.file_name}`} alt={photo.file_name} />
            {/*   <img
              src={"https://images.unsplash.com/photo-1587691592099-24045742c181?q=80&w=3008&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}
              alt="image"
              style={{ height: "250px", width: "250px", objectFit: "contain" }}
            /> */}
            <div className='like-div'>
              {photo?.likes?.length ? <p className='like-p'>{photo?.likes?.length}</p> : ""}
              {photo?.likes?.includes(userId) ? <ThumbUpAltIcon style={{ color: 'red', fontSize: '40px', cursor: "pointer" }} onClick={() => {
                handleLikeOrUnlike(photo, false)
              }} />
                :
                <ThumbUpOffAltIcon style={{ fontSize: '40px', cursor: "pointer" }} onClick={() => {
                  handleLikeOrUnlike(photo, true)
                }} />
              }
              <p></p>
            </div>
            <p>
              <strong>Creation Date/Time: </strong>
              {new Date(photo.date_time).toLocaleString('en-US')}
            </p>

            {/* Comments in non-advanced view */}
            <Typography variant='h3' className='user-photos-comment-header'>
              Comments
            </Typography>
            {photo.comments && photo.comments.length > 0 ? (
              <ul className='comments'>
                {photo.comments.map((comment) => (
                  <li key={comment._id} className='comment'>
                    <p>
                      <strong>Comment Date/Time: </strong>
                      {new Date(comment.date_time).toLocaleString('en-US')}
                    </p>
                    <p>
                      <strong>Comment by: </strong>{' '}
                      <Link to={`/users/${comment.user._id}`}>
                        {`${comment.user.first_name} ${comment.user.last_name}`}
                      </Link>
                    </p>
                    <p>
                      <strong>Comment: </strong>
                      {getComment(comment.comment)}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <Typography variant='body2'>
                No comments for this photo
              </Typography>
            )}
            <div>
              <div
                key={photo._id}
                id={`commentBox${photo._id}`}
              >
                <MentionsInput
                  key={photo._id}
                  value={comments[photo._id] || ''}
                  onChange={(event) => handleCommentChange(event, photo._id)}
                  className="mentions"
                  forceSuggestionsAboveCursor={true}
                >

                  <Mention
                    className="mentions__mention"
                    style={mentionStyle}
                    data={userList.map((obj) => { return { id: obj._id, display: obj.first_name + " " + obj.last_name } })} />
                </MentionsInput>
              </div>
              <Button
                variant="contained"
                color="primary"
                onClick={() => { handleCommentSubmit(photo._id); }}
                disabled={!comments[photo._id]?.trim()}
              >
                Submit
              </Button>
            </div>
          </div>
        ))
      )}
      {(props.AppState.active_user._id === userId) ?
        renderUploadForm()
        :
        <div></div>}
      {renderUserSelectionModal()}
    </div >
  );
}

export default UserPhotos;
