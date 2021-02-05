import * as AWS from "aws-sdk";

// AWS.config.update({
//   region: "us-west-2",
//   endpoint: "https://dynamodb.us-west-2.amazonaws.com",
// });

const docClient = new AWS.DynamoDB.DocumentClient();
const TableName = "clothing-articles";

export interface Article {
  id: string;
  title: string;
  color: string;
  brand: string;
  kind: string;
  size: string;
  updated: string;
}

interface FakeDB {
  [key: string]: Article;
}

const FAKE_DATABASE: FakeDB = {
  "1": {
    id: "1",
    title: "Medium weight burgundy cardigan",
    color: "burgundy",
    brand: "Picadilly Fashions",
    kind: "sweater",
    size: "2X",
    updated: "2020-12-13T00:00:00Z",
  },
  "2": {
    id: "2",
    title: "Grey heart-pattern t-shirt",
    color: "grey",
    brand: "Torrid",
    kind: "shirt",
    size: "3X",
    updated: "2021-01-11T12:00:00Z",
  },
};

export async function getArticle(id: string): Promise<Article | null> {
  const fakeResult = FAKE_DATABASE[id];
  if (fakeResult) {
    return fakeResult;
  }

  const queryResult = await docClient
    .get({
      TableName,
      Key: {
        articleId: id,
      },
    })
    .promise();
  if (!queryResult.Item) {
    return null;
  }
  console.log(JSON.stringify(queryResult));
  return ({
    ...queryResult.Item,
    id: queryResult.Item.articleId,
    articleId: undefined,
  } as unknown) as Article;
}
