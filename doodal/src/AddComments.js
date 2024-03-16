import makeApiCall from "./makeApiCall";

export const addComments = async (drawingID, comment) => {
  const request = JSON.stringify({
    drawing_id: drawingID,
    comment_text: comment
  });

  let res = await makeApiCall(`https://p7kiqce3wh.execute-api.us-west-2.amazonaws.com/test/add_comment`, "POST", request)

  console.log(res);
  
  return res;
};