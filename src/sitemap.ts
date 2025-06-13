// import { apiuri } from "./constant";
// import { MetadataRoute } from "next";
// import axios from "axios";

// export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
//   const staticEntries: MetadataRoute.Sitemap = [
//     {
//       url: "https://www.ankurmaternityhospital.in/",
//       lastModified: new Date(),
//       changeFrequency: "daily",
//       priority: 1.0,
//     },
//     {
//       url: "https://www.ankurmaternityhospital.in/feedback",
//       lastModified: new Date(),
//       changeFrequency: "yearly",
//       priority: 0.6,
//     },
//   ];

//   try {
//     const response = await axios.get(`${apiuri}/getservices`);
//     const services = response.data?.payload?.services;

//     if (!Array.isArray(services)) {
//       console.error("Invalid services data:", services);
//       return staticEntries;
//     }

//     const serviceEntries = services.map((service: any): MetadataRoute.Sitemap[number] => ({
//       url: `https://www.ankurmaternityhospital.in/services/${service.servicename
//         .toLowerCase()
//         .replace(/\s+/g, "-")
//         .replace(/[^a-z0-9\-]/g, "")}`, // sanitize slug
//       lastModified: new Date(),
//       changeFrequency: "monthly",
//       priority: 0.8,
//     }));

//     return [...staticEntries, ...serviceEntries];
//   } catch (error) {
//     console.error("API fetch error:", error);
//     return staticEntries;
//   }
// }




import { apiuri } from "./constant";
import { MetadataRoute } from "next";
import axios from "axios";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: "https://www.ankurmaternityhospital.in/",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: "https://www.ankurmaternityhospital.in/feedback",
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.6,
    },
  ];

  try {
    const [servicesRes, doctorsRes] = await Promise.all([
      axios.get(`${apiuri}/getservices`),
      axios.get(`${apiuri}/getdoctors`),
    ]);

    const services = servicesRes.data?.payload?.services || [];
    const doctors = doctorsRes.data?.payload || [];
   

    const serviceEntries = services.map((service: any): MetadataRoute.Sitemap[number] => ({
      url: `https://www.ankurmaternityhospital.in/services/${service.servicename
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9\-]/g, "")}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    }));

    const doctorEntries = doctors.map((doctor: any): MetadataRoute.Sitemap[number] => ({
      url: `https://www.ankurmaternityhospital.in/doctors/${doctor.doctorname
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9\-]/g, "")}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    }));

    return [...staticEntries, ...serviceEntries, ...doctorEntries];
  } catch (error) {
    console.error("API fetch error:", error);
    return staticEntries;
  }
}
