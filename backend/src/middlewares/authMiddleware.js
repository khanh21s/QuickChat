import jwt from 'jsonwebtoken';
import User from '../models/user.js';

// authorization de xac minh xem user la ai
export const protectedRoute = (req, res, next) => {
    try {
        // lay token tu header
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(" ")[1];
        if(!token){
            return res.status(401).json({message: 'khong tin thay accessToken'});
        }
        // xac nhan token hop le
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decodeUser) => {
            if(err){
                console.error(err);
                return res.status(403).json({message: 'token het han hoac khong dung'});
            }
        // tim user
        const user = await User.findById(decodeUser.userId).select('-hashedPassword');
        // tra user ve trong req
        req.user = user;
        next();
        });

    } catch (error) {
        console.error('loi khi xac minh jwt trong middleware');
        res.status(500).json({message: 'loi he thong'});
    }
}