import React, { useState } from 'react';
import axios from 'axios';
async function enterFormData(url, userName, userEmail) {
    try {
        // Send a POST request to your backend
        const response = await axios.get("http://localhost:3001/addUser", {
          params: {
            name: userName,
            email: userEmail,
            url: url,
          },
        });
  
        // Handle the response if needed
        console.log("Add user request sent successfully", response.data);
      } catch (error) {
        // Handle errors
        console.error("Error sending adding user request", error);
      }
}

function EmailForm() {
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    // Validate email format
    if (!isValidEmail(userEmail)) {
      alert('Invalid email format');
      return;
    }
    console.log('Storing email:', userEmail, userName);
    // Here you can perform further actions like storing the email
    enterFormData("https://accounts.spotify.com/en/login?continue=https%3A%2F%2Faccounts.spotify.com%2Foauth2%2Fv2%2Fauth%3Fresponse_type%3Dnone%26client_id%3Dcfe923b2d660439caf2b557b21f31221%26scope%3Demail%2Bopenid%2Bprofile%2Buser-self-provisioning%2Bplaylist-modify-private%2Bplaylist-modify-public%2Bplaylist-read-collaborative%2Bplaylist-read-private%2Bugc-image-upload%2Buser-follow-modify%2Buser-follow-read%2Buser-library-modify%2Buser-library-read%2Buser-modify-playback-state%2Buser-read-currently-playing%2Buser-read-email%2Buser-read-playback-position%2Buser-read-playback-state%2Buser-read-private%2Buser-read-recently-played%2Buser-top-read%26redirect_uri%3Dhttps%253A%252F%252Fdeveloper.spotify.com%252Floggedin%26state%3Db6d246e4-fec3-412e-8327-69cfdfbdf5b4", userName, userEmail);

    // Clear the input field after submission
    setUserName('');
    setUserEmail('');
  };

  const isValidEmail = (email) => {
    // Simple email format validation using regular expression
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const storeEmail = (email) => {
    // Here you can implement logic to store the email
    // For example, you can send it to a server or store it in local storage
    console.log('Storing email:', email);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="userName"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
        required
      />
      <input
        type="email"
        name="userEmail"
        value={userEmail}
        onChange={(e) => setUserEmail(e.target.value)}
        required
      />
      <input type="submit" value="Submit" />
    </form>
  );
}

export default EmailForm;
