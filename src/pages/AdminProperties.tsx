import { useCallback, useEffect, useMemo, useState } from "react";
import DataTable from "react-data-table-component";
import { toast } from "sonner";
import axios from "axios";
import AdminSidebar from "@/components/AdminSidebar";
import { Share2, Download, Eye, Pencil, Trash2 } from "lucide-react";
import PostPropertyModal, {
  ExistingPropertyPdf,
  ExistingPropertyPhoto,
  PropertyFormInitialValues,
  PropertyFormPayload,
  PropertyListingType,
  PropertyTypeOption,
} from "@/components/PostPropertyModal";
import PropertyViewModal from "@/components/PropertyViewModal";

interface PropertyPhoto {
  url: string;
  public_id?: string;
  resource_type?: string;
}

interface PropertyRecord {
  _id: string;
  propertyId: string;
  headline: string;
  propertyOrSocietyName: string;
  area: string;
  type: PropertyListingType;
  bhk: string;
  floor: string;
  propertyType: PropertyTypeOption;
  offerPrice: number;
  estimatedMarketValue: number;
  price?: number;
  location: string;
  district: string;
  possession: "Physical" | "Symbolic" | "Free Hold";
  status: "Available" | "Sold Out";
  emdDate?: string;
  eoiDate?: string;
  flatNo: string;
  fullAddress: string;
  bankName: string;
  contactPerson: string;
  contactNumber: string;
  pdfDocument?: { url?: string; public_id?: string; original_filename?: string } | null;
  inspectionDateTime?: string;
  postingDateTime?: string;
  highlights?: string;
  photos: PropertyPhoto[];
  createdAt: string;
}

const listingTypeLabel: Record<PropertyListingType, string> = {
  Auction: "Auction",
  Distress: "Alternate Investment",
  New: "New Property",
  Resale: "Resale Property",
};

