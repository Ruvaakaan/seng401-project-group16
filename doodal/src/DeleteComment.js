import makeApiCall from "./makeApiCall";

export const delComments = async (drawingID, dc) => {
  const request = JSON.stringify({
    drawing_id: drawingID,
    date_created: dc,
  });

  let res = await makeApiCall(`https://p7kiqce3wh.execute-api.us-west-2.amazonaws.com/prod/delete_comment`, "POST", request)
  
  return res;
};