export const getImages = async (id) => {
  let res = await fetch(
    `https://p7kiqce3wh.execute-api.us-west-2.amazonaws.com/test/get_competition_drawings`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        competition_id: id,
      }),
    }
  );
  let extracted = await res.json();

  let { body } = extracted;
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
