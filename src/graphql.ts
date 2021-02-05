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
    t.id("id");
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
  resolve(_, { id }) {
    return db.getArticle(id);
  },
});

export const Schema = n.makeSchema({
  types: [ArticleQuery],
});

const gqlHandler = graphqlHTTP({
  schema: Schema,
  graphiql: true,
});

export default gqlHandler;
