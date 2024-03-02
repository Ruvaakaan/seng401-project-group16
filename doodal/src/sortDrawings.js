export const sortImages = async (sort) => {
    let res = await fetch(
      `https://p7kiqce3wh.execute-api.us-west-2.amazonaws.com/test/sort_drawings`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sort_type: sort,
        }),
      }
    );
    let extracted = await res.json();
    let {body } = extracted;
    body = JSON.parse(body);
    let image_list = [];
    try {
      for (let i = 0; i < body.length; i++) {
        let url = body[i]["s3_url"];
        image_list.push(url);
      }
      return image_list;
    } catch {
      return [];
    }
  };