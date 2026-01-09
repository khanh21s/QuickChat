import bcrypt from 'bcrypt';
import User from '../models/user.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import Session from '../models/Session.js';

const ACCESS_TOKEN_TTL = '30m';
const REFRESH_TOKEN_TTL = 14 * 24 * 60 * 60 * 1000;

export const signUp = async (req, res) => {
    try {
        const {username, password, email, firstname, lastname} = req.body;
        if(!username || !password || !email || !firstname || !lastname){
            return res.status(400).json({message: "khong the thieu username, password, email, firstname or lastname!"})
        }

    // kiem tra xem user ton tai khong
    const duplicate = await User.findOne({username});
    if(duplicate){
        return res.status(409).json({message: 'username da ton tai'});
    }
    // ma hoa passworld
    const hashPassword = await bcrypt.hash(password, 10);

    // tao user moi
    await User.create({
        username,
        hashPassword,
        email,
        displayName: `${firstname} ${lastname}`
    });

    // return 
    res.status(201).json({ message: "Đăng ký thành công" });

    } catch (error) {
        console.error('loi khi goi signup', error);
        res.status(500).json({message: 'Loi he thong'});
    }
}

export const signIn = async (req, res) => {
    try {
        // lay input
        const {username, password} = req.body;
        if(!username || !password){
            return res.status(400).json({message: 'thieu username hoac password'});
        }

        const user = await User.findOne({username});
        if(!user){
            return res.status(401).json({message: 'username hoac password khong dung'});
        }

        // kiem tra password
        const passwordCorrect = await bcrypt.compare(password, user.hashPassword);
        if(!passwordCorrect){
            return res.status(401).json({message: 'usernname hoac password khong dung'});
        }
        
        // neu khop tao accessToken voi JWT
        const accessToken = jwt.sign({userId: user._id}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: ACCESS_TOKEN_TTL});

        // tao refreshToken
        const refreshToken = crypto.randomBytes(64).toString('hex');

        // tao session moi de luu refreshToken
        await Session.create({
            userId: user._id,
            refreshToken,
            expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL),
        });
        
        // tra refreshToken ve cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: REFRESH_TOKEN_TTL,
        });

        // tra accsessToken ve res
        res.status(200).json({message: `user ${user.displayName} da login, accessToken: ${accessToken}`});
    } catch (error) {
        console.error('loi khi goi signin', error);
        res.status(500).json({message: 'loi he thong'});
    }
}

export const signOut = async (req, res) => {
    try {
        // lay refreshtoken tu cookie
        const token = req.cookie?.refreshToken;
        if(token){
        // xoa refreshtoken trong session
            await Session.deleteOne({refreshToken: token});
        // xoa cookie
            res.clearCookie('refreshToken');
        }
    return res.sendStatus(204);

    } catch (error) {
        console.error('loi khi dang xuat', error);
        res.status(500).json({message: 'loi he thong'});
    }
}