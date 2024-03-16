import makeApiCall from "./makeApiCall";

export const getComments = async (drawingID) => {
  const request = JSON.stringify({
    drawing_id: drawingID,
  });

  let res = await makeApiCall(``, "GET", request)
  
  return res;
};