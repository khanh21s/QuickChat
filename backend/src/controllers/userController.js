export const authMe = async (req, res) => {
    try {
        const user = req.user; // lay tu middleweare

        return res.status(200).json({
            user
        });
    } catch (error) {
        console.error('loi khi goi authMe', error);
        return res.status(500).json({ message: 'loi he thong' });
    }
}