"use client";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react"; // Import useState and useEffect to manage active tab state

const Pc = (props) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" {...props}>
      <path d="M64 0C28.7 0 0 28.7 0 64L0 352c0 35.3 28.7 64 64 64l176 0-10.7 32L160 448c-17.7 0-32 14.3-32 32s14.3 32 32 32l256 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-69.3 0L336 416l176 0c35.3 0 64-28.7 64-64l0-288c0-35.3-28.7-64-64-64L64 0zM512 64l0 224L64 288 64 64l448 0z" />
    </svg>
  );
};

const SettingsIcon = (props) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" {...props}>
      <path d="M0 416c0 17.7 14.3 32 32 32l54.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48L480 448c17.7 0 32-14.3 32-32s-14.3-32-32-32l-246.7 0c-12.3-28.3-40.5-48-73.3-48s-61 19.7-73.3 48L32 384c-17.7 0-32 14.3-32 32zm128 0a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zM320 256a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm32-80c-32.8 0-61 19.7-73.3 48L32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l246.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48l54.7 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-54.7 0c-12.3-28.3-40.5-48-73.3-48zM192 128a32 32 0 1 1 0-64 32 32 0 1 1 0 64zm73.3-64C253 35.7 224.8 16 192 16s-61 19.7-73.3 48L32 64C14.3 64 0 78.3 0 96s14.3 32 32 32l86.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48L480 128c17.7 0 32-14.3 32-32s-14.3-32-32-32L265.3 64z" />
    </svg>
  );
};

const DashboardIcon = (props) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" {...props} viewBox="0 0 512 512">
      <path d="M0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm320 96c0-26.9-16.5-49.9-40-59.3L280 88c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 204.7c-23.5 9.5-40 32.5-40 59.3c0 35.3 28.7 64 64 64s64-28.7 64-64zM144 176a32 32 0 1 0 0-64 32 32 0 1 0 0 64zm-16 80a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm288 32a32 32 0 1 0 0-64 32 32 0 1 0 0 64zM400 144a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z" />
    </svg>
  );
};

const ApplicationIcon = (props) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" {...props}>
      <path d="M64 0C28.7 0 0 28.7 0 64L0 352c0 35.3 28.7 64 64 64l96 0 0 80c0 6.1 3.4 11.6 8.8 14.3s11.9 2.1 16.8-1.5L309.3 416 448 416c35.3 0 64-28.7 64-64l0-288c0-35.3-28.7-64-64-64L64 0z" />
    </svg>
  );
};

const EnquiryIcon = (props) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" {...props}>
      <path d="M64 112c-8.8 0-16 7.2-16 16l0 256c0 8.8 7.2 16 16 16l384 0c8.8 0 16-7.2 16-16l0-256c0-8.8-7.2-16-16-16L64 112zM48 64l416 0c35.3 0 64 28.7 64 64l0 256c0 35.3-28.7 64-64 64L48 448c-35.3 0-64-28.7-64-64L-16 128C-16 92.7 12.7 64 48 64zm64 96c0-8.8 7.2-16 16-16l256 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-256 0c-8.8 0-16-7.2-16-16zm0 96c0-8.8 7.2-16 16-16l256 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-256 0c-8.8 0-16-7.2-16-16zm0 96c0-8.8 7.2-16 16-16l160 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-160 0c-8.8 0-16-7.2-16-16z" />
    </svg>
  );
};

const UsersIcon = (props) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" {...props}>
      <path d="M144 0a80 80 0 1 1 0 160A80 80 0 1 1 144 0zM512 0a80 80 0 1 1 0 160A80 80 0 1 1 512 0zM0 298.7C0 239.8 47.8 192 106.7 192l42.7 0c15.9 0 31 3.5 44.6 9.7c-1.3 7.2-1.9 14.7-1.9 22.3c0 38.2 16.8 72.5 43.3 96c-.2 0-.4 0-.7 0L21.3 320C9.6 320 0 310.4 0 298.7zM405.3 320c-.2 0-.4 0-.7 0c26.6-23.5 43.3-57.8 43.3-96c0-7.6-.7-15-1.9-22.3c13.6-6.3 28.7-9.7 44.6-9.7l42.7 0C592.2 192 640 239.8 640 298.7c0 11.8-9.6 21.3-21.3 21.3l-213.3 0zM224 224a96 96 0 1 1 192 0 96 96 0 1 1 -192 0zM128 485.3C128 411.7 187.7 352 261.3 352l117.3 0C452.3 352 512 411.7 512 485.3c0 14.7-11.9 26.7-26.7 26.7l-330.7 0c-14.7 0-26.7-11.9-26.7-26.7z" />
    </svg>
  );
};

