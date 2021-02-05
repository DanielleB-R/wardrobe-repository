import * as AWS from "aws-sdk";
import * as z from "zod";

const docClient = new AWS.DynamoDB.DocumentClient();
const TableName = "clothing-articles";

const articleSchema = z.object({
  articleId: z.string(),
  title: z.string(),
  color: z.string(),
  brand: z.string(),
  kind: z.string(),
  size: z.string(),
  updated: z.string(),
});

export type Article = z.infer<typeof articleSchema>;

interface FakeDB {
  [key: string]: Article;
}

const FAKE_DATABASE: FakeDB = {
  "1": {
    articleId: "1",
    title: "Medium weight burgundy cardigan",
    color: "burgundy",
    brand: "Picadilly Fashions",
    kind: "sweater",
    size: "2X",
    updated: "2020-12-13T00:00:00Z",
  },
  "2": {
    articleId: "2",
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
  if (!queryResult.Item || !articleSchema.check(queryResult.Item)) {
    return null;
  }
  console.log(JSON.stringify(queryResult));

  return queryResult.Item;
}
