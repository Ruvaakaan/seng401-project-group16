import makeApiCall from "./makeApiCall";

export const getImages = async (id) => {

  const request = JSON.stringify({
    competition_id: id,
  })
  let res = await makeApiCall(`https://p7kiqce3wh.execute-api.us-west-2.amazonaws.com/test/get_competition_drawings`, "POST", request)

  let body = res.body;
  body = JSON.parse(body);
  
  return body;
};
