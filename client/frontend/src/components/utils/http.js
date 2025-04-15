import axios from "axios";
const apiUrl = process.env.REACT_APP_API_URL;

export async function fetchAccount(id) {
  const url = `${apiUrl}/api/v1/accounts/${id}`;

  const response = await fetch(url, {
    credentials: "include",
    method: "GET",
  });

  if (!response.ok) {
    const error = new Error(
      "An error occurred while fetching the music class overviews"
    );
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const { data } = await response.json();

  return data.data;
}

export async function fetchInvite(id) {
  const url = `${apiUrl}/api/v1/accounts/invite/${id}`;

  const response = await fetch(url, {
    credentials: "include",
    method: "GET",
  });

  let jsonResponse;
  try {
    jsonResponse = await response.json();
  } catch (error) {
    throw new Error("Failed to parse JSON response");
  }

  if (!response.ok) {
    const error = new Error(
      `Error ${response.status}: ${jsonResponse.message || "Unknown error"}`
    );
    error.code = response.status;
    error.info = jsonResponse;
    throw error;
  }

  if (!jsonResponse || !jsonResponse.data) {
    throw new Error("Invalid API response: missing 'data' field");
  }

  return jsonResponse.data;
}

export async function claimAccount(formData) {
  const response = await fetch(`${apiUrl}/api/v1/accounts/claim`, {
    method: "POST",
    credentials: "include",
    body: JSON.stringify(formData),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = new Error("An error occurred while claiming the account");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  return response.json();
}

export async function forgotPassword(formData) {
  console.log(apiUrl);
  const response = await fetch(`${apiUrl}/api/v1/accounts/forgotPassword`, {
    method: "POST",
    credentials: "include",
    body: JSON.stringify(formData),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = new Error("An error occurred while sending the reset link");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  return response.json();
}

export async function resetPW(resetToken, password, passwordConfirm) {
  const response = await fetch(
    `${apiUrl}/api/v1/accounts/resetPassword/${resetToken}`,
    {
      method: "PATCH",
      body: JSON.stringify({ password, passwordConfirm }),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    const error = new Error("An error occurred while resetting the password");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  return response.json();
}

export async function fetchEnrollments({ id }) {
  let url = `http://localhost:8081/api/v1/enrollments/get-all/${id}`;

  const response = await fetch(url, {
    credentials: "include",
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = new Error(
      "An error occurred while fetching the music class overviews"
    );
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const { data } = await response.json();
  console.log(data.data);
  return data.data;
}

export async function fetchEnrollmentById(id) {
  let url = `http://localhost:8081/api/v1/enrollments/${id}`;

  const response = await fetch(url, {
    credentials: "include",
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = new Error(
      "An error occurred while fetching the music class overviews"
    );
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const { data } = await response.json();
  console.log(data.data);
  return data.data;
}

export async function checkSession() {
  console.log("checking call");
  try {
    const response = await axios.get(
      "http://localhost:8081/api/v1/accounts/checkSession",
      {
        withCredentials: true,
      }
    );

    console.log("Response status:", response.status);

    if (response.status >= 200 && response.status < 300) {
      console.log("Request was successful:", response.data);
    } else {
      // Handle non-successful response
      const error = new Error("An error occurred while creating the event");
      error.code = response.status;
      error.info = response.data.message;
      console.log("Non-successful response error:", error);
      throw error;
    }

    console.log("Full response:", response);
    return response;
  } catch (error) {
    // Log and rethrow the error for further handling
    console.log("Caught error:", error);
    throw error;
  }
}
