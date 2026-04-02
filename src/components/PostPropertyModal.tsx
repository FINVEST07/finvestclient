import { useEffect, useMemo, useState } from "react";

export type PropertyTypeOption =
  | "Flat"
  | "Bungalow"
  | "Villa"
  | "Penthouse"
  | "Studio"
  | "Duplex"
  | "Plot"
  | "Commercial";

export type PropertyListingType = "Auction" | "Distress";
export type PossessionType = "Physical" | "Symbolic";
export type PropertyStatusType = "Available" | "Sold Out";

export interface PropertyRecord {
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
  location: string;
  district: string;
  possession: PossessionType;
  status: PropertyStatusType;
  emdDate?: string;
  eoiDate?: string;
  flatNo: string;
  fullAddress: string;
  bankName: string;
  contactPerson: string;
  contactNumber: string;
  photos: string[];
  createdAt: string;
}

export interface PropertyFormPayload {
  headline: string;
  area: string;
  type: PropertyListingType;
  bhk: string;
  offerPrice: number;
  estimatedMarketValue: number;
  location: string;
  district: string;
  possession: PossessionType;
  status: PropertyStatusType;
  emdDate: string;
  eoiDate: string;

  flatNo: string;
  propertyOrSocietyName: string;
  floor: string;
  fullAddress: string;
  bankName: string;
  contactPerson: string;
  contactNumber: string;

  propertyType: PropertyTypeOption;
  photos: File[];
  pdfDocument: File | null;
}

export interface PropertyFormInitialValues {
  headline: string;
  propertyOrSocietyName: string;
  area: string;
  type: PropertyListingType | "";
  bhk: string;
  offerPrice: string;
  estimatedMarketValue: string;
  location: string;
  district: string;
  possession: PossessionType | "";
  status: PropertyStatusType | "";
  emdDate: string;
  eoiDate: string;
  flatNo: string;
  floor: string;
  fullAddress: string;
  bankName: string;
  contactPerson: string;
  contactNumber: string;
  propertyType: PropertyTypeOption | "";
}

interface PostPropertyModalProps {
  open: boolean;
  onClose: () => void;
  mode?: "create" | "edit";
  initialValues?: PropertyFormInitialValues | null;
  existingPhotos?: string[];
  onSubmit: (payload: PropertyFormPayload) => void | Promise<void>;
}

type FieldErrors = Partial<Record<keyof Omit<PropertyRecord, "propertyId" | "createdAt" | "photos"> | "photos" | "pdfDocument", string>>;

const listingTypeOptions: PropertyListingType[] = ["Auction", "Distress"];
const listingTypeLabel: Record<PropertyListingType, string> = {
  Auction: "Auction",
  Distress: "Alternate Investment",
};
const propertyTypeOptions: PropertyTypeOption[] = [
  "Flat",
  "Bungalow",
  "Villa",
  "Penthouse",
  "Studio",
  "Duplex",
  "Plot",
  "Commercial",
];
const possessionOptions: PossessionType[] = ["Physical", "Symbolic"];
const statusOptions: PropertyStatusType[] = ["Available", "Sold Out"];

const initialState = {
  headline: "",
  propertyOrSocietyName: "",
  area: "",
  type: "" as "" | PropertyListingType,
  bhk: "",
  offerPrice: "",
  estimatedMarketValue: "",
  location: "",
  district: "",
  possession: "" as "" | PossessionType,
  status: "" as "" | PropertyStatusType,
  emdDate: "",
  eoiDate: "",
  flatNo: "",
  floor: "",
  fullAddress: "",
  bankName: "",
  contactPerson: "",
  contactNumber: "",
  propertyType: "" as "" | PropertyTypeOption,
};

