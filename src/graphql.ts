import * as n from "nexus";
import { graphqlHTTP } from "express-graphql";

import * as db from "./db";

export const Timestamp = n.scalarType({
  name: "Timestamp",
  asNexusMethod: "timestamp",
  description: "A timestamp, encoded in RFC 3336 format",
});

export const ArticleKind = n.enumType({
  name: "ArticleKind",
  members: ["shirt", "pants", "dress", "skirt", "sweater"],
  description: "A type of clothing article",
});

const articleDetails = (t: any) => {
  t.string("title");
  t.string("color");
  t.string("brand");
  t.field("kind", { type: ArticleKind });
  t.string("size");
};

export const Article = n.objectType({
  name: "Article",
  description: "An article of clothing",
  definition(t) {
    t.id("id", {
      description: "The unique ID of the article",
      resolve(obj) {
        return obj.articleId;
      },
    });
    articleDetails(t);
    t.field("updated", { type: Timestamp });
  },
});

export const ArticleQuery = n.queryField("article", {
  type: Article,
  description: "A particular article of clothing",
  args: {
    id: n.nonNull(n.idArg()),
  },
  async resolve(_, { id }) {
    return db.getArticle(id);
  },
});

export const ArticleInput = n.inputObjectType({
  name: "ArticleInput",
  description: "The details of an article of clothing",
  definition(t) {
    articleDetails(t);
  },
});

export const CreateArticleMutation = n.mutationField("createArticle", {
  type: Article,
  description: "Add an article of clothing to the database",
  args: {
    article: n.nonNull(
      n.arg({
        type: ArticleInput,
        description: "The details of the new article",
      })
    ),
  },
  resolve(_, { article }) {
    return db.addArticle(article);
  },
});

export const Schema = n.makeSchema({
  types: [ArticleQuery, CreateArticleMutation],
});

const gqlHandler = graphqlHTTP({
  schema: Schema,
  graphiql: true,
});

export default gqlHandler;
