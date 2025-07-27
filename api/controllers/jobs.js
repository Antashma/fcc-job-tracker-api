const Job = require("../models/Job");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors")



const getAllJobs = async (req, res) => {
    const jobs = await Job.find({createdBy: req.user.userId}).sort("createdAt");
    res.status(StatusCodes.OK).json({ count: jobs.length, jobs });
}

const getJob = async (req, res) => {
    const { user: { userId }, params: { id: jobId } } = req;
    const job = await Job.findOne({createdBy: userId, _id: jobId});
    if (!job) throw new NotFoundError("Job not found!");
    res.status(StatusCodes.OK).json({ job });
}

const createJob = async (req, res) => {
    req.body.createdBy = req.user.userId; 
    const job = await Job.create(req.body);
    res.status(StatusCodes.CREATED).json(job);
}

const updateJob = async (req, res) => {
   const { 
    body: { company, position},
    user: { userId }, 
    params: { id: jobId } 
    } = req;

    if (company === "" || position === "") {
        throw new BadRequestError("Company or position cannot be empty fields.")
    }

    const job = await Job.findByIdAndUpdate(
        {createdBy: userId, _id: jobId}, 
        req.body, 
        {new: true, runValidators: true}
    );

    if (!job) {
        throw new NotFoundError(`Job with ${jobId} not found!`)
    }

    res.status(StatusCodes.OK).json({job})
}

const deleteJob = async (req, res) => {
    const {
        params: { id: jobId },
        user: { userId }
    } = req

    const job = await Job.findByIdAndRemove({
        createdBy: userId,
        _id: jobId
    })

    if (!job) throw new NotFoundError(`Job with ${jobId} not found!`);

    res.status(StatusCodes.OK).send();
}



module.exports = {
    getAllJobs,
    getJob,
    createJob,
    updateJob,
    deleteJob
}