export const getImages = async (id) => {
    let res = await fetch(
      `https://p7kiqce3wh.execute-api.us-west-2.amazonaws.com/test/get_drawings`,
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
    let image_list = body["image_urls"];
    return image_list;
  };