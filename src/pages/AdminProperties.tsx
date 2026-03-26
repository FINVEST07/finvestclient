import { useCallback, useEffect, useMemo, useState } from "react";
import DataTable from "react-data-table-component";
import { toast } from "sonner";
import axios from "axios";
import AdminSidebar from "@/components/AdminSidebar";
import ToastContainerComponent from "@/components/ToastContainerComponent";
import PostPropertyModal, {
  PropertyFormInitialValues,
  PropertyFormPayload,
  PropertyListingType,
  PropertyTypeOption,
} from "@/components/PostPropertyModal";

interface PropertyPhoto {
  url: string;
  public_id?: string;
  resource_type?: string;
}

interface PropertyRecord {
  _id: string;
  propertyId: string;
  propertyName: string;
  area: string;
  type: PropertyListingType;
  floor: string;
  propertyType: PropertyTypeOption;
  address: string;
  phoneNumber: string;
  price: number;
  description: string;
  photos: PropertyPhoto[];
  createdAt: string;
}

const AdminProperties = () => {
  const [properties, setProperties] = useState<PropertyRecord[]>([]);
  const [isPostOpen, setIsPostOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [editingPropertyId, setEditingPropertyId] = useState<string | null>(null);
  const [initialValues, setInitialValues] = useState<PropertyFormInitialValues | null>(null);
  const [existingPhotos, setExistingPhotos] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [posting, setPosting] = useState<boolean>(false);

  const loadProperties = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_API_URI}properties`);
      setProperties(res.data?.payload || []);
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to load properties");
      setProperties([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProperties();
  }, [loadProperties]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this property?")) return;
    try {
      const res = await axios.delete(`${import.meta.env.VITE_API_URI}properties/${id}`);
      if (!res.data?.status) {
        toast.error(res.data?.message || "Failed to delete property");
        return;
      }
      toast.success(res.data?.message || "Property deleted");
      setProperties((prev) => prev.filter((item) => item._id !== id));
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to delete property");
    }
  };

  const handleEdit = (property: PropertyRecord) => {
    setModalMode("edit");
    setEditingPropertyId(property._id);
    setInitialValues({
      propertyName: property.propertyName || "",
      area: property.area || "",
      type: property.type || "",
      floor: property.floor || "",
      propertyType: property.propertyType || "",
      address: property.address || "",
      phoneNumber: property.phoneNumber || "",
      price: String(property.price || ""),
      description: property.description || "",
    });
    setExistingPhotos((property.photos || []).map((photo) => photo.url).filter(Boolean));
    setIsPostOpen(true);
  };

  const openCreateModal = () => {
    setModalMode("create");
    setEditingPropertyId(null);
    setInitialValues(null);
    setExistingPhotos([]);
    setIsPostOpen(true);
  };

  const columns = useMemo(
    () => [
      {
        name: "Property ID",
        selector: (row: PropertyRecord) => row.propertyId,
        width: "160px",
      },
      {
        name: "Property / Society Name",
        selector: (row: PropertyRecord) => row.propertyName,
        wrap: true,
        width: "220px",
      },
      {
        name: "Area",
        selector: (row: PropertyRecord) => row.area,
        width: "140px",
      },
      {
        name: "Type",
        selector: (row: PropertyRecord) => row.type,
        width: "120px",
      },
      {
        name: "Floor",
        selector: (row: PropertyRecord) => row.floor,
        width: "110px",
      },
      {
        name: "Property Type",
        selector: (row: PropertyRecord) => row.propertyType,
        width: "140px",
      },
      {
        name: "Address",
        selector: (row: PropertyRecord) => row.address,
        width: "260px",
        wrap: true,
      },
      {
        name: "Phone Number",
        selector: (row: PropertyRecord) => row.phoneNumber,
        width: "160px",
      },
      {
        name: "Price",
        selector: (row: PropertyRecord) =>
          new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
          }).format(row.price || 0),
        width: "160px",
      },
      {
        name: "Description",
        cell: (row: PropertyRecord) => {
          const text = row.description || "";
          const short = text.length > 80 ? `${text.slice(0, 80)}...` : text;
          return (
            <span title={text} className="block max-w-[260px]">
              {short}
            </span>
          );
        },
        width: "280px",
      },
      {
        name: "Photos",
        cell: (row: PropertyRecord) => (
          <div className="py-2 flex gap-1.5">
            {row.photos?.slice(0, 3).map((photo, idx) => (
              <img
                key={`${row.propertyId}-${idx}`}
                src={photo?.url}
                alt={`property-${idx + 1}`}
                className="w-10 h-10 rounded object-cover border border-slate-300"
              />
            ))}
          </div>
        ),
        width: "140px",
      },
      {
        name: "Actions",
        cell: (row: PropertyRecord) => (
          <div className="flex items-center gap-1.5">
            <button
              className="px-3 py-1 bg-blue-600 text-white rounded"
              onClick={() => handleEdit(row)}
            >
              Edit
            </button>
            <button
              className="px-3 py-1 bg-red-600 text-white rounded"
              onClick={() => handleDelete(row._id)}
            >
              Delete
            </button>
          </div>
        ),
        width: "180px",
      },
    ],
    [handleDelete]
  );

  const customStyles: any = {
    headRow: {
      style: {
        backgroundColor: "#0F172A",
        color: "#fff",
        fontWeight: "bold",
        fontSize: "14px",
        padding: "12px",
      },
    },
    headCells: {
      style: {
        fontSize: "14px",
        fontWeight: "bold",
        padding: "12px",
      },
    },
    rows: {
      style: {
        backgroundColor: "#f9fafb",
        fontSize: "14px",
        padding: "10px",
        borderBottom: "1px solid #d1d5db",
      },
    },
    cells: {
      style: {
        textAlign: "left",
        paddingLeft: "15px",
      },
    },
    pagination: {
      style: {
        backgroundColor: "#e2e8f0",
        color: "#374151",
        fontSize: "14px",
      },
    },
  };

  const onCreateProperty = async (payload: PropertyFormPayload) => {
    try {
      setPosting(true);
      const formData = new FormData();

      formData.append("propertyName", payload.propertyName);
      formData.append("area", payload.area);
      formData.append("type", payload.type);
      formData.append("floor", payload.floor);
      formData.append("propertyType", payload.propertyType);
      formData.append("address", payload.address);
      formData.append("phoneNumber", payload.phoneNumber);
      formData.append("price", String(payload.price));
      formData.append("description", payload.description);

      payload.photos.forEach((photo) => {
        formData.append("photos", photo);
      });

      const request =
        modalMode === "edit" && editingPropertyId
          ? axios.put(`${import.meta.env.VITE_API_URI}properties/${editingPropertyId}`, formData, {
              headers: { "Content-Type": "multipart/form-data" },
            })
          : axios.post(`${import.meta.env.VITE_API_URI}properties`, formData, {
              headers: { "Content-Type": "multipart/form-data" },
            });

      const res = await request;

      if (!res.data?.status) {
        toast.error(res.data?.message || "Failed to post property");
        return;
      }

      setIsPostOpen(false);
      setEditingPropertyId(null);
      setInitialValues(null);
      setExistingPhotos([]);
      setModalMode("create");
      toast.success(
        res.data?.message ||
          (modalMode === "edit"
            ? "Property updated successfully"
            : "Property posted successfully")
      );
      loadProperties();
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to post property");
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="bg-slate-800 pb-16 w-full min-h-screen">
      <ToastContainerComponent />
      <AdminSidebar />

      <div className="ml-[22%] pt-[10vh] px-[5%]">
        <section className="bg-slate-900/50 rounded-lg border border-slate-700 p-6 shadow-lg">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-white text-2xl font-semibold">Properties</h2>
            <button
              onClick={openCreateModal}
              disabled={posting}
              className="px-4 py-2 bg-[#D6B549] text-slate-900 font-medium rounded-md hover:brightness-95 disabled:opacity-70"
            >
              Post Property
            </button>
          </div>

          <div className="mt-5">
            <DataTable
              columns={columns as any}
              data={properties}
              progressPending={loading}
              pagination
              customStyles={customStyles}
              responsive
              noDataComponent={
                <div className="text-center py-6 text-gray-500">
                  No properties found. Click 'Post Property' to add one.
                </div>
              }
            />
          </div>
        </section>
      </div>

      <PostPropertyModal
        open={isPostOpen}
        onClose={() => {
          setIsPostOpen(false);
          setEditingPropertyId(null);
          setInitialValues(null);
          setExistingPhotos([]);
          setModalMode("create");
        }}
        mode={modalMode}
        initialValues={initialValues}
        existingPhotos={existingPhotos}
        onSubmit={onCreateProperty}
      />
    </div>
  );
};

export default AdminProperties;
