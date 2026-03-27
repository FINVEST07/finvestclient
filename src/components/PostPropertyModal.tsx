import { useEffect, useMemo, useState, useRef } from "react";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";

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

export interface PropertyRecord {
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
  photos: string[];
  createdAt: string;
}

export interface PropertyFormPayload {
  propertyName: string;
  area: string;
  type: PropertyListingType;
  floor: string;
  propertyType: PropertyTypeOption;
  address: string;
  phoneNumber: string;
  price: number;
  description: string;
  photos: File[];
}

export interface PropertyFormInitialValues {
  propertyName: string;
  area: string;
  type: PropertyListingType | "";
  floor: string;
  propertyType: PropertyTypeOption | "";
  address: string;
  phoneNumber: string;
  price: string;
  description: string;
}

interface PostPropertyModalProps {
  open: boolean;
  onClose: () => void;
  mode?: "create" | "edit";
  initialValues?: PropertyFormInitialValues | null;
  existingPhotos?: string[];
  onSubmit: (payload: PropertyFormPayload) => void | Promise<void>;
}

type FieldErrors = Partial<Record<keyof Omit<PropertyRecord, "propertyId" | "createdAt" | "photos"> | "photos", string>>;

const listingTypeOptions: PropertyListingType[] = ["Auction", "Distress"];
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

const initialState = {
  propertyName: "",
  area: "",
  type: "" as "" | PropertyListingType,
  floor: "",
  propertyType: "" as "" | PropertyTypeOption,
  address: "",
  phoneNumber: "",
  price: "",
  description: "",
};

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link"],
    [{ align: [] }],
    ["clean"],
  ],
};

const quillFormats = [
  "header",
  "bold",
  "italic",
  "list",
  "bullet",
  "link",
  "align",
];

const getRichTextPlainValue = (html: string) =>
  html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .trim();

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [photoError, setPhotoError] = useState<string>("");

  const { quill, quillRef } = useQuill({ modules: quillModules });

  // Sync quill content to form state
  useEffect(() => {
    if (quill) {
      quill.on("text-change", () => {
        setField("description", quill.root.innerHTML);
      });
    }
  }, [quill]);

  // Set quill content when editing
  useEffect(() => {
    if (quill && form.description && open) {
      quill.root.innerHTML = form.description;
    }
  }, [quill, form.description, open]);

  useEffect(() => {
    if (!open) {
      setForm(initialState);
      setPhotos([]);
      setIsSubmitting(false);
      setErrors({});
      setPhotoError("");
      return;
    }

    if (mode === "edit" && initialValues) {
      setForm({
        propertyName: initialValues.propertyName || "",
        area: initialValues.area || "",
        type: (initialValues.type as "" | PropertyListingType) || "",
        floor: initialValues.floor || "",
        propertyType:
          (initialValues.propertyType as "" | PropertyTypeOption) || "",
        address: initialValues.address || "",
        phoneNumber: initialValues.phoneNumber || "",
        price: initialValues.price || "",
        description: initialValues.description || "",
      });
      setPhotos([]);
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

    if (!form.propertyName.trim()) nextErrors.propertyName = "Property / Society Name is required";
    if (!form.area.trim()) nextErrors.area = "Area is required";
    if (!form.type) nextErrors.type = "Type is required";
    if (!form.propertyType) nextErrors.propertyType = "Property Type is required";
    if (!form.address.trim()) nextErrors.address = "Address is required";
    if (!form.phoneNumber.trim()) nextErrors.phoneNumber = "Phone Number is required";
    if (form.phoneNumber && !/^\d{10,15}$/.test(form.phoneNumber.trim())) {
      nextErrors.phoneNumber = "Phone Number must be numeric (10-15 digits)";
    }

    if (!form.price.trim()) nextErrors.price = "Price is required";
    if (form.price && Number(form.price) <= 0) nextErrors.price = "Price must be greater than 0";
    if (!getRichTextPlainValue(form.description)) {
      nextErrors.description = "Description is required";
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
        propertyName: form.propertyName.trim(),
        area: form.area.trim(),
        type: form.type as PropertyListingType,
        floor: form.floor.trim(),
        propertyType: form.propertyType as PropertyTypeOption,
        address: form.address.trim(),
        phoneNumber: form.phoneNumber.trim(),
        price: Number(form.price),
        description: form.description.trim(),
        photos,
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
                Property / Society Name <span className="text-red-600">*</span>
              </label>
              <input
                value={form.propertyName}
                onChange={(e) => setField("propertyName", e.target.value)}
                className={inputClass("propertyName")}
              />
              {errors.propertyName && <p className="text-xs text-red-600 mt-1">{errors.propertyName}</p>}
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
                    {opt}
                  </option>
                ))}
              </select>
              {errors.type && <p className="text-xs text-red-600 mt-1">{errors.type}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Floor
              </label>
              <input
                value={form.floor}
                onChange={(e) => setField("floor", e.target.value)}
                className={inputClass("floor")}
              />
              {errors.floor && <p className="text-xs text-red-600 mt-1">{errors.floor}</p>}
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
                Phone Number <span className="text-red-600">*</span>
              </label>
              <input
                value={form.phoneNumber}
                onChange={(e) => setField("phoneNumber", e.target.value.replace(/\D/g, ""))}
                className={inputClass("phoneNumber")}
                maxLength={15}
              />
              {errors.phoneNumber && <p className="text-xs text-red-600 mt-1">{errors.phoneNumber}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Address <span className="text-red-600">*</span>
              </label>
              <textarea
                value={form.address}
                onChange={(e) => setField("address", e.target.value)}
                className={inputClass("address")}
                rows={2}
              />
              {errors.address && <p className="text-xs text-red-600 mt-1">{errors.address}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Price <span className="text-red-600">*</span>
              </label>
              <input
                type="number"
                value={form.price}
                onChange={(e) => setField("price", e.target.value)}
                className={inputClass("price")}
                min={0}
              />
              {errors.price && <p className="text-xs text-red-600 mt-1">{errors.price}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Description <span className="text-red-600">*</span>
              </label>
              <div
                className={`property-description-quill border rounded-md ${
                  errors.description ? "border-red-500" : "border-slate-300"
                }`}
              >
                <div ref={quillRef} />
              </div>
              <style>{`
                .property-description-quill .ql-container { height: 180px; overflow-y: auto; }
              `}</style>
              {errors.description && <p className="text-xs text-red-600 mt-1">{errors.description}</p>}
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
