import React, { useState, useEffect, useCallback } from "react";
import Cookie from "js-cookie";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import ToastContainerComponent from "@/components/ToastContainerComponent";
import ContactFormSection from "@/components/ContactFormSection";
import ProfessionalFormSection from "@/components/ProfessionalFormSection";
import DocumentFormSection from "@/components/DocumentFormSection";

const Applicationform = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const cookie = Cookie.get("finvest");
  const emailcookie = cookie ? cookie.split("$")[0] : "";
  const navigate = useNavigate();
  const location = useLocation();
  const [serviceData, setServiceData] = useState({ type: "", servicename: "" });
  const [applicationId, setApplicationId] = useState("");
  const [customer_id, setCustomerId] = useState("");
  const [isAgreed, setIsAgreed] = useState(false);
  const [adminrank, setAdminRank] = useState("");
  const [apply, setApply] = useState("false");


  const [formData, setFormData] = useState({
    email: "",
    mobile: "",
    altMobile: "",
    city: "",
    currentAddress: "",
    permanentAddress: "",
    sameAsCurrent: false,
    residenceType: "",
    qualification: "",
    profession: "",
    incomeType: "",
    natureOfBusiness: "",
    officeAddress: "",
    officeContact: "",
    officialEmail : "",
    purchaseCost: "",
    savings: "",
    existingLoans: "",
    newLoanAmount: "",
    insuranceplan: "",
    suminsured: "",
    investmentfund: "",
    investmentamt: "",
    photo: "",
    pancard: "",
    aadharcard: "",
    passport: "",
    visa: "",
    cdc: "",
    rentagreement: "",
    salaryslip: "",
    bankstatement: "",
    form16: "",
    itr: "",
    saleagreement: "",
    sharecertificate: "",
    electricitybill: "",
    maintenancebill: "",
    housetaxbill: "",
    noc: "",
    marraigecertificate: "",
    birthcertificate: "",
    qualificationcertificate: "",
    location: "Mumbai",
  });

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const type = searchParams.get("type");
    const servicename = searchParams.get("servicename");
    const applicationId = searchParams.get("applicationId");
    const customerId = searchParams.get("customerId");
    const apply = searchParams.get("apply");
    const rank = localStorage.getItem("rank");

    if (type && servicename) {
      setServiceData({ type, servicename });
    }
    if (applicationId) {
      setApplicationId(applicationId);
    }
    if (customerId) {
      setCustomerId(customerId);
    }
    if(apply){
      setApply(apply);
    }
    if (rank) {
      //@ts-expect-error err
      if (rank == 4 || rank == "4") {
        setCurrentStep(2);
        setAdminRank(rank);
      }
    }
  }, [location.search]);

  useEffect(() => {
    if (formData.sameAsCurrent) {
      setFormData((prev) => ({
        ...prev,
        permanentAddress: prev.currentAddress,
      }));
    }
  }, [formData.sameAsCurrent, formData.currentAddress]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const loadData = useCallback(async () => {
    try {
      setFetching(true);
      let response;
      if (!emailcookie && !customer_id) {
        return;
      }
      if (customer_id === "") {
        response = await axios.get(
          `${import.meta.env.VITE_API_URI}getsinglecustomer`,
          { params: { email: emailcookie } }
        );
      } else {
        response = await axios.get(
          `${import.meta.env.VITE_API_URI}getsinglecustomer`,
          { params: { customer_id: customer_id } }
        );
      }

      const payload = response.data.payload;

    

      if (payload) {
        const updatedFormData = { ...formData };
        for (const key in payload) {
          if (payload[key] !== null && payload[key] !== "") {
            updatedFormData[key] = payload[key];
          }
        }
        setFormData(updatedFormData);
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    } finally {
      setFetching(false);
    }
  }, [emailcookie, customer_id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const LeftArrowIcon = () => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={20}
        fill="#676666"
        viewBox="0 0 448 512"
      >
        <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" />
      </svg>
    );
  };

  const calculatePayloadSize = (textPayload: any, imageFields: string[], formData: any): number => {
    // Calculate text payload size
    const textSize = new TextEncoder().encode(JSON.stringify(textPayload)).length;

    // Calculate image sizes
    const imageSize = imageFields.reduce((total, field) => {
      const value = formData[field];
      if (!value) return total;

      // Handle object with content property
      if (typeof value === 'object' && value.content) {
        return total + (value.content.length * 0.75); // Approximate base64 to bytes
      }

      // Handle direct base64 string
      if (typeof value === 'string') {
        if (value.startsWith('data:')) {
          const base64Data = value.split(',')[1] || '';
          return total + (base64Data.length * 0.75); // Approximate base64 to bytes
        }
        return total + value.length; // Fallback for regular strings
      }

      return total;
    }, 0);

    return textSize + imageSize;
  };

  const saveData = async (e) => {
    e.preventDefault();
    try {
      const missingFields = [];

      if (currentStep == 1) {
        if (formData.city === "") missingFields.push("City");
        if (formData.currentAddress === "")
          missingFields.push("Current Address");
        if (formData.permanentAddress === "")
          missingFields.push("Permanent Address");
      } else {
        if (formData.city === "") missingFields.push("City");
        if (formData.currentAddress === "")
          missingFields.push("Current Address");
        if (formData.permanentAddress === "")
          missingFields.push("Permanent Address");
        if (formData.qualification === "") missingFields.push("Qualification");
        if (formData.profession === "") missingFields.push("Profession");
        if (formData.incomeType === "") missingFields.push("Employment Type");

        if(formData.incomeType === "Business"){
          if(formData.natureOfBusiness === ""){
            missingFields.push("Nature Of Business");
          }
          if(formData.officeAddress === ""){
            missingFields.push("Office Address");
          }
          if(formData.officeContact === ""){
            missingFields.push("Office Contact");
          }
          if(formData.officialEmail === ""){
            missingFields.push("Official Email");
          }
        }

        if (serviceData.type == "1") {
          if (formData.purchaseCost === "") missingFields.push("Purchase Cost");
          if (formData.existingLoans === "")
            missingFields.push("Existing Loans");
          if (formData.newLoanAmount === "")
            missingFields.push("New Loan Amount Required");
        }
        if (serviceData.type == "2") {
          if (formData.insuranceplan === "")
            missingFields.push("Insurance Plan");
          if (formData.suminsured === "") missingFields.push("Sum Insured");
        }
        if (serviceData.type == "3") {
          if (formData.investmentfund === "")
            missingFields.push("Investment Fund");
          if (formData.investmentamt === "")
            missingFields.push("Investment Amount");
        }
        if (formData.savings === "") missingFields.push("Savings / Net Worth");

        if (missingFields.length > 0) {
          toast.error(
            `Following fields are missing: ${missingFields.join(", ")}`
          );
          return false;
        }
      }

      setLoading(true);
      const form = new FormData();
      const textPayload: Record<string, any> = {};
      const imageFields: string[] = [];

      for (const key in formData) {
        const val = formData[key];
        // Exclude file-like fields from payload; send them as files instead
        if (typeof val === "object" && val && val.content && val.type) {
          imageFields.push(key);
        } else if (typeof val === "string" && val.startsWith("data:")) {
          // legacy base64 string
          imageFields.push(key);
        } else {
          textPayload[key] = val;
        }
      }

      textPayload.servicename = serviceData.servicename;
      if (applicationId) {
        textPayload.applicationId = applicationId;
      }

      // Calculate total payload size
      const totalSize = calculatePayloadSize(
        textPayload,
        imageFields,
        formData
      );
      const maxSize = 3.9 * 1024 * 1024; // 3.9 MB in bytes
      if (totalSize > maxSize) {
        toast.error("Payload size exceeds 3.9 MB. Please remove some  files.");
        return false;
      }

      form.append("payload", JSON.stringify(textPayload));

      const base64ToFile = (base64String, filename) => {
        const arr = base64String.split(",");
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) u8arr[n] = bstr.charCodeAt(n);
        return new File([u8arr], filename, { type: mime });
      };

      imageFields.forEach((field) => {
        const v = formData[field];
        const base64 = typeof v === "object" && v.content ? v.content : v;
        const fallbackName = typeof v === "object" && v.name ? v.name : `${field}.jpg`;
        const file = base64ToFile(base64, fallbackName);
        form.append(field, file);
      });

      const response = await axios.post(
        `${import.meta.env.VITE_API_URI}savecustomer`,
        form,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.status !== 200) {
        toast.error(response.data.message);
        return false;
      }

      toast.success(response.data.message);
      return true;
    } catch (error) {
      console.error("Error saving multipart form data:", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(error.response.data.message);
      } else {
        if (error.response && error.response.status === 413) {
          toast.error("Uploading Capacity Exceeded");
        } else {
          toast.error("Something Went Wrong");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const form = new FormData();
      const textPayload: Record<string, any> = {};
      const imageFields: string[] = [];

      for (const key in formData) {
        const val = formData[key];
        if (typeof val === "object" && val && val.content && val.type) {
          imageFields.push(key);
        } else if (typeof val === "string" && val.startsWith("data:")) {
          imageFields.push(key);
        } else {
          textPayload[key] = val;
        }
      }

      textPayload.servicename = serviceData.servicename;
      textPayload.servicetype = serviceData.type;

      form.append("payload", JSON.stringify(textPayload));

      const base64ToFile = (base64String, filename) => {
        const arr = base64String.split(",");
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) u8arr[n] = bstr.charCodeAt(n);
        return new File([u8arr], filename, { type: mime });
      };

      imageFields.forEach((field) => {
        const v = formData[field];
        const base64 = typeof v === "object" && v.content ? v.content : v;
        const fallbackName = typeof v === "object" && v.name ? v.name : `${field}.jpg`;
        const file = base64ToFile(base64, fallbackName);
        form.append(field, file);
      });

      const response = await axios.post(
        `${import.meta.env.VITE_API_URI}createapplication`,
        form,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.status !== 200) {
        toast.error(response.data.message);
        return;
      }

      toast.success(response.data.message);
      navigate("/customerdashboard");
    } catch (error) {
      console.error("Error saving multipart form data:", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(error.response.data.message);
      } else {
        if (error.response && error.response.status === 413) {
          toast.error("Uploading Capacity Exceeded");
        } else {
          toast.error("Something Went Wrong");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async (e) => {
    const success = await saveData(e);
    if (success) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    setCurrentStep((prev) => prev - 1);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-[#EBECEC] min-h-screen">
      <ToastContainerComponent />
      {fetching && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10">
          <div className="flex items-center gap-3 bg-white px-4 py-3 rounded shadow">
            <svg className="w-6 h-6 animate-spin text-blue-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
            </svg>
            <span className="text-sm text-gray-700">Loading your details...</span>
          </div>
        </div>
      )}
      <nav
        className="flex items-center gap-2"
        onClick={() => navigate("/customerdashboard")}
      >
        <LeftArrowIcon />
        <h1 className="text-lg">Back to Dashboard</h1>
      </nav>
      <div className="mt-6">
        <form className="space-y-6">
          {currentStep === 1 && !adminrank && (
            <ContactFormSection
              handleChange={handleChange}
              formData={formData}
              serviceData={serviceData}
            />
          )}
          {currentStep === 2 && (
            <ProfessionalFormSection
              handleChange={handleChange}
              formData={formData}
              serviceData={serviceData}
            />
          )}
          {currentStep === 3 && (
            <DocumentFormSection
              handleChange={handleChange}
              formData={formData}
              setIsAgreed={setIsAgreed}
              isAgreed={isAgreed}
            />
          )}
          {!adminrank && (
            <div className="flex justify-between mt-6">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handlePrev}
                  className="bg-blue-800 text-[#fff] px-4 py-2 rounded"
                >
                  Previous
                </button>
              )}
              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={(e) => handleNext(e)}
                  className="bg-blue-800 text-white px-4 py-2 rounded"
                >
                  {loading ? "Saving..." : "Next"}
                </button>
              ) : (
                <button
                  type="submit"
                  onClick={(e) => saveData(e)}
                  className="bg-blue-800 text-white px-4 py-2 rounded"
                >
                  {loading ? "Saving..." : "Finish"}
                </button>
              )}
            </div>
          )}
          {adminrank && (
            <div className="flex justify-between mt-6">
              {currentStep > 2 && (
                <button
                  type="button"
                  onClick={handlePrev}
                  className="bg-blue-800 text-[#fff] px-4 py-2 rounded"
                >
                  Previous
                </button>
              )}
              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={(e) => handleNext(e)}
                  className="bg-blue-800 text-white px-4 py-2 rounded"
                >
                  {loading ? "Saving..." : "Next"}
                </button>
              ) : (
                <button
                  type="submit"
                  onClick={(e) => saveData(e)}
                  className="bg-blue-800 text-white px-4 py-2 rounded"
                >
                  {loading ? "Saving..." : "Finish"}
                </button>
              )}
            </div>
          )}
        </form>
        {currentStep === 3 && customer_id == "" && apply == "true" && (
          <button
            onClick={(e) => {
              handleApply(e);
            }}
            disabled={!isAgreed}
            className={`${
              isAgreed ? "bg-blue-800 animate-pop" : "bg-gray-500"
            } rounded-md py-2 text-white w-full mt-2 transition-all duration-200`}
            style={{
              animation: isAgreed ? "pop 1.5s ease-in-out infinite" : "none",
            }}
          >
            Apply
          </button>
        )}

        <style>{`
          @keyframes pop {
            0%,
            100% {
              transform: scale(1);
            }
            25% {
              transform: scale(1.03);
            }
            50% {
              transform: scale(1.02);
            }
            75% {
              transform: scale(1.04);
            }
          }

          .animate-pop {
            animation: pop 1.5s ease-in-out infinite;
          }
        `}</style>
      </div>
    </div>
  );
};

export default Applicationform;
