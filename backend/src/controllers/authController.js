import bcrypt from 'bcrypt';
import User from '../models/user.js';



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