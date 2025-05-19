const PersonalFormSection = ({ handleChange, formData , handleSubmit}) => {
  return (
    <form className="space-y-4 mt-[5vh] bg-[#E9E5DA] p-4 rounded-lg">
      <h3 className="text-lg font-semibold">Personal Details </h3>
      <div>
        <label>
          Full Name <span className="text-red-600">*</span>
        </label>
        <input
          name="fullName"
          placeholder="e.g. Dilip Kumar Singh"
          onChange={handleChange}
          value={formData.fullName}
          className="bg-transparent border-b-2 border-[#252C3D] w-full outine-0"
          required
        />
      </div>
      <div>
        <label>
          PAN CARD 
        </label>
        <input
          name="panNumber"
          placeholder="e.g. FHLLPXXXXR"
          onChange={handleChange}
          value={formData.panNumber}
          className="bg-transparent border-b-2 border-[#252C3D] w-full outline-0"
          required

        />
      </div>

      <div>
        <label>
          AADHAAR CARD <span className="text-red-600">*</span>
        </label>
        <input
          name="aadhaarNumber"
          placeholder="e.g. 2345XXXX7654"
          onChange={handleChange}
          value={formData.aadharNumber}
          className="bg-transparent border-b-2 border-[#252C3D] w-full outline-0"
          required

        />
      </div>

      <div>
        <label>
          Father's Name
        </label>
        <input
          name="fatherName"
          placeholder="e.g. Mangal Kumar Singh"
          onChange={handleChange}
          value={formData.fatherName}
          className="bg-transparent border-b-2 border-[#252C3D] w-full outline-0"
        />
      </div>

      <div>
        <label>
          Mother's Name 
        </label>
        <input
          name="motherName"
          placeholder="Mother's Name"
          onChange={handleChange}
          value={formData.motherName}
          className="bg-transparent border-b-2 border-[#252C3D] w-full outline-0"
        />
      </div>

      <div>
        <label>
          Date of Birth <span className="text-red-600">*</span>
        </label>

        <input
          name="dob"
          type="date"
          onChange={handleChange}
          value={formData.dob}
          className="bg-transparent border-b-2 border-[#252C3D] w-full outline-0"
          required
        />
      </div>

      <button className="bg-[#252C3D] px-4 py-2 rounded-md text-[#fff]" onClick={handleSubmit}>Submit</button>
    </form>
  );
};

export default PersonalFormSection;
