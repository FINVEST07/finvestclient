import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Cookie from "js-cookie";

const ContactFormSection = ({
  handleChange,
  formData,
  serviceData,
  update,
}) => {
  const [cities, setCities] = useState([]);

  const cookie = Cookie.get("finvest");
  const emailcookie = cookie ? cookie.split("$")[0] : "";

  const loadData = useCallback(async () => {
    try {
      // Fetch customer data
      const citiesres = await axios.get(
        `${import.meta.env.VITE_API_URI}getcities`
      );

      if (citiesres.status === 200 && citiesres.data?.payload) {
        setCities(citiesres.data.payload);
      } else {
        console.warn("Failed to load customer data", citiesres);
      }
    } catch (error) {
      console.error("An error occurred while loading data:", error);
    }
  }, [emailcookie]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredCities, setFilteredCities] = useState([]);

  useEffect(() => {
    if (formData.city && cities?.length) {
      const searchTerm = formData.city.toLowerCase();
      const filtered = cities.filter((city) =>
        city.toLowerCase().includes(searchTerm)
      );
      setFilteredCities(filtered);
    } else {
      setFilteredCities([]);
    }
  }, [formData.city, cities]);

  const handleCitySelect = (city) => {
    handleChange({ target: { name: "city", value: city } });
    setShowSuggestions(false);
  };

  const PhoneIcon = () => {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width={20} fill="#fff"><path d="M280 0C408.1 0 512 103.9 512 232c0 13.3-10.7 24-24 24s-24-10.7-24-24c0-101.6-82.4-184-184-184c-13.3 0-24-10.7-24-24s10.7-24 24-24zm8 192a32 32 0 1 1 0 64 32 32 0 1 1 0-64zm-32-72c0-13.3 10.7-24 24-24c75.1 0 136 60.9 136 136c0 13.3-10.7 24-24 24s-24-10.7-24-24c0-48.6-39.4-88-88-88c-13.3 0-24-10.7-24-24zM117.5 1.4c19.4-5.3 39.7 4.6 47.4 23.2l40 96c6.8 16.3 2.1 35.2-11.6 46.3L144 207.3c33.3 70.4 90.3 127.4 160.7 160.7L345 318.7c11.2-13.7 30-18.4 46.3-11.6l96 40c18.6 7.7 28.5 28 23.2 47.4l-24 88C481.8 499.9 466 512 448 512C200.6 512 0 311.4 0 64C0 46 12.1 30.2 29.5 25.4l88-24z"/></svg>
    )
  }

  return (
    <div className="space-y-4 bg-[#E9E5DA] border p-4 rounded-lg">
      <h3 className="text-lg font-semibold">Contact Details:-</h3>
      <div>
        <label>
          Email <span className="text-red-600">*</span>
        </label>
        <input
          name="email"
          placeholder="Email"
          onChange={handleChange}
          value={formData.email}
          className="bg-transparent border-b-2 border-[#252C3D] w-full outline-0"
          disabled={update == "false"}
        />
      </div>

      <div>
        <label>
          Mobile Number<span className="text-red-600">*</span>
        </label>
        <input
          name="mobile"
          placeholder="97654XXXXX"
          onChange={handleChange}
          value={formData.mobile}
          className="bg-transparent border-b-2 border-[#252C3D] w-full outline-0"
          disabled={update == "false"}
        />
      </div>

      <div>
        <label>Alternate Mobile Number</label>
        <input
          name="altMobile"
          placeholder="97654XXXXX"
          onChange={handleChange}
          value={formData.altMobile}
          className="bg-transparent border-b-2 border-[#252C3D] w-full outline-0"
          disabled={update == "false"}
        />
      </div>

      <div className="relative">
        <label>
          City <span className="text-red-600">*</span>
        </label>
        <input
          type="text"
          name="city"
          placeholder="Enter city"
          onChange={handleChange}
          value={formData.city}
          className="bg-transparent border-b-2 border-[#252C3D] w-full outline-0"
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 100)} // small delay to allow item click
          disabled={update == "false"}
        />
        {showSuggestions && filteredCities.length > 0 && (
          <ul className="absolute z-10 bg-white border border-gray-300 w-full max-h-40 overflow-y-auto rounded shadow-md">
            {filteredCities.map((city, index) => (
              <li
                key={index}
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleCitySelect(city)}
              >
                {city}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <label>
          Current Address
          <span className="text-red-600">*</span>
        </label>
        <textarea
          name="currentAddress"
          onChange={handleChange}
          value={formData.currentAddress}
          className="bg-transparent border-2 border-[#252C3D] w-full "
          disabled={update == "false"}
        />
      </div>

      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          name="sameAsCurrent"
          checked={formData.sameAsCurrent}
          onChange={handleChange}
          disabled={update == "false"}
        />
        <span>Same as current address</span>
      </label>

      <div>
        <label>
          Permanent Address
          <span className="text-red-600">*</span>
        </label>
        <textarea
          name="permanentAddress"
          onChange={handleChange}
          value={formData.permanentAddress}
          className="bg-transparent border-2 border-[#252C3D] w-full"
          disabled={update == "false"}
        />
      </div>

      {serviceData.type == "1" ||
        (serviceData.type == 1 && (
          <div>
            <label>
              Property
              <span className="text-red-600">*</span>
            </label>
            <div className="flex gap-4 mt-2">
              <label>
                <input
                  type="radio"
                  name="residenceType"
                  value="Owned"
                  onChange={handleChange}
                  checked={formData.residenceType === "Owned"}
                  disabled={update == "false"}
                />
                <span className="ml-1">Owned</span>
              </label>
              <label>
                <input
                  type="radio"
                  name="residenceType"
                  value="Rented"
                  onChange={handleChange}
                  checked={formData.residenceType === "Rented"}
                  disabled={update == "false"}
                />
                <span className="ml-1">Rented</span>
              </label>
            </div>
          </div>
        ))}
    </div>
  );
};

export default ContactFormSection;
