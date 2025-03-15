import {Company} from "../models/company.model.js";

//REGISTER COMPANY
export const registerCompany = async (req, res) =>
{
    try
    {
        const { companyName, location } = req.body;

        if (!companyName)
        {
            return res.status(400).json
            ({
                message: "Company Name is required",
                success: false
            });
        }

        if (!location)
        {
            return res.status(400).json
            ({
                message: "Company Location is required",
                success: false
            });
        }

        // Check if company already exists
        let company = await Company.findOne({ name: companyName });
        if (company) {
            return res.status(400).json
            ({
                message: "Company Name is already registered",
                success: false
            });
        }

        // Create company
        company = await Company.create
        ({
            name: companyName,
            location: location,  // Ensure location is included
            userId: req.id
        });

        return res.status(201).json
        ({
            message: "Company registered successfully",
            company,
            success: true
        });

    }
    catch (error)
    {
        console.error("Error:", error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message, success: false });
    }
};


//GET COMPANY
export const getCompany = async (req, res) =>
{
    try
    {
        const userId = req.id; //logged-in user
        const companies = await Company.find({userId: userId});
        if (!companies)
        {
            return res.status(400).json
            ({
                message: "Did not find any company",
                success: false
            })
        }

        return res.status(200).json
        ({
            companies,
            success: true
        });
    }
    catch (error)
    {
        console.log(error);
    }
}


//GET COMPANY BY ID
export const getCompanyById = async (req, res) =>
{
    try
    {
        const companyId = req.params.id;
        const company = await Company.findById(companyId);
        if (!company)
        {
            return res.status(400).json
            ({
                message:"Company not found",
                success:false
            })
        }

        return res.status(200).json
        ({
            company,
            success:true
        })
    }
    catch (error)
    {
        console.log(error);
    }
}


//UPDATE COMPANY
export const updateCompany = async (req, res) =>
{
    try
    {
        const{name, description, website, location} = req.body;
        const file=req.file;
        //here cloudinary will come

        const updateData = {name, description, website, location};

        const company = await Company.findByIdAndUpdate(req.params.id, updateData, {new:true});

        if(!company)
        {
            return res.status(404).json
            ({
                message:"Company not found",
                success:false
            })
        }

        return res.status(200).json
        ({
            message: "Company Information updated",
            success:true
        })
    }
    catch (error)
    {
        console.log(error);
    }
}