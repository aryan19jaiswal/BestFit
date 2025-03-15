import {Job} from "../models/job.model.js";

//POST A JOB
export const postJob = async (req, res) =>
{
    try
    {
        const{title, description, requirements, salary, reqExperience,location, jobType, position, companyId} = req.body;
        const userId = req.id;

        if(!title || !description || !requirements || !salary || !reqExperience || !location || !jobType || !position || !companyId || !companyId)
        {
            return res.status(400).json
            ({
                message: "Provide all required fields",
                success: false
            })
        }

        const job = await Job.create
        ({
            title,
            description,
            requirements: requirements.split(","),
            salary: Number(salary),
            reqExperience:reqExperience,
            location,
            jobType,
            position,
            company: companyId,
            created_by: userId
        })

        return res.status(201).json
        ({
            message: "New Job created successfully",
            job,
            success: true
        })
    }
    catch(err)
    {
        console.error(err);
    }
}

//GET ALL JOBS
export const getAllJobs = async (req, res) =>
{
    try
    {
        const keyword = req.query.keyword || "";

        const query =
            {
                $or: [
                    { title: { $regex: keyword, $options: "i" } },
                    { description: { $regex: keyword, $options: "i" } }, // Fixed field name
                ]
            };

        const jobs = await Job.find(query).populate({path:"company"}).sort({createdAt:-1});
        if(!jobs)
        {
            return res.status(404).json
            ({
                message: "No job found",
                success: false
            })
        }
        return res.status(200).json
        ({
            jobs,
            success: true
        })
    }
    catch (error)
    {
        console.error(error);
    }
}


//GET JOB BY ID
export const getJobById = async (req, res) =>
{
    try
    {
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate({path:"company"});

        if(!job)
        {
            return res.status(404).json
            ({
                message: "No job found with this ID",
                success: false
            })
        }

        return res.status(200).json
        ({
            job,
            success: true
        })
    }
    catch(err)
    {
        console.error(err);
    }
}


//GET JOB CREATED BY THE RECRUITER ITSELF
export const getJobByMe = async (req, res) =>
{
    try
    {
        const userId = req.id;
        const jobs = await Job.find({created_by: userId}).populate({path:"company"});

        if(!jobs)
        {
            return res.status(404).json
            ({
                message: "No job found",
                success: false
            })
        }

        return res.status(200).json
        ({
            jobs,
            success: true
        })
    }
    catch(err)
    {
        console.error(err);
    }
}