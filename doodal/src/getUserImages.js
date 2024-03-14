import makeApiCall from "./makeApiCall";

export const getUserImages = async () => {
  let res = await makeApiCall(`https://p7kiqce3wh.execute-api.us-west-2.amazonaws.com/test/get_users_drawings`, "POST", {})

  console.log(res);
  // let extracted = res.body;
  // const extracted = JSON.parse(res.body);
  // console.log(extracted);

  let image_list = [];

  for (let i = 0; i < res.items.length; i++) {
    let url = res.items[i].s3_url.S;
    image_list.push(url);
  }
  console.log(image_list)
  return image_list;
};