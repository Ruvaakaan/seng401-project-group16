export const getUserImages = async (id, authenticationToken) => {
  let res = await fetch(
    `https://p7kiqce3wh.execute-api.us-west-2.amazonaws.com/test/get_users_drawings`,
    {
      method: "POST",
      headers: {
        Authorization: authenticationToken,
      },
      body: JSON.stringify({
        user_id: id, // no point of adding this if authenticating
      }),
    }
  );


  let extracted = await res.json();
  console.log(extracted);
  // let { body } = extracted;
  // body = JSON.parse(body);
  // console.log(body)
  let image_list = [];

  for (let i = 0; i < extracted.items.length; i++) {
    // console.log(i);
    let url = extracted.items[i].s3_url.S;
    // console.log(url);
    image_list.push(url);
}
  console.log(image_list)
  return image_list;
};