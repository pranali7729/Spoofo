import React, { useEffect, useState } from "react";
import axios from "axios";
import { useStateProvider } from "../utils/StateProvider";

function PlayerDevices() {
  const [devices, setDevices] = useState([]);
  const [{ token }] = useStateProvider();

  useEffect(() => {
    const fetchPlayerDevices = async () => {
      try {
        const response = await axios.get(
          "https://api.spotify.com/v1/me/player/devices",
          {
            headers: {
              Authorization: "Bearer" + token,
            },
          }
        );
        setDevices(response.data.devices);
      } catch (error) {
        console.error("Error fetching player devices:", error);
      }
    };

    fetchPlayerDevices();
  }, []);

  return devices.map((device) => device.id);
}

export default PlayerDevices;
