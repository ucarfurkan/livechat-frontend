const baseURL = "http://localhost:3000/api";

export default new (class ApiService {
  /** AUTH APIs */

  /**
   * Registers a new user with the given username and password.
   *
   * @param {string} username - The username of the new user.
   * @param {string} password - The password of the new user.
   * @returns {Promise<Response>} The response from the server.
   */
  async registerUser(username, password) {
    const response = await fetch(`${baseURL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });
    return response;
  }

  /**
   * Logs in a user with the provided username and password.
   *
   * @param {string} username - The username of the user.
   * @param {string} password - The password of the user.
   * @returns {Promise<Response>} The response from the login request.
   */
  async loginUser(username, password) {
    const response = await fetch(`${baseURL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });
    return response;
  }

  /** MESSAGE APIs */
  
  /**
   * Fetches messages from the server.
   *
   * @async
   * @function getMessages
   * @returns {Promise<Response>} The response from the fetch request.
   */
  async getMessages() {
    const response = await fetch(`${baseURL}/messages`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response;
  }

  /**
   * Sends a message to the server.
   *
   * @param {string} message - The message to be sent.
   * @returns {Promise<Response>} The response from the server.
   */
  async sendMessage(message) {
    const response = await fetch(`${baseURL}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ message }),
    });
    return response;
  }

  /**
   * Fetches messages by ID from the server.
   *
   * @param {string} id - The ID of the messages to fetch.
   * @returns {Promise<Response>} A promise that resolves to the response of the fetch request.
   */
  async getMessagesById(id) {
    const response = await fetch(`${baseURL}/messages/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response;
  }

  /**
   * Updates a message with the given ID.
   *
   * @param {string} id - The ID of the message to update.
   * @param {string} message - The new message content.
   * @returns {Promise<Response>} The response from the server.
   */
  async updateMessage(id, message) {
    const response = await fetch(`${baseURL}/messages/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ message }),
    });
    return response;
  }

  /**
   * Deletes a message using the specified message ID.
   * 
   * @param {string|number} id - The ID of the message to delete
   * @returns {Promise<Response>} The fetch response from the delete request
   * @throws {Error} If the network request fails or returns an error status
   * @async
   */
  async deleteMessage(id) {
    const response = await fetch(`${baseURL}/messages/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response;
  }

  /** USER APIs */

  /**
   * Fetches all users from the API
   * @async
   * @returns {Promise<Response>} The fetch response object containing user data
   * @throws {Error} If the network request fails
   */
  async getUsers() {
    const response = await fetch(`${baseURL}/users`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response;
  }

  /**
   * Retrieves a user by their ID from the API
   * @async
   * @param {string|number} id - The unique identifier of the user to retrieve
   * @returns {Promise<Response>} The fetch response containing user data
   * @throws {Error} When the network request fails
   */
  async getUserById(id) {
    const response = await fetch(`${baseURL}/users/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response;
  }

  /**
   * Updates a user's information in the system
   * @async
   * @param {string} id - The unique identifier of the user to update
   * @param {string} username - The new username for the user
   * @param {string} password - The new password for the user
   * @returns {Promise<Response>} The fetch response from the update operation
   * @throws {Error} If the network request fails or returns an error status
   */
  async updateUser(id, username, password) {
    const response = await fetch(`${baseURL}/users/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ username, password }),
    });
    return response;
  }

  /**
   * Deletes a user from the system by their ID
   * @async
   * @param {string|number} id - The unique identifier of the user to delete
   * @returns {Promise<Response>} The response from the delete request
   * @throws {Error} If the network request fails or if not authorized
   */
  async deleteUser(id) {
    const response = await fetch(`${baseURL}/users/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response;
  }
})();
