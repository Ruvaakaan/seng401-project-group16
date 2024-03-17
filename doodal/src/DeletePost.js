import makeApiCall from "./makeApiCall";

export const delPost = async (drawingID, compID) => {
  const request = JSON.stringify({
    drawing_id: drawingID,
    competition_id: compID,
  });

  let res = await makeApiCall(`https://p7kiqce3wh.execute-api.us-west-2.amazonaws.com/test/delete_drawing`, "POST", request)
  
  return res;
};