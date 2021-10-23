import { Request, Response } from "express";
import post from "../../models/post";
import Sequelize from "sequelize";
const { or, and, gt, lt } = Sequelize.Op;

const get = async (req: Request, res: Response) => {
  try {
    const id = req.params;
    const poster = await post.findAll({
      where: { id: { [gt]: id } },
      order: ["createdAt", "ASC"],
      limit: 4,
    });

    res.status(200).send({ data: poster });
  } catch (err) {
    console.log("err");
  }
};
export default get;
