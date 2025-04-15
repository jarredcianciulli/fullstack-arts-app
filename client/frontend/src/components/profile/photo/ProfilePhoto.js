import { useState } from "react";
import { FaUserCircle } from "react-icons/fa"; // User icon
import { useMutation, useQueryClient } from "@tanstack/react-query";
import classes from "./ProfilePhoto.module.css";

// Upload profile photo mutation
const uploadProfilePhoto = async (file) => {
  const formData = new FormData();
  formData.append("photo", file);

  const response = await fetch(
    `${process.env.REACT_APP_API_URL}/api/v1/accounts/upload-profile`,
    {
      method: "POST",
      body: formData,
      credentials: "include",
    }
  );

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to upload image");
  }

  return data.user.photo; // Assuming the API returns the updated photo URL
};

// Delete profile photo mutation
const deleteProfilePhoto = async () => {
  const response = await fetch(
    `${process.env.REACT_APP_API_URL}/api/v1/accounts/delete-profile-photo`,
    {
      method: "DELETE",
      credentials: "include",
    }
  );

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to delete image");
  }

  return null; // Return null since the photo will be deleted
};

const ProfilePhoto = ({ initialPhoto, user }) => {
  const queryClient = useQueryClient();
  const [error, setError] = useState(null); // Initialize error state

  const { mutate: uploadPhoto, isLoading: uploadLoading } = useMutation({
    mutationFn: uploadProfilePhoto,
    onSuccess: (newPhoto) => {
      queryClient.invalidateQueries(["profilePhoto"]);
    },
    onError: (error) => {
      setError(error.message); // Set error message
    },
  });

  const { mutate: removePhoto, isLoading: removeLoading } = useMutation({
    mutationFn: deleteProfilePhoto,
    onSuccess: () => {
      queryClient.invalidateQueries(["profilePhoto"]);
    },
    onError: (error) => {
      setError(error.message); // Set error message
    },
  });

  const handlePhotoChange = (event) => {
    const file = event.target.files[0];
    if (!file || !file.type.startsWith("image/")) {
      setError("Please upload a valid image file.");
      return;
    }
    uploadPhoto(file);
  };

  const handleRemovePhoto = () => {
    removePhoto();
  };

  return (
    <div className={classes.profileBody}>
      <div className={classes.profileContainer}>
        <div className={classes.imageContainer}>
          {initialPhoto ? (
            <img
              src={initialPhoto}
              alt="Profile"
              className={classes.profileImage}
            />
          ) : (
            <FaUserCircle className={classes.defaultIcon} />
          )}
        </div>
        <input
          type="file"
          id="fileInput"
          accept="image/*"
          onChange={handlePhotoChange}
          className={classes.fileInput}
          disabled={uploadLoading || removeLoading}
        />
        <label htmlFor="fileInput" className={classes.uploadButton}>
          {uploadLoading
            ? "Uploading..."
            : initialPhoto
            ? "Update Photo"
            : "Upload Photo"}
        </label>
        {initialPhoto && (
          <button
            className={classes.removeButton}
            onClick={handleRemovePhoto}
            disabled={removeLoading || uploadLoading}
          >
            {removeLoading ? "Removing..." : "Remove Photo"}
          </button>
        )}
        {error && <p className={classes.error}>{error}</p>}
      </div>
    </div>
  );
};

export default ProfilePhoto;
