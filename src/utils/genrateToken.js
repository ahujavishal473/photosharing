import jwt from 'jsonwebtoken'

export const genrateAccessToken=(userId)=>{
    return jwt.sign(
        {
            id:userId       
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRES
        }

    )
}
export const genrateRefreshToken=(userId)=>{
    return jwt.sign(
        {
            id:userId
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.RFEFRESH_TOKEN_EXPIRES
        }
    )
}