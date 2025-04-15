// import { QueryClient } from "@tanstack/react-query";
import axios from "axios";
// export const queryClient = new QueryClient();

export async function fetchEvents({ signal, searchTerm, max }) {
  let url = "http://localhost:8080/events";

  if (searchTerm && max) {
    url += "?search=" + searchTerm + "&max=" + max;
  } else if (searchTerm) {
    url += "?search=" + searchTerm;
  } else if (max) {
    url += "?max=" + max;
  }

  const response = await fetch(url, { signal: signal });

  if (!response.ok) {
    const error = new Error("An error occurred while fetching the events");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const { events } = await response.json();

  return events;
}

export async function createNewEvent(eventData) {
  const response = await fetch(`http://localhost:8080/events`, {
    method: "POST",
    body: JSON.stringify(eventData),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = new Error("An error occurred while creating the event");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const { event } = await response.json();

  return event;
}

export async function fetchSelectableImages({ signal }) {
  const response = await fetch(`http://localhost:8080/events/images`, {
    signal,
  });

  if (!response.ok) {
    const error = new Error("An error occurred while fetching the images");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const { images } = await response.json();

  return images;
}

export async function fetchEvent({ id, signal }) {
  const response = await fetch(`http://localhost:8080/events/${id}`, {
    signal,
  });

  if (!response.ok) {
    const error = new Error("An error occurred while fetching the event");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const { event } = await response.json();

  return event;
}

export async function deleteEvent({ id }) {
  const response = await fetch(`http://localhost:8080/events/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = new Error("An error occurred while deleting the event");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  return response.json();
}

export async function updateEvent({ id, event }) {
  const response = await fetch(`http://localhost:8080/events/${id}`, {
    method: "PUT",
    body: JSON.stringify({ event }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = new Error("An error occurred while updating the event");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  return response.json();
}

/// Group Music Classes

export async function fetchSessionOverviews() {
  let url = "http://localhost:8080/api/v1/music/get-all";

  const response = await fetch(url, {
    credentials: "include",
    method: "GET",
    // headers: {
    //   "Content-Type": "application/json",
    // },
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

// export async function createNewMusicGroupPolicy(eventData) {
//   const response = await fetch(
//     `http://localhost:8080/api/v1/music/create-group`,
//     {
//       credentials: "include",
//       method: "POST",
//       body: eventData,
//     }
//   );
//   if (!response.ok) {
//     const error = new Error("An error occurred while creating the event");
//     error.code = response.status;
//     error.info = await response.json();
//     throw error;
//   }

//   const event = await response.json();
//   return event.data.sessionsOverview;
// }

export async function createNewMusicGroup(eventData) {
  const response = await fetch(
    `http://localhost:8080/api/v1/music/create-group`,
    {
      credentials: "include",
      method: "POST",
      body: JSON.stringify(eventData),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!response.ok) {
    const error = new Error("An error occurred while creating the event");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const event = await response.json();
  return event.data.sessionsOverview;
}

export async function createNewMusicGroupPolicy(eventData) {
  try {
    const response = await axios.post(
      "http://localhost:8080/api/v1/music/create-group",
      eventData,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (response.status >= 200 && response.status < 300) {
      console.log("Request was successful:", response.data);
    } else {
      const error = new Error("An error occurred while creating the event");
      error.code = response.status;
      error.info = response.data.message;
      console.log("notsuccess", error);

      throw error;
    }

    return response;
  } catch (error) {
    throw error;
  }
}

export async function deleteMusicGroup(id) {
  const response = await fetch(`http://localhost:8080/api/v1/music/${id}`, {
    credentials: "include",
    method: "DELETE",
  });

  if (!response.ok) {
    const error = new Error("An error occurred while deleting the event");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  return response.json();
}

export async function fetchSessionOverview(id) {
  let url = `http://localhost:8080/api/v1/music/${id}`;

  const response = await fetch(url, {
    credentials: "include",
    method: "GET",
  });

  if (!response.ok) {
    const error = new Error(
      "An error occurred while fetching the music class overviews"
    );
    console.log(response);
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const { data } = await response.json();

  return data.data;
}

export async function fetchSessions(id) {
  let url = `http://localhost:8080/api/v1/music/${id}/get-all`;

  const response = await fetch(url, {
    credentials: "include",
    method: "GET",
    // headers: {
    //   "Content-Type": "application/json",
    // },
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

export async function getPolicyDownload(id) {
  let url = `http://localhost:8080/api/v1/music/policy/${id}`;

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
  }

  console.log(response);
  return response;
}

export async function checkSession() {
  console.log("checking call");
  try {
    const response = await axios.get(
      "http://localhost:8081/api/v1/users/checkSession",
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

export async function createSection(eventData) {
  const response = await fetch(
    `http://localhost:8081/api/v1/reserve/create-section`,
    {
      credentials: "include",
      method: "POST",
      body: JSON.stringify(eventData),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!response.ok) {
    const error = new Error("An error occurred while creating the section");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const event = await response.json();
  return event.data.data;
}

export async function fetchSections() {
  let url = "http://localhost:8081/api/v1/reserve/get-all";

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
  console.log(data);

  return data.data;
}
