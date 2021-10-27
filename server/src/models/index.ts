import user, { associate as associateuser } from "./user";
import post, { associate as associatepost } from "./post";
import post_category, { associate as associatepost_category } from "./post_category";
import category, { associate as associatecategory } from "./category";
export * from "./sequelize";
const db = {
  user,
  post,
  post_category,
  category,
};
export type dbType = typeof db;

associateuser(db);
associatepost(db);
associatepost_category(db);
associatecategory(db);
