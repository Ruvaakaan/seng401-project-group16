import makeApiCall from "./makeApiCall";

export const getImages = async (id) => {
  const request = JSON.stringify({
    competition_id: id,
  })
  let res = await makeApiCall(`https://p7kiqce3wh.execute-api.us-west-2.amazonaws.com/test/get_competition_drawings`, "POST", request)

  let body = res.body;
  body = JSON.parse(body);
  
  let image_list = [];
  try {
    for (let i = 0; i < body["items"].length; i++) {
      let url = body["items"][i]["s3_url"]["S"];
      image_list.push(url);
    }
    return image_list;
  } catch {
    return [];
  }
};
