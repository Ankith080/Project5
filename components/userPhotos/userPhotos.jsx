import React from "react";
import {
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
} from "@mui/material";
import { Link } from "react-router-dom";
import "./userPhotos.css";
import axios from "axios";

class UserPhotos extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      photos: [],
      user: null,
      comment: null,
      new_comment: "", // Step 1: Add state for new comment
      add_comment: false,
      current_photo_id: null,
    };
    this.handleShowAddComment = this.handleShowAddComment.bind(this);
    this.handleNewCommentChange = this.handleNewCommentChange.bind(this);
    this.handleCancelAddComment = this.handleCancelAddComment.bind(this);
    this.handleSubmitAddComment = this.handleSubmitAddComment.bind(this);
  }

  componentDidMount() {
    this.fetchUserPhotosAndDetails();
  }

  componentDidUpdate(prevProps) {
    const { match } = this.props;
    const { userId } = match.params;

    if (prevProps.match.params.userId !== userId) {
      this.fetchUserPhotosAndDetails();
    }
  }

  fetchUserPhotosAndDetails() {
    const { match } = this.props;
    const { userId } = match.params;

    axios
      .get(`/photosOfUser/${userId}`)
      .then((response) => {
        this.setState({ photos: response.data });
      })
      .catch((error) => {
        console.error("Error fetching user photos:", error);
      });

    axios
      .get(`/user/${userId}`)
      .then((response) => {
        this.setState({
          user: response.data,
          comment: response.data ? response.data.comment : null,
        });
      })
      .catch((error) => {
        console.error("Error fetching user details:", error);
      });
  }

  handleShowAddComment = (event) => {
    const photo_id = event.currentTarget.getAttribute("photo_id");
    this.setState({
      add_comment: true,
      current_photo_id: photo_id,
    });
  };

  renderAddCommentDialog() {
    return (
      <Dialog open={this.state.add_comment}>
        <DialogTitle>Add Comment</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter a new comment for the photo.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="comment"
            label="Comment"
            multiline
            rows={4}
            fullWidth
            variant="standard"
            onChange={this.handleNewCommentChange}
            value={this.state.new_comment}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleCancelAddComment}>Cancel</Button>
          <Button onClick={this.handleSubmitAddComment}>Add</Button>
        </DialogActions>
      </Dialog>
    );
  }

  handleSubmitAddComment = () => {
    const { current_photo_id, new_comment } = this.state;

    // Use Axios to send the new comment to the server
    axios
      .post(`/commentsOfPhoto/${current_photo_id}`, { comment: new_comment })
      .then(() => {
        // Log a message indicating that the comment was added to the database
        console.log("Comment added to the database successfully");

        // Update state to close the dialog and reset new_comment
        this.setState({
          add_comment: false,
          new_comment: "",
          current_photo_id: null,
        });
      })
      .catch((error) => {
        console.error("Error adding comment:", error);
      });
  };

  // Step 1: Add a handler for changing the new comment text
  handleNewCommentChange = (event) => {
    this.setState({
      new_comment: event.target.value,
    });
  };

  // Step 5: Add a handler for canceling the add comment dialog
  handleCancelAddComment = () => {
    this.setState({
      add_comment: false,
      new_comment: "",
      current_photo_id: null,
    });
  };

  render() {
    const { photos, user, comment } = this.state;
    const { match } = this.props;
    const { userId } = match.params;

    return (
      <div>
        <Button
          component={Link}
          to={`/users/${userId}`}
          variant="contained"
          className="ButtonLink"
        >
          User Details
        </Button>
        <Typography variant="h4" className="UserPhotosHeader">
          User Photos
        </Typography>
        <div className="photo-list">
          {photos.map((photo) => (
            <div key={photo._id} className="photo-item">
              <div className="photo-image">
                <img
                  src={`/images/${photo.file_name}`}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
              <div className="user-photo-box" style={{ marginTop: "16px" }}>
                <Typography variant="caption" className="user-photo-title">
                  Date Taken
                </Typography>
                <Typography variant="body1" className="user-photo-value">
                  {photo.date_time}
                </Typography>
              </div>

              {photo.comments && photo.comments.length > 0 && (
                <div>
                  <p style={{ margin: 0, fontWeight: "bold" }}>Comments:</p>
                  {photo.comments.map((userComment) => (
                    <div
                      key={userComment._id}
                      className="user-photo-box"
                      style={{ marginTop: "16px" }}
                    >
                      <p>{userComment.comment}</p>
                      <p>
                        <b>Commented ON:</b> {userComment.date_time}
                      </p>
                      <p>
                        <b>Commented BY:</b>
                        <Link to={`/users/${userComment.user._id}`}>
                          {userComment.user.first_name}{" "}
                          {userComment.user.last_name}
                        </Link>
                      </p>
                    </div>
                  ))}
                  {/* <Button photo_id={photo._id} variant="contained" onClick={this.handleShowAddComment}>
                    Add Comment
                  </Button> */}
                </div>
              )}
              <Button
                photo_id={photo._id}
                variant="contained"
                onClick={this.handleShowAddComment}
              >
                Add Comment
              </Button>
            </div>
          ))}
        </div>

        {user ? (
          <div>
            {comment && (
              <div className="user-photo-box" style={{ marginTop: "16px" }}>
                <Typography variant="caption" className="user-photo-title">
                  Comment
                </Typography>
                <Typography variant="body1" className="user-photo-value">
                  {comment}
                </Typography>
              </div>
            )}
          </div>
        ) : (
          <Typography variant="body1" className="user-detail-box loading-text">
            Loading user details...
          </Typography>
        )}

        {/* Step 3: Render the add comment dialog */}
        {this.renderAddCommentDialog()}
      </div>
    );
  }
}

export default UserPhotos;
