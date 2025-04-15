import axios from "axios";

const apiUrl = process.env.REACT_APP_API_URL;

export async function getJackrabbitTable(jsonData) {
  const url = `${apiUrl}/api/v1/jackrabbit/api/data`;

  try {
    const response = await axios.get(url, {
      params: jsonData,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);

    if (error.response) {
      const customError = new Error(
        "An error occurred while fetching the music class overviews"
      );
      customError.code = error.response.status;
      customError.info = error.response.data;
      throw customError;
    } else {
      throw error;
    }
  }
}

export async function createNewMusicPrivateLessonRequest(eventData) {
  try {
    const response = await axios.post(
      `${apiUrl}/api/v1/music/create-lesson-request`,
      eventData,
      {
        headers: {
          "Content-Type": "application/json", // Changed to application/json
        },
      }
    );

    if (response.status >= 200 && response.status < 300) {
      return response.data; // Ensure the response data is returned for success case
    } else {
      const error = new Error("An error occurred while creating the event");
      error.code = response.status;
      error.info = response.data.message;

      throw error;
    }
  } catch (error) {
    throw error;
  }
}
