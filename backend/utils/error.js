export const error = (res, statusCode, message) => {
    res.status(statusCode).json({success: false, message})
}