const AdminSidebar = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("dashboard");
  const navigate = useNavigate();

  useEffect(() => {
    // Parse the URL search params to set the active tab on page load
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab");
    if (tab) {
      setActiveTab(tab);
    }
  }, [location]);

  

  const handleNavigation = (path, tab) => {
    // Update the URL with the active tab and navigate to the corresponding page
    navigate(`${path}?tab=${tab}`);
    setActiveTab(tab);
  };

  return (
    <div className="w-[22%] h-screen fixed bg-[#0F172A] py-6 px-[1.5%]">
      <section className="flex items-center gap-3">
        <Pc width={44} fill={"#D6B549"} />
        <span className="text-[#D6B549] text-2xl">Control Panel</span>
      </section>
      {/* Navigation Section */}
      <section className="mt-[6vh] ml-5 flex flex-col space-y-6">
        <div
          className={`flex gap-3 cursor-pointer items-center ${
            activeTab === "dashboard" ? "bg-slate-600 p-3 rounded-md" : ""
          }`}
          onClick={() => handleNavigation("/admindashboard", "dashboard")}
        >
          <DashboardIcon width={26} fill={"#D6B549"} />
          <span className="text-lg self-center text-[#D6B549]">DashBoard</span>
        </div>
         <div
          className={`flex gap-3 cursor-pointer items-center ${
            activeTab === "customers" ? "bg-slate-600 p-3 rounded-md" : ""
          }`}
          onClick={() => handleNavigation("/admincustomers", "customers")}
        >
          <UsersIcon width={26} fill={"#D6B549"} />
          <span className="text-lg self-center text-[#D6B549]">Customers</span>
        </div>
        <div
          className={`flex gap-3 cursor-pointer items-center ${
            activeTab === "applications" ? "bg-slate-600 p-3 rounded-md" : ""
          }`}
          onClick={() => handleNavigation("/adminapplications", "applications")}
        >
          <ApplicationIcon width={26} fill={"#D6B549"} />
          <span className="text-lg self-center text-[#D6B549]">
            Applications
          </span>
        </div>

        <div
          className={`flex gap-3 cursor-pointer items-center ${
            activeTab === "enquiries" ? "bg-slate-600 p-3 rounded-md" : ""
          }`}
          onClick={() => handleNavigation("/adminenquiries", "enquiries")}
        >
          <EnquiryIcon width={26} fill={"#D6B549"} />
          <span className="text-lg self-center text-[#D6B549]">Enquiries</span>
        </div>
        <div
          className={`flex gap-3 cursor-pointer items-center ${
            activeTab === "blogs" ? "bg-slate-600 p-3 rounded-md" : ""
          }`}
          onClick={() => handleNavigation("/adminblogs", "blogs")}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width={26} className="self-center" fill="#D6B549">
            <path d="M290.7 93.2L138.5 245.4c-4.1 4.1-6.8 9.2-8 14.5L112 334.9c-2.9 13.1 8.8 24.8 21.9 21.9l75.1-18.5c5.3-1.3 10.4-4 14.5-8L376 178.1 290.7 93.2zM497.9 74.2l-60.1-60.1c-18.7-18.7-49.1-18.7-67.9 0L331 53.1l97.9 97.9 68.9-68.9c18.8-18.7 18.8-49.1.1-67.9zM64 64C28.7 64 0 92.7 0 128V448c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V256c0-17.7-14.3-32-32-32s-32 14.3-32 32V448c0 17.7-14.3 32-32 32H64c-17.7 0-32-14.3-32-32V128c0-17.7 14.3-32 32-32H256c17.7 0 32-14.3 32-32s-14.3-32-32-32H64z"/>
          </svg>
          <span className="text-lg self-center text-[#D6B549]">Blogs & Media</span>
        </div>
        
        <div
          className={`flex gap-3 cursor-pointer items-center ${
            activeTab === "settings" ? "bg-slate-600 p-3 rounded-md" : ""
          }`}
          onClick={() => handleNavigation("/settings", "settings")}
        >
          <SettingsIcon width={26} fill={"#D6B549"} />
          <span className="text-lg self-center text-[#D6B549]">Settings</span>
        </div>
        <button
          className="mt-[8vh] bg-red-700 z-50 px-4 py-2 text-white rounded-md"
          onClick={() => {
            localStorage.removeItem("rank");
            window.location.reload();
          }}
        >
          Log Out
        </button>
      </section>
    </div>
  );
};

export default AdminSidebar;
