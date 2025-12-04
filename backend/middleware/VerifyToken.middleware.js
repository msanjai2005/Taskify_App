import jwt from 'jsonwebtoken';

export const VerifyToken = (req,res,next)=>{
    const token = req.cookies.token;
    if(!token){
        return res.status(401).json({success:false,message:"UnAutherized user - no token available"});
    }
    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        if(!decoded){
            return res.status(401).json({success:false,message:"UnAutherized user - Invalid token"});
        }
        console.log(decoded);
        req.userId = decoded.id;
        next();
    } catch (error) {
        console.log("Error in Verify Token");
        console.log(error.message);
         return res.status(401).json({
            success: false,
            message: "Unauthorized user - invalid token"
        });
    }
}