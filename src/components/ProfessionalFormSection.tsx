import React from 'react';

const ProfessionalFormSection = ({ handleChange, formData, serviceData }) => {
  const isBusiness = formData.incomeType === 'Business';

  return (
    <div className="space-y-4 border bg-[#E9E5DA] p-4 rounded-lg">
      <h3 className="text-lg font-semibold">Professional and Financial Details :-</h3>

      <div>
        <label>
          Qualification <span className="text-red-600">*</span>
        </label>
        <input
          name="qualification"
          placeholder="e.g. BCOM"
          onChange={handleChange}
          value={formData.qualification || ''}
          className="bg-transparent border-b-2 border-[#252C3D] w-full outline-0"
          required
        />
      </div>

      <div>
        <label>
          Profession <span className="text-red-600">*</span>
        </label>
        <input
          name="profession"
          placeholder="e.g. Doctor"
          onChange={handleChange}
          value={formData.profession || ''}
          className="bg-transparent border-b-2 border-[#252C3D] w-full outline-0"
          required
        />
      </div>

      <div>
        <label>
          Employment Type <span className="text-red-600">*</span>
        </label>
        <select
          name="incomeType"
          onChange={handleChange}
          value={formData.incomeType || ''}
          className="bg-transparent border-b-2 border-[#252C3D] w-full outline-0"
          required
        >
          <option value="">Select Income Type</option>
          <option value="Salaried">Salaried</option>
          <option value="Business">Business</option>
        </select>
      </div>

      {formData.incomeType === 'Business' && (
        <>
          <div>
            <label>
              Nature of Business <span className="text-red-600">*</span>
            </label>
            <input
              name="natureOfBusiness"
              placeholder="Nature of Business"
              onChange={handleChange}
              value={formData.natureOfBusiness || ''}
              className="bg-transparent border-b-2 border-[#252C3D] w-full outline-0"
              required
            />
          </div>
          <div>
            <label>
              Office Address <span className="text-red-600">*</span>
            </label>
            <input
              name="officeAddress"
              placeholder="Office Address"
              onChange={handleChange}
              value={formData.officeAddress || ''}
              className="bg-transparent border-b-2 border-[#252C3D] w-full outline-0"
              required
            />
          </div>
          <div>
            <label>
              Office Contact <span className="text-red-600">*</span>
            </label>
            <input
              name="officeContact"
              placeholder="Office Contact No"
              onChange={handleChange}
              value={formData.officeContact || ''}
              className="bg-transparent border-b-2 border-[#252C3D] w-full outline-0"
              required
            />
          </div>
          <div>
            <label>
              Official Email / HR ID <span className="text-red-600">*</span>
            </label>
            <input
              name="officialEmail"
              placeholder="Official Email / HR ID"
              onChange={handleChange}
              value={formData.officialEmail || ''}
              className="bg-transparent border-b-2 border-[#252C3D] w-full outline-0"
              required
            />
          </div>
        </>
      )}

      {(serviceData.type === '1' || serviceData.type === 1) && (
        <>
          <div>
            <label>
              Purchase Cost / Market Value <span className="text-red-600">*</span>
            </label>
            <input
              name="purchaseCost"
              onChange={handleChange}
              value={formData.purchaseCost || ''}
              className="bg-transparent border-b-2 border-[#252C3D] w-full outline-0"
              required
            />
          </div>
          <div>
            <label>
              Existing Loans <span className="text-red-600">*</span>
            </label>
            <input
              name="existingLoans"
              placeholder=""
              onChange={handleChange}
              value={formData.existingLoans || ''}
              className="bg-transparent border-b-2 border-[#252C3D] w-full outline-0"
              required
            />
          </div>
          <div>
            <label>
              New Loan Amount Required <span className="text-red-600">*</span>
            </label>
            <input
              name="newLoanAmount"
              placeholder="e.g. 1000000"
              onChange={handleChange}
              value={formData.newLoanAmount || ''}
              className="bg-transparent border-b-2 border-[#252C3D] w-full outline-0"
              required
            />
          </div>
        </>
      )}

      {(serviceData.type === '2' || serviceData.type === 2) && (
        <>
          <div>
            <label>
              Insurance Plan <span className="text-red-600">*</span>
            </label>
            <input
              name="insuranceplan"
              placeholder="e.g. Family Floater"
              onChange={handleChange}
              value={formData.insuranceplan || ''}
              className="bg-transparent border-b-2 border-[#252C3D] w-full outline-0"
              required
            />
          </div>
          <div>
            <label>
              Sum Insured Required <span className="text-red-600">*</span>
            </label>
            <input
              name="suminsured"
              placeholder="e.g. 1000000"
              onChange={handleChange}
              value={formData.suminsured || ''}
              className="bg-transparent border-b-2 border-[#252C3D] w-full outline-0"
              required
            />
          </div>
        </>
      )}

      {(serviceData.type === '3' || serviceData.type === 3) && (
        <>
          <div>
            <label>
              Investment Fund <span className="text-red-600">*</span>
            </label>
            <input
              name="investmentfund"
              placeholder="e.g. Equity, Balance, Multi Asset Fund"
              onChange={handleChange}
              value={formData.investmentfund || ''}
              className="bg-transparent border-b-2 border-[#252C3D] w-full outline-0"
              required
            />
          </div>
          <div>
            <label>
              Investment Amount <span className="text-red-600">*</span>
            </label>
            <input
              name="investmentamt"
              placeholder="e.g. 1000000"
              onChange={handleChange}
              value={formData.investmentamt || ''}
              className="bg-transparent border-b-2 border-[#252C3D] w-full outline-0"
              required
            />
          </div>
        </>
      )}

      <div>
        <label>
          Savings / Net Worth <span className="text-red-600">*</span>
        </label>
        <input
          name="savings"
          placeholder="e.g. 1000000"
          onChange={handleChange}
          value={formData.savings || ''}
          className="bg-transparent border-b-2 border-[#252C3D] w-full outline-0"
          required
        />
      </div>
    </div>
  );
};

export default ProfessionalFormSection;