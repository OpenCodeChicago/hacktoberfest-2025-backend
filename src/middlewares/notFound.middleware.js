import express from 'express'

const notFound = (req,res,next) =>{
    res.status(404).json(
        {
        success: false,
        message: "Route not found"
        }
    )
}

export default notFound;