const formatPropertyDate = (iso: string) => {
  if (!iso) return "-";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatDateTimeForInput = (iso: string | undefined) => {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const formatDateForInput = (iso: string | undefined) => {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const AdminProperties = () => {
  const [properties, setProperties] = useState<PropertyRecord[]>([]);
  const [isPostOpen, setIsPostOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [editingPropertyId, setEditingPropertyId] = useState<string | null>(null);
  const [initialValues, setInitialValues] = useState<PropertyFormInitialValues | null>(null);
  const [existingPhotos, setExistingPhotos] = useState<ExistingPropertyPhoto[]>([]);
  const [existingPdfDocument, setExistingPdfDocument] = useState<ExistingPropertyPdf | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [posting, setPosting] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewingProperty, setViewingProperty] = useState<PropertyRecord | null>(null);

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

  const shareOrCopyLink = async (url: string) => {
    try {
      if (navigator.share) {
        await navigator.share({ url });
        return;
      }
    } catch (e) {
      // ignore and fallback to clipboard
    }

    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied");
    } catch (e) {
      console.error(e);
      toast.error("Failed to copy link");
    }
  };

  const downloadFile = async (url: string, filename: string) => {
    if (!url) {
      toast.error("No file available to download");
      return;
    }
    try {
      const response = await fetch(url, { mode: "cors" });
      if (!response.ok) throw new Error("Download failed");
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename || "download";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
      toast.success("Download started");
    } catch (e) {
      console.error(e);
      toast.error("Failed to download file");
    }
  };

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
      headline: property.headline || property.propertyOrSocietyName || "",
      propertyOrSocietyName: property.propertyOrSocietyName || "",
      area: property.area || "",
      type: property.type || "",
      bhk: property.bhk || "",
      offerPrice: String(property.offerPrice || ""),
      estimatedMarketValue: String(property.estimatedMarketValue || ""),
      price: String(property.price || property.offerPrice || ""),
      location: property.location || "",
      district: property.district || "",
      possession: property.possession || "",
      status: property.status || "",
      emdDate: formatDateForInput(property.emdDate),
      eoiDate: formatDateForInput(property.eoiDate),
      flatNo: property.flatNo || "",
      floor: property.floor || "",
      fullAddress: property.fullAddress || "",
      bankName: property.bankName || "",
      contactPerson: property.contactPerson || "",
      contactNumber: property.contactNumber || "",
      highlights: property.highlights || "",
      propertyType: property.propertyType || "",
      inspectionDateTime: formatDateTimeForInput(property.inspectionDateTime),
      postingDateTime: formatDateTimeForInput(property.postingDateTime),
    });
    setExistingPhotos(
      (property.photos || [])
        .filter((photo) => photo?.url)
        .map((photo) => ({
          url: photo.url,
          public_id: photo.public_id || "",
        }))
    );
    setExistingPdfDocument(property.pdfDocument || null);
    setIsPostOpen(true);
  };

  const openCreateModal = () => {
    setModalMode("create");
    setEditingPropertyId(null);
    setInitialValues(null);
    setExistingPhotos([]);
    setExistingPdfDocument(null);
    setIsPostOpen(true);
  };

  const filteredProperties = useMemo(() => {
    if (!searchQuery.trim()) return properties;
    const query = searchQuery.toLowerCase().trim();
    return properties.filter((p) => {
      return (
        p.propertyId?.toLowerCase().includes(query) ||
        p.propertyOrSocietyName?.toLowerCase().includes(query) ||
        p.location?.toLowerCase().includes(query) ||
        p.district?.toLowerCase().includes(query) ||
        (listingTypeLabel[p.type] || p.type)?.toLowerCase().includes(query)
      );
    });
  }, [properties, searchQuery]);

  const columns = useMemo(
    () => [
      {
        name: "Property ID",
        selector: (row: PropertyRecord) => row.propertyId,
        width: "160px",
      },
      {
        name: "Posted On",
        selector: (row: PropertyRecord) => formatPropertyDate(row.createdAt),
        width: "180px",
      },
      {
        name: "Headline",
        selector: (row: PropertyRecord) => row.headline,
        wrap: true,
        width: "220px",
      },
      {
        name: "Property / Society",
        selector: (row: PropertyRecord) => row.propertyOrSocietyName,
        width: "140px",
      },
      {
        name: "Type",
        selector: (row: PropertyRecord) => listingTypeLabel[row.type] || row.type,
        width: "120px",
      },
      {
        name: "Location",
        selector: (row: PropertyRecord) => row.location,
        width: "110px",
      },
      {
        name: "District",
        selector: (row: PropertyRecord) => row.district,
        width: "140px",
      },
      {
        name: "Configuration",
        selector: (row: PropertyRecord) => row.bhk,
        width: "100px",
      },
      {
        name: "Offer Price",
        selector: (row: PropertyRecord) =>
          new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
          }).format(row.offerPrice || 0),
        width: "160px",
      },
      {
        name: "Est. Market Value",
        selector: (row: PropertyRecord) =>
          new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
          }).format(row.estimatedMarketValue || 0),
        width: "160px",
      },
      {
        name: "Status",
        selector: (row: PropertyRecord) => row.status || "-",
        width: "130px",
      },
      {
        name: "Photos",
        cell: (row: PropertyRecord) => (
          <div className="py-2 flex items-center gap-2">
            <div className="flex gap-1.5">
              {row.photos?.slice(0, 3).map((photo, idx) => (
                <img
                  key={`${row.propertyId}-${idx}`}
                  src={photo?.url}
                  alt={`property-${idx + 1}`}
                  className="w-10 h-10 rounded object-cover border border-slate-300"
                />
              ))}
            </div>
            {row.photos?.length > 0 && (
              <button
                onClick={() =>
                  downloadFile(
                    row.photos[0].url,
                    `${row.propertyId}-photo-1.jpg`
                  )
                }
                className="p-1.5 bg-slate-700 text-white rounded hover:bg-slate-600"
                title="Download first photo"
                type="button"
              >
                <Download size={14} />
              </button>
            )}
          </div>
        ),
        width: "170px",
      },
      {
        name: "Documents",
        cell: (row: PropertyRecord) => (
          <div className="py-2">
            {row.pdfDocument?.url ? (
              <button
                onClick={() =>
                  downloadFile(
                    row.pdfDocument!.url,
                    row.pdfDocument?.original_filename ||
                      `${row.propertyId}-document.pdf`
                  )
                }
                className="px-3 py-1.5 bg-emerald-600 text-white rounded flex items-center gap-2 hover:bg-emerald-500"
                title="Download document"
                type="button"
              >
                <Download size={14} />
                <span>Download</span>
              </button>
            ) : (
              <span className="text-slate-400 text-sm">-</span>
            )}
          </div>
        ),
        width: "160px",
      },
      {
        name: "Actions",
        cell: (row: PropertyRecord) => (
          <div className="flex items-center gap-2">
            <button
              className="p-2 bg-emerald-600 text-white rounded hover:bg-emerald-500 transition-colors"
              title="View Property"
              onClick={() => {
                setViewingProperty(row as unknown as PropertyRecord);
                setIsViewOpen(true);
              }}
            >
              <Eye size={16} />
            </button>
            <button
              className="p-2 bg-blue-600 text-white rounded hover:bg-blue-500 transition-colors"
              title="Edit Property"
              onClick={() => handleEdit(row)}
            >
              <Pencil size={16} />
            </button>
            <button
              className="p-2 bg-red-600 text-white rounded hover:bg-red-500 transition-colors"
              title="Delete Property"
              onClick={() => handleDelete(row._id)}
            >
              <Trash2 size={16} />
            </button>
            <button
              className="p-2 bg-slate-700 text-white rounded hover:bg-slate-600 transition-colors"
              title="Share / Copy link"
              onClick={() => {
                const url = `${window.location.origin}/investor-zone/${String(row.type || "").toLowerCase()}/${row._id}`;
                shareOrCopyLink(url);
              }}
            >
              <Share2 size={16} />
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

      formData.append("headline", payload.headline);
      formData.append("propertyOrSocietyName", payload.propertyOrSocietyName);
      formData.append("area", payload.area);
      formData.append("type", payload.type);
      formData.append("bhk", payload.bhk);
      formData.append("offerPrice", String(payload.offerPrice));
      formData.append("estimatedMarketValue", String(payload.estimatedMarketValue));
      formData.append("price", String(payload.price || 0));
      formData.append("location", payload.location);
      formData.append("district", payload.district);
      formData.append("possession", payload.possession);
      formData.append("status", payload.status);
      formData.append("emdDate", payload.emdDate);
      formData.append("eoiDate", payload.eoiDate);
      formData.append("flatNo", payload.flatNo);
      formData.append("floor", payload.floor);
      formData.append("fullAddress", payload.fullAddress);
      formData.append("bankName", payload.bankName);
      formData.append("contactPerson", payload.contactPerson);
      formData.append("contactNumber", payload.contactNumber);
      formData.append("propertyType", payload.propertyType);
      formData.append("inspectionDateTime", payload.inspectionDateTime);
      formData.append("postingDateTime", payload.postingDateTime);
      formData.append("highlights", payload.highlights);

      payload.photos.forEach((photo) => {
        formData.append("photos", photo);
      });

      if (payload.pdfDocument) {
        formData.append("pdfDocument", payload.pdfDocument);
      }

      if (modalMode === "edit") {
        formData.append("deletedImages", JSON.stringify(payload.deletedImages || []));
        formData.append("deletePdf", String(Boolean(payload.deletePdf)));
      }

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
      setExistingPdfDocument(null);
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
      <AdminSidebar />

      <div className="ml-[22%] pt-[10vh] px-[5%]">
        <section className="bg-slate-900/50 rounded-lg border border-slate-700 p-6 shadow-lg">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <h2 className="text-white text-2xl font-semibold">Properties</h2>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="relative w-full sm:w-72">
                <input
                  type="text"
                  placeholder="Search by ID, Name, Location, District or Type..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-[#D6B549] placeholder:text-slate-500"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    ✕
                  </button>
                )}
              </div>
              <button
                onClick={openCreateModal}
                disabled={posting}
                className="px-4 py-2 bg-[#D6B549] text-slate-900 font-medium rounded-md hover:brightness-95 disabled:opacity-70 whitespace-nowrap"
              >
                Post Property
              </button>
            </div>
          </div>

          <div className="mt-5">
            <DataTable
              columns={columns as any}
              data={filteredProperties}
              progressPending={loading}
              pagination
              paginationPerPage={5}
              paginationRowsPerPageOptions={[5, 10, 15, 20, 25, 30]}
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
          setExistingPdfDocument(null);
          setModalMode("create");
        }}
        mode={modalMode}
        initialValues={initialValues}
        existingPhotos={existingPhotos}
        existingPdfDocument={existingPdfDocument}
        onSubmit={onCreateProperty}
      />

      <PropertyViewModal
        open={isViewOpen}
        onClose={() => {
          setIsViewOpen(false);
          setViewingProperty(null);
        }}
        property={viewingProperty as any}
      />
    </div>
  );
};

export default AdminProperties;
