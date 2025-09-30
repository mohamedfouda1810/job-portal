const fs = require('fs');
const path = require('path')
const User = require('../model/User')


// @desc   Update user Profile (name,avatar,commpany details )
exports.updateProfile = async (req, res) => {
    try {

        const { name, avatar, resume, companyName, companyDescription, companyLogo } = req.body;
        
        const user = await User.findById(req.user._id);
       if(!user) return    res.status(404).json({ message: "User Not Found "});
      
        
        user.name = name || user.name;
        user.avatar = avatar || user.avatar;
        user.resume = resume || user.resume;

        // if User is Enmployer that can update the company Details 
        if (user.role === 'employer') {
            user.companyName = companyName || user.companyName;
            user.companyDescription = companyDescription || user.companyDescription;
            user.companyLogo = companyLogo || user.companyLogo;
        }
        await user.save();
        res.json({
            _id: user._id,
            name: user.name,
            avatar: user.avatar,
              resume: user.resume,
            role: user.role,
            companyName: user.companyName,
            companyDescription: user.companyDescription,
            companyLogo: user.companyLogo,
        });

           
                    
    } catch (error) {
        res.status(500).json({ message: error.message });

    }

}

// @desc   Delete Resume file (JobSeeker Only )
exports.deleteResume = async (req, res) => {
    try {
        const { resumeUrl } = req.body;

        console.log('Delete resume request:', {
            userId: req.user._id,
            resumeUrl: resumeUrl
        });

        if (!resumeUrl) {
            return res.status(400).json({ message: "Resume URL is required" });
        }

        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: "User Not Found" });
        }

        if (user.role !== 'jobseeker') {
            return res.status(403).json({ message: "Only job seekers can delete resume" });
        }

        // Extract file name from URL
        const fileName = resumeUrl.split('/').pop();
        
        if (fileName) {
            const filePath = path.join(__dirname, '../uploads', fileName);
            console.log('Attempting to delete file:', filePath);
            
            // Check if file exists and delete it
            if (fs.existsSync(filePath)) {
                try {
                    fs.unlinkSync(filePath);
                    console.log('File deleted successfully:', fileName);
                } catch (fileError) {
                    console.error('Error deleting file:', fileError);
                    // Continue even if file deletion fails
                }
            } else {
                console.log('File not found on server:', filePath);
            }
        }

        // Clear user's resume field
        user.resume = '';
        await user.save();

        console.log('Resume field cleared for user:', user._id);

        res.json({ 
            message: 'Resume deleted successfully',
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                resume: user.resume,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Delete resume error:', error);
        res.status(500).json({ message: error.message });
    }
};


// @desc     Get user public Profile
exports.getPublicProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password')
             if(!user) return    res.status(404).json({ message: "User Not Found "});

        res.json(user);

    } catch (error) {
        res.status(500).json({ message: error.message });
        
    }
}