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
    console.log(body)
    let image_list = [];

    for (let i = 0; i < body["items"].length; i++) {
      let url = body["items"][i]["s3_url"]["S"]; 
      image_list.push(url); 
    }
    console.log(image_list)
    return image_list;
  };