const PostPropertyModal = ({
  open,
  onClose,
  onSubmit,
  mode = "create",
  initialValues = null,
  existingPhotos = [],
}: PostPropertyModalProps) => {
  const [form, setForm] = useState(initialState);
  const [photos, setPhotos] = useState<File[]>([]);
  const [pdfDocument, setPdfDocument] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [photoError, setPhotoError] = useState<string>("");

  useEffect(() => {
    if (!open) {
      setForm(initialState);
      setPhotos([]);
      setPdfDocument(null);
      setIsSubmitting(false);
      setErrors({});
      setPhotoError("");
      return;
    }

    if (mode === "edit" && initialValues) {
      setForm({
        headline: initialValues.headline || "",
        propertyOrSocietyName: initialValues.propertyOrSocietyName || "",
        area: initialValues.area || "",
        type: (initialValues.type as "" | PropertyListingType) || "",
        bhk: initialValues.bhk || "",
        offerPrice: initialValues.offerPrice || "",
        estimatedMarketValue: initialValues.estimatedMarketValue || "",
        location: initialValues.location || "",
        district: initialValues.district || "",
        possession: (initialValues.possession as "" | PossessionType) || "",
        status: (initialValues.status as "" | PropertyStatusType) || "",
        emdDate: initialValues.emdDate || "",
        eoiDate: initialValues.eoiDate || "",
        flatNo: initialValues.flatNo || "",
        floor: initialValues.floor || "",
        fullAddress: initialValues.fullAddress || "",
        bankName: initialValues.bankName || "",
        contactPerson: initialValues.contactPerson || "",
        contactNumber: initialValues.contactNumber || "",
        propertyType: (initialValues.propertyType as "" | PropertyTypeOption) || "",
      });
      setPhotos([]);
      setPdfDocument(null);
      setIsSubmitting(false);
      setErrors({});
      setPhotoError("");
    }
  }, [open, mode, initialValues]);

  const previewUrls = useMemo(() => photos.map((f) => URL.createObjectURL(f)), [photos]);

  useEffect(() => {
    return () => {
      previewUrls.forEach((u) => URL.revokeObjectURL(u));
    };
  }, [previewUrls]);

  if (!open) return null;

  const setField = (name: keyof typeof initialState, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handlePhotoChange = (files: FileList | null) => {
    if (!files) return;
    const selected = Array.from(files);
    const valid = selected.filter((file) => /image\/(jpeg|jpg|png|webp)/.test(file.type));

    if (valid.length !== selected.length) {
      setPhotoError("Only jpg, jpeg, png, and webp images are allowed.");
      return;
    }

    const total = photos.length + valid.length;
    if (total > 5) {
      setPhotoError("You can upload maximum 5 photos.");
      return;
    }

    setPhotoError("");
    setErrors((prev) => ({ ...prev, photos: "" }));
    setPhotos((prev) => [...prev, ...valid]);
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const validate = () => {
    const nextErrors: FieldErrors = {};

    if (!form.headline.trim()) nextErrors.headline = "Headline is required";
    if (!form.propertyOrSocietyName.trim()) nextErrors.propertyOrSocietyName = "Property / Society Name is required";
    if (!form.area.trim()) nextErrors.area = "Area is required";
    if (!form.type) nextErrors.type = "Type is required";
    if (!form.bhk.trim()) nextErrors.bhk = "BHK is required";
    if (!form.location.trim()) nextErrors.location = "Location is required";
    if (!form.district.trim()) nextErrors.district = "District is required";
    if (!form.possession) nextErrors.possession = "Possession is required";
    if (!form.status) nextErrors.status = "Status is required";

    if (!form.offerPrice.trim() || Number(form.offerPrice) <= 0) {
      nextErrors.offerPrice = "Offer Price must be greater than 0";
    }
    if (!form.estimatedMarketValue.trim() || Number(form.estimatedMarketValue) <= 0) {
      nextErrors.estimatedMarketValue = "Estimated Market Value must be greater than 0";
    }

    if (form.type === "Auction" && !form.emdDate) {
      nextErrors.emdDate = "EMD Date is required for Auction properties";
    }
    if (form.type === "Distress" && !form.eoiDate) {
      nextErrors.eoiDate = "EOI Date is required for Alternate Investment";
    }

    if (!form.propertyType) nextErrors.propertyType = "Property Type is required";
    if (!form.fullAddress.trim()) nextErrors.fullAddress = "Full Address is required";
    if (!form.contactPerson.trim()) nextErrors.contactPerson = "Contact Person is required";
    if (!form.contactNumber.trim()) nextErrors.contactNumber = "Contact Number is required";
    if (form.contactNumber && !/^\d{10,15}$/.test(form.contactNumber.trim())) {
      nextErrors.contactNumber = "Contact Number must be numeric (10-15 digits)";
    }

    if (mode === "create" && photos.length === 0) {
      nextErrors.photos = "At least one photo is required";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setIsSubmitting(true);
      await onSubmit({
        headline: form.headline.trim(),
        area: form.area.trim(),
        type: form.type as PropertyListingType,
        bhk: form.bhk.trim(),
        offerPrice: Number(form.offerPrice),
        estimatedMarketValue: Number(form.estimatedMarketValue),
        location: form.location.trim(),
        district: form.district.trim(),
        possession: form.possession as PossessionType,
        status: form.status as PropertyStatusType,
        emdDate: form.emdDate,
        eoiDate: form.eoiDate,
        flatNo: form.flatNo.trim(),
        propertyOrSocietyName: form.propertyOrSocietyName.trim(),
        floor: form.floor.trim(),
        fullAddress: form.fullAddress.trim(),
        bankName: form.bankName.trim(),
        contactPerson: form.contactPerson.trim(),
        contactNumber: form.contactNumber.trim(),
        propertyType: form.propertyType as PropertyTypeOption,
        photos,
        pdfDocument,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = (field: keyof FieldErrors) =>
    `w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 ${
      errors[field] ? "border-red-500 focus:ring-red-200" : "border-slate-300 focus:ring-[#D6B549]"
    }`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-white rounded-lg shadow-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-slate-800">
            {mode === "edit" ? "Edit Property" : "Post New Property"}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Headline <span className="text-red-600">*</span>
              </label>
              <input
                value={form.headline}
                onChange={(e) => setField("headline", e.target.value)}
                className={inputClass("headline")}
              />
              {errors.headline && <p className="text-xs text-red-600 mt-1">{errors.headline}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Property / Society Name <span className="text-red-600">*</span>
              </label>
              <input
                value={form.propertyOrSocietyName}
                onChange={(e) => setField("propertyOrSocietyName", e.target.value)}
                className={inputClass("propertyOrSocietyName")}
              />
              {errors.propertyOrSocietyName && <p className="text-xs text-red-600 mt-1">{errors.propertyOrSocietyName}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Type <span className="text-red-600">*</span>
              </label>
              <select
                value={form.type}
                onChange={(e) => setField("type", e.target.value)}
                className={inputClass("type")}
              >
                <option value="">Select Type</option>
                {listingTypeOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {listingTypeLabel[opt]}
                  </option>
                ))}
              </select>
              {errors.type && <p className="text-xs text-red-600 mt-1">{errors.type}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Property Type <span className="text-red-600">*</span>
              </label>
              <select
                value={form.propertyType}
                onChange={(e) => setField("propertyType", e.target.value)}
                className={inputClass("propertyType")}
              >
                <option value="">Select Property Type</option>
                {propertyTypeOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              {errors.propertyType && <p className="text-xs text-red-600 mt-1">{errors.propertyType}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Area <span className="text-red-600">*</span>
              </label>
              <input
                value={form.area}
                onChange={(e) => setField("area", e.target.value)}
                className={inputClass("area")}
              />
              {errors.area && <p className="text-xs text-red-600 mt-1">{errors.area}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                BHK <span className="text-red-600">*</span>
              </label>
              <input
                value={form.bhk}
                onChange={(e) => setField("bhk", e.target.value)}
                className={inputClass("bhk")}
                placeholder="2 BHK"
              />
              {errors.bhk && <p className="text-xs text-red-600 mt-1">{errors.bhk}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Offer Price <span className="text-red-600">*</span>
              </label>
              <input
                type="number"
                value={form.offerPrice}
                onChange={(e) => setField("offerPrice", e.target.value)}
                className={inputClass("offerPrice")}
                min={0}
              />
              {errors.offerPrice && <p className="text-xs text-red-600 mt-1">{errors.offerPrice}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Estimated Market Value <span className="text-red-600">*</span>
              </label>
              <input
                type="number"
                value={form.estimatedMarketValue}
                onChange={(e) => setField("estimatedMarketValue", e.target.value)}
                className={inputClass("estimatedMarketValue")}
                min={0}
              />
              {errors.estimatedMarketValue && <p className="text-xs text-red-600 mt-1">{errors.estimatedMarketValue}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Location <span className="text-red-600">*</span>
              </label>
              <input
                value={form.location}
                onChange={(e) => setField("location", e.target.value)}
                className={inputClass("location")}
              />
              {errors.location && <p className="text-xs text-red-600 mt-1">{errors.location}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                District <span className="text-red-600">*</span>
              </label>
              <input
                value={form.district}
                onChange={(e) => setField("district", e.target.value)}
                className={inputClass("district")}
              />
              {errors.district && <p className="text-xs text-red-600 mt-1">{errors.district}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Possession <span className="text-red-600">*</span>
              </label>
              <select
                value={form.possession}
                onChange={(e) => setField("possession", e.target.value)}
                className={inputClass("possession")}
              >
                <option value="">Select Possession</option>
                {possessionOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
              {errors.possession && <p className="text-xs text-red-600 mt-1">{errors.possession}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Status <span className="text-red-600">*</span>
              </label>
              <select
                value={form.status}
                onChange={(e) => setField("status", e.target.value)}
                className={inputClass("status")}
              >
                <option value="">Select Status</option>
                {statusOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
              {errors.status && <p className="text-xs text-red-600 mt-1">{errors.status}</p>}
            </div>

            {form.type === "Auction" ? (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  EMD Date <span className="text-red-600">*</span>
                </label>
                <input
                  type="date"
                  value={form.emdDate}
                  onChange={(e) => setField("emdDate", e.target.value)}
                  className={inputClass("emdDate")}
                />
                {errors.emdDate && <p className="text-xs text-red-600 mt-1">{errors.emdDate}</p>}
              </div>
            ) : null}

            {form.type === "Distress" ? (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  EOI Date <span className="text-red-600">*</span>
                </label>
                <input
                  type="date"
                  value={form.eoiDate}
                  onChange={(e) => setField("eoiDate", e.target.value)}
                  className={inputClass("eoiDate")}
                />
                {errors.eoiDate && <p className="text-xs text-red-600 mt-1">{errors.eoiDate}</p>}
              </div>
            ) : null}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Flat No</label>
              <input
                value={form.flatNo}
                onChange={(e) => setField("flatNo", e.target.value)}
                className={inputClass("flatNo")}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Floor</label>
              <input
                value={form.floor}
                onChange={(e) => setField("floor", e.target.value)}
                className={inputClass("floor")}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Full Address <span className="text-red-600">*</span>
              </label>
              <textarea
                value={form.fullAddress}
                onChange={(e) => setField("fullAddress", e.target.value)}
                className={inputClass("fullAddress")}
                rows={2}
              />
              {errors.fullAddress && <p className="text-xs text-red-600 mt-1">{errors.fullAddress}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Bank Name</label>
              <input
                value={form.bankName}
                onChange={(e) => setField("bankName", e.target.value)}
                className={inputClass("bankName")}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Contact Person <span className="text-red-600">*</span>
              </label>
              <input
                value={form.contactPerson}
                onChange={(e) => setField("contactPerson", e.target.value)}
                className={inputClass("contactPerson")}
              />
              {errors.contactPerson && <p className="text-xs text-red-600 mt-1">{errors.contactPerson}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Contact Number <span className="text-red-600">*</span>
              </label>
              <input
                value={form.contactNumber}
                onChange={(e) => setField("contactNumber", e.target.value.replace(/\D/g, ""))}
                className={inputClass("contactNumber")}
                maxLength={15}
              />
              {errors.contactNumber && <p className="text-xs text-red-600 mt-1">{errors.contactNumber}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Photos {mode === "create" ? <span className="text-red-600">*</span> : null}
              </label>
              {mode === "edit" && existingPhotos.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs text-slate-500 mb-2">Current photos</p>
                  <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                    {existingPhotos.map((url, index) => (
                      <div
                        key={`${url}-${index}`}
                        className="rounded-md overflow-hidden border border-slate-200"
                      >
                        <img
                          src={url}
                          alt={`Current property ${index + 1}`}
                          className="h-20 w-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                multiple
                onChange={(e) => handlePhotoChange(e.target.files)}
                className={inputClass("photos")}
              />
              {mode === "edit" && (
                <p className="text-xs text-slate-500 mt-1">
                  Upload photos only if you want to replace current photos.
                </p>
              )}
              {photoError && <p className="text-xs text-red-600 mt-1">{photoError}</p>}
              {errors.photos && <p className="text-xs text-red-600 mt-1">{errors.photos}</p>}

              {previewUrls.length > 0 && (
                <div className="mt-3 grid grid-cols-3 md:grid-cols-5 gap-3">
                  {previewUrls.map((url, index) => (
                    <div key={`${url}-${index}`} className="relative rounded-md overflow-hidden border border-slate-200">
                      <img src={url} alt={`Property ${index + 1}`} className="h-20 w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        className="absolute top-1 right-1 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Property PDF Document</label>
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setPdfDocument(e.target.files?.[0] || null)}
                className={inputClass("pdfDocument")}
              />
              {pdfDocument ? (
                <p className="text-xs text-slate-500 mt-1">Selected: {pdfDocument.name}</p>
              ) : null}
              <p className="text-xs text-slate-500 mt-1">Optional. Upload PDF for property document.</p>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 rounded-md bg-[#D6B549] text-slate-900 font-medium hover:brightness-95"
            >
              {isSubmitting
                ? mode === "edit"
                  ? "Saving..."
                  : "Posting..."
                : mode === "edit"
                ? "Save Changes"
                : "Post Property"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostPropertyModal;
