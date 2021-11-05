import { Request, Response } from "express";
import user from "../../models/user";
import axios from "axios";
import * as dotenv from "dotenv";
const jwt = require("jsonwebtoken");
dotenv.config();

const kakaoLogin = async (req: Request, res: Response) => {
  const code = req.query.code;
  try {
    const result: any = await axios.post(
      `https://kauth.kakao.com/oauth/token?grant_type=authorization_code&client_id=${process.env.KAKAO_REST_API_KEY}&redirect_uri=${process.env.KAKAO_REDIRECT_URI}&code=${code}`,
    );

    const KakkoAccessToken = result.data.code;

    const userInfo: any = await axios.get(`https://kapi.kakao.com/v2/user/me`, {
      headers: {
        Authorization: `Bearer ${KakkoAccessToken}`,
      },
    });

    const [findUser, exist] = await user.findOrCreate({
      where: {
        email: userInfo.data.account_email,
      },
      defaults: {
        nickname: userInfo.data.profile_nickname,
        email: userInfo.data.account_email,
        imagePath: userInfo.data.profile_image,
        password: userInfo.data.id,
        salt: userInfo.data.id,
        loginType: true,
      },
    });

    const payload = {
      id: findUser.id,
      email: findUser.email,
      nickname: findUser.nickname,
      userArea: findUser.userArea,
      imagePath: findUser.imagePath,
      loginType: true,
    };

    const accessToken = await jwt.sign(payload, process.env.ACCESS_SECRET, {
      expiresIn: "12h",
    });
    const refreshToken = await jwt.sign(payload, process.env.REFRESH_SECRET, {
      expiresIn: "50d",
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "none",
    });

    return res.status(200).json({
      accessToken,
      id: findUser.id,
      message: "소셜 로그인에 성공하였습니다.",
    });
  } catch (error) {
    console.error(error);
    return res.status(501).json({ message: "서버에러 입니다." });
  }
};

export default kakaoLogin;