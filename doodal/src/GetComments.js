import makeApiCall from "./makeApiCall";

export const getComments = async (drawingID) => {
  const request = JSON.stringify({
    drawing_id: drawingID,
  });

  let res = await makeApiCall(`https://p7kiqce3wh.execute-api.us-west-2.amazonaws.com/prod/get_comments`, "POST", request)
  
  return res;
};