import bcrypt from 'bcrypt';
import User from '../models/user';



export const singUp = async (req, res) => {
    try {
        const {username, passworld, email, firtname, lastname} = req.body;
        if(!username || !passworld || !email || !firtname || !lastname){
            return res.status(400).json({message: "khong the thieu username, passworld, email, firtname or lastname!"})
        }

    // kiem tra xem user ton tai khong
    const duplicate = await User.findOne({username});
    if(duplicate){
        res.status(409).json({message: 'username da ton tai'});
    }
    // ma hoa passworld
    const hassedPassword = await bcrypt.hash(passworld, 10);

    // tao user moi

    // return 

    } catch (error) {
        
    }
}