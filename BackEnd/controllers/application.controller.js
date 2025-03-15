import {Application} from "../models/application.model.js";
import {Job} from "../models/job.model.js";


// APPLY FOR A JOB
export const applyJob = async (req, res) =>
{
    try
    {
        const userId = req.id;
        const jobId = req.params.id;

        if (!jobId)
        {
            return res.status(400).json
            ({
                message: "Job ID is required",
                success: false
            });
        }

        // Check if user has already applied for the job
        const existingApplication = await Application.findOne
        ({ job: jobId, applicant: userId });

        if (existingApplication)
        {
            return res.status(400).json
            ({
                message: "You have already applied for this job",
                success: false
            });
        }

        // Check if job exists
        const job = await Job.findById(jobId);
        if (!job)
        {
            return res.status(404).json
            ({
                message: "Job not found",
                success: false
            });
        }

        // Create a new application
        const newApplication = await Application.create
        ({
            job: jobId,
            applicant: userId
        });

        // ✅ Ensure `applications` is updated correctly using $push
        await Job.findByIdAndUpdate
        (
            jobId,
            { $push: { applications: newApplication._id } }, // ✅ Better way to update
            { new: true }
        );

        return res.status(201).json
        ({
            message: "You have successfully applied for this job",
            success: true
        });

    }
    catch (err)
    {
        console.error("Error in applyJob:", err);
        return res.status(500).json
        ({
            message: "Internal Server Error",
            error: err.message,
            success: false
        });
    }
};


//GET APPLIED JOBS
export const getAppliedjobs = async (req, res) =>
{
    try
    {
        const userId = req.id; // Logged-in user ID

        // ✅ Await the query before calling populate()
        const appliedJobs = await Application.find({ applicant: userId }).populate("job");

        if (!appliedJobs || appliedJobs.length === 0)
        {
            return res.status(404).json
            ({
                message: "No applied jobs found",
                success: false
            });
        }

        return res.status(200).json
        ({
            appliedJobs,
            success: true
        });
    }
    catch (error)
    {
        console.error("Error fetching applied jobs:", error);
        return res.status(500).json
        ({
            message: "Internal Server Error",
            success: false
        });
    }
};



//GET APPLICANTS : recruiter can see how many applicants have applied for their job
export const getApplicants = async (req, res) =>
{
    try
    {
        const jobId = req.params.id;

        // ✅ Populate applications array and the applicant inside each application
        const job = await Job.findById(jobId).populate
        ({
            path: 'applications',
            options: { sort: { createdAt: -1 } },
            populate: { path: 'applicant', select: 'name email' } // Select only necessary fields
        });

        if (!job)
        {
            return res.status(404).json
            ({
                message: "Job not found",
                success: false
            });
        }

        return res.status(200).json
        ({
            applicants: job.applications, // Only return applicants
            success: true
        });

    }
    catch (err)
    {
        console.error("Error fetching applicants:", err);
        return res.status(500).json
        ({
            message: "Internal Server Error",
            success: false
        });
    }
};


//UPDATE STATUS OF JOB APPLICATION
export const updateStatus = async (req, res) =>
{
    try
    {
        const { status } = req.body;
        const applicationId = req.params.id;

        if (!status)
        {
            return res.status(400).json
            ({
                message: "Status is required",
                success: false
            });
        }

        // Find the application by its ID
        const application = await Application.findById(applicationId);
        if (!application)
        {
            return res.status(404).json
            ({
                message: "Application not found",
                success: false
            });
        }

        // Update the status
        application.status = status.toLowerCase();
        await application.save();

        return res.status(200).json
        ({
            message: "Status updated successfully",
            success: true
        });
    }
    catch (err)
    {
        console.error("Error updating status:", err);
        return res.status(500).json
        ({
            message: "Internal Server Error",
            success: false
        });
    }
};
