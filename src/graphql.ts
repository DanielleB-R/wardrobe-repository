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
    t.string("title");
    t.string("color");
    t.string("brand");
    t.field("kind", { type: ArticleKind });
    t.string("size");
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
    t.nonNull.string("title");
    t.nonNull.string("color");
    t.nonNull.string("brand");
    t.nonNull.field("kind", { type: ArticleKind });
    t.nonNull.string("size");
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

export const DeleteArticleResult = n.objectType({
  name: "DeleteArticleResult",
  definition(t) {
    t.nonNull.boolean("deleted");
  },
});

export const DeleteArticleMutation = n.mutationField("deleteArticle", {
  type: DeleteArticleResult,
  args: {
    id: n.nonNull(n.idArg()),
  },
  async resolve(_, { id }) {
    return { deleted: await db.deleteArticle(id) };
  },
});

export const Schema = n.makeSchema({
  types: [ArticleQuery, CreateArticleMutation, DeleteArticleMutation],
});

const gqlHandler = graphqlHTTP({
  schema: Schema,
  graphiql: true,
});

export default gqlHandler;
