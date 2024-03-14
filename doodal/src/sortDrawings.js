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
    return body;
  };