import makeApiCall from "./makeApiCall";

export const likeUnlike = async (id) => {
  const request = JSON.stringify({
    drawing_id: id,
  })
  let res = await makeApiCall(`https://p7kiqce3wh.execute-api.us-west-2.amazonaws.com/test/like_unlike`, "POST", request)

  return res
};
