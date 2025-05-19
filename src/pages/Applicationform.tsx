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
  const cookie = Cookie.get("finvest");
  const emailcookie = cookie ? cookie.split("$")[0] : "";
  const navigate = useNavigate();
  const location = useLocation();
  const [serviceData, setServiceData] = useState({ type: "", servicename: "" });
  const [applicationId, setApplicationId] = useState("");
  const [customer_id, setCustomerId] = useState("");

  const [update, setUpdate] = useState("");

  const [formData, setFormData] = useState({
    mobile: "",
    altMobile: "",
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
    officialEmail: "",
    purchaseCost: "",
    savings: "",
    existingLoans: "",
    newLoanAmount: "",
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
  });

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const type = searchParams.get("type");
    const servicename = searchParams.get("servicename");
    const applicationId = searchParams.get("applicationId");
    const customerId = searchParams.get("customerId");

    const update = searchParams.get("update");

    if (type && servicename) {
      setServiceData({ type, servicename });
    }
    if (applicationId) {
      setApplicationId(applicationId);
    }
    if (update) {
      setUpdate(update);
    }
    if (customerId) {
      setCustomerId(customerId);
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
      let response;
      if (customer_id == "") {
        response = await axios.get(
          `${import.meta.env.VITE_API_URI}getsinglecustomer`,
          { params: { email: emailcookie } }
        );
      } else {
        response = await axios.get(
          `${import.meta.env.VITE_API_URI}getsinglecustomer`,
          { params: { email: emailcookie } }
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
    }
  }, [emailcookie]);

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

  const saveData = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const form = new FormData();
      const textPayload = {};

      for (const key in formData) {
        if (
          typeof formData[key] === "string" &&
          !formData[key].startsWith("data:image")
        ) {
          textPayload[key] = formData[key];
        } else if (typeof formData[key] !== "string") {
          textPayload[key] = formData[key]; // Include non-string fields like booleans
        }
      }

      // @ts-expect-error err
      textPayload.email = emailcookie;
      // @ts-expect-error err
      textPayload.servicename = serviceData.servicename;
      if (applicationId) {
        // @ts-expect-error err
        textPayload.applicationId = applicationId;
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

      const imageFields = Object.keys(formData).filter(
        (key) =>
          typeof formData[key] === "string" &&
          formData[key].startsWith("data:image")
      );

      imageFields.forEach((field) => {
        const base64 = formData[field];
        const file = base64ToFile(base64, `${field}.jpg`);
        form.append(field, file);
      });

      const response = await axios.post(
        `${import.meta.env.VITE_API_URI}savecustomer`,
        form,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.status !== 200) {
        toast.error(response.data.message);
        return;
      }

      toast.success(response.data.message);
    } catch (error) {
      console.error("Error saving multipart form data:", error);
      toast.error("Error Uploading!!");
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const form = new FormData();
      const textPayload = {};

      for (const key in formData) {
        if (
          typeof formData[key] === "string" &&
          !formData[key].startsWith("data:image")
        ) {
          textPayload[key] = formData[key];
        }
      }

      // @ts-expect-error err
      textPayload.email = emailcookie;

      // @ts-expect-error err
      textPayload.servicename = serviceData.servicename;

      // @ts-expect-error err
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

      const imageFields = Object.keys(formData).filter(
        (key) =>
          typeof formData[key] === "string" &&
          formData[key].startsWith("data:image")
      );

      imageFields.forEach((field) => {
        const base64 = formData[field];
        const file = base64ToFile(base64, `${field}.jpg`);
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
      toast.error("Error Uploading!!");
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async (e) => {
    await saveData(e);
    setCurrentStep((prev) => prev + 1);
  };

  const handlePrev = () => {
    setCurrentStep((prev) => prev - 1);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-[#EBECEC] min-h-screen">
      <ToastContainerComponent />
      <nav
        className="flex items-center  gap-2"
        onClick={() => navigate("/customerdashboard")}
      >
        <LeftArrowIcon />

        <h1 className="text-lg">Back to Dashboard</h1>
      </nav>
      <div className="mt-6">
        <form className="space-y-6">
          {currentStep === 1 && (
            <ContactFormSection
              handleChange={handleChange}
              formData={formData}
              serviceData={serviceData}
              update={update}
            />
          )}
          {currentStep === 2 && (
            <ProfessionalFormSection
              handleChange={handleChange}
              formData={formData}
              serviceData={serviceData}
              update={update}
            />
          )}
          {currentStep === 3 && (
            <DocumentFormSection
              handleChange={handleChange}
              formData={formData}
              update={update}
            />
          )}
          <div className="flex justify-between mt-6">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handlePrev}
                className="bg-[#252C3D] text-[#fff] px-4 py-2 rounded"
              >
                Previous
              </button>
            )}
            {currentStep < 3 ? (
              <button
                type="button"
                onClick={(e) => handleNext(e)}
                className="bg-[#252C3D] text-white px-4 py-2 rounded"
              >
                {loading ? "Saving..." : "Next"}
              </button>
            ) : (
              <button
                type="submit"
                onClick={(e) => saveData(e)}
                className="bg-[#D6B549] text-[#252C3D] px-4 py-2 rounded"
              >
                {loading ? "Saving..." : "Finish"}
              </button>
            )}
          </div>
        </form>
        {currentStep === 3 && (
          <button
            onClick={(e) => {
              handleApply(e);
            }}
            disabled={update == "false"}
            className="bg-[#252C3D] rounded-md py-2 text-white w-full mt-2"
          >
            Apply
          </button>
        )}
      </div>
    </div>
  );
};

export default Applicationform;
