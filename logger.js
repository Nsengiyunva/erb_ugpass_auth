import axios from  "axios";

const LOGSTASH_URL = "http://localhost:5000";

function log(data) {
  try {
    axios.post(LOGSTASH_URL, {
      service: "erb-ugpass-auth",
      level: data.level || "info",
      message: data.message,
      timestamp: new Date().toISOString(),
      ...data
    });
  } catch (err) {
    console.error("Logging failed:", err.message);
  }
}

export default log