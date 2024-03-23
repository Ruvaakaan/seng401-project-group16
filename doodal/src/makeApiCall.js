import Cookies from "js-cookie";
import axios from "axios";

async function makeApiCall(url, method, request) {
  const authenticationToken = Cookies.get("authentication");


  let headers = {};
  if (authenticationToken) {
    headers["Authorization"] = authenticationToken;
  }

  try {
    let response;
    if (method === "GET") {
      response = await axios.get(url, { headers });
    } else if (method === "POST") {
      //only post methods require knowing the user that is posting

      //retrieve userinfo cookie to get userid
      const userInfo = Cookies.get("userInfo");
      // console.log("userinfo", userInfo)
      if (userInfo) {
        // console.log("aasdasdasd")
        const userInfoObj = JSON.parse(userInfo);

        headers["username"] = userInfoObj["username"]["S"];

        // console.log(userInfoObj["username"]["S"])
      }
      response = await axios.post(url, request, { headers });
    } else if (method === "DELETE") {
      //delete method not currently being used as of mar 2
      const userInfo = Cookies.get("userInfo");
      if (userInfo) {
        const userInfoObj = JSON.parse(userInfo);
        headers["username"] = userInfoObj["username"]["S"];
      }
      response = await axios.delete(url, request, { headers });
    }

    if (response.status === 200 || response.status === 201) {
      return response.data; // Return response object on success
    }
  } catch (error) {
    console.error("makeApiCall ~ error:", error);
    if (error.response.status === 400 || error.response.status === 401) {
      // Handle 401 error
      console.log("Unauthorized Error");
      const apiCallToStore = {
        request: request,
        method: method,
        url: url,
      };
      handleUnauthorizedError(apiCallToStore);
    }
  }
}

function handleUnauthorizedError(unfinishedCall) {
  //checks if an unfinishedapicall exists already to prevent chaining of requests

  if (localStorage.getItem("unfinishedapicall") !== null) {
    localStorage.removeItem("unfinishedapicall");
    return;
  }
  // Save the unfinished API call request to a cookie for later retrieval
  localStorage.setItem("unfinishedapicall", JSON.stringify(unfinishedCall));

  const redirectUri = encodeURIComponent("https://seng401-project-group16.vercel.app/");
  const fullRedirectUrl = `https://doodal.auth.us-west-2.amazoncognito.com/login?client_id=6c1og3jvcp62aqmkhjcgkjkvgq&response_type=token&scope=aws.cognito.signin.user.admin+email+openid+phone+profile&redirect_uri=${redirectUri}`;
  window.location.href = fullRedirectUrl;
}

export default makeApiCall;
