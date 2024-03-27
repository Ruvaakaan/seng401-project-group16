import makeApiCall from "./makeApiCall";

export const getUserImages = async (user) => {
  const request = JSON.stringify({
    username: user
  });

  let res = await makeApiCall(`https://p7kiqce3wh.execute-api.us-west-2.amazonaws.com/prod/get_users_drawings`, "POST", request)
  
  let image_list = [];

  for (let i = 0; i < res.items.length; i++) {
    let itemToAdd = {};
    itemToAdd.competition_id = res.items[i].competition_id.S;
    itemToAdd.date_created = res.items[i].date_created.S;
    itemToAdd.drawing_id = res.items[i].drawing_id.S;
    itemToAdd.likes = res.items[i].likes.N;
    itemToAdd.s3_url = res.items[i].s3_url.S;
    itemToAdd.username = res.items[i].username.S;
    itemToAdd.liked_by_user = res.items[i].liked_by_user;
    image_list.push(itemToAdd);
  }
  
  return image_list;
};