import { PropertyRecord } from "./PostPropertyModal";
import { X, Calendar, MapPin, Building2, Phone, User, Landmark, Layers, Home } from "lucide-react";

interface PropertyViewModalProps {
  open: boolean;
  onClose: () => void;
  property: PropertyRecord | null;
}

const formatValue = (value: any) => value || "-";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value || 0);

const formatDate = (iso: string | undefined) => {
  if (!iso) return "-";
  const date = new Date(iso);
  if (isNaN(date.getTime())) return "-";
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const PropertyViewModal = ({ open, onClose, property }: PropertyViewModalProps) => {
  if (!open || !property) return null;

  const DetailRow = ({ icon: Icon, label, value, fullWidth = false }: any) => (
    <div className={`flex flex-col p-3 bg-slate-50 rounded-lg border border-slate-100 ${fullWidth ? "md:col-span-2" : ""}`}>
      <div className="flex items-center gap-2 text-slate-500 text-xs font-medium uppercase tracking-wider mb-1">
        <Icon size={14} />
        {label}
      </div>
      <div className="text-slate-900 font-semibold break-words">
        {value}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-white rounded-xl shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-slate-900 leading-tight">
              {property.headline}
            </h3>
            <p className="text-slate-500 text-sm font-medium">Property Details • {property.propertyId}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Images Section */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-4">Property Photos</h4>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {property.photos?.length > 0 ? (
                property.photos.map((photo: any, idx: number) => (
                  <div key={idx} className="aspect-square rounded-lg overflow-hidden border border-slate-200 bg-slate-50">
                    <img 
                      src={typeof photo === 'string' ? photo : photo.url} 
                      alt={`Property ${idx + 1}`}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                ))
              ) : (
                <div className="col-span-full py-8 text-center bg-slate-50 rounded-lg border border-dashed border-slate-300 text-slate-400">
                  No photos available
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
                <Home size={16} className="text-blue-600" />
                Basic Information
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <DetailRow icon={Layers} label="Listing Type" value={property.type} />
                <DetailRow icon={Home} label="Property Type" value={property.propertyType} />
                <DetailRow icon={Layers} label="Configuration" value={property.bhk} />
                <DetailRow icon={Layers} label="Area" value={property.area} />
                <DetailRow icon={Layers} label="Floor" value={formatValue(property.floor)} />
                <DetailRow icon={Layers} label="Possession" value={property.possession} />
                <DetailRow icon={Layers} label="Status" value={property.status} />
              </div>
            </div>

            {/* Pricing Info */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
                <Landmark size={16} className="text-emerald-600" />
                Pricing
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <DetailRow icon={Landmark} label="Offer Price" value={formatCurrency(property.offerPrice)} />
                <DetailRow icon={Landmark} label="Market Value" value={formatCurrency(property.estimatedMarketValue)} />
              </div>
            </div>

            {/* Location Info */}
            <div className="space-y-4 md:col-span-2">
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
                <MapPin size={16} className="text-red-600" />
                Location & Address
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <DetailRow icon={MapPin} label="Location" value={property.location} />
                <DetailRow icon={MapPin} label="District" value={property.district} />
                <DetailRow icon={MapPin} label="Flat/Shop No" value={formatValue(property.flatNo)} />
                <DetailRow icon={MapPin} label="Full Address" value={property.fullAddress} fullWidth />
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
                <User size={16} className="text-indigo-600" />
                Contact Information
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <DetailRow icon={Building2} label={property.type === "Distress" ? "Builder" : "Bank"} value={formatValue(property.bankName)} />
                <DetailRow icon={User} label="Contact Person" value={property.contactPerson} />
                <DetailRow icon={Phone} label="Contact Number" value={property.contactNumber} />
              </div>
            </div>

            {/* Timings Info */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
                <Calendar size={16} className="text-orange-600" />
                Schedule & Timings
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <DetailRow icon={Calendar} label="Inspection Time" value={formatDate(property.inspectionDateTime)} />
                <DetailRow icon={Calendar} label="Posting Time" value={formatDate(property.postingDateTime)} />
                <DetailRow icon={Calendar} label={property.type === "Auction" ? "EMD Date" : "EOI Date"} value={formatDate(property.type === "Auction" ? property.emdDate : property.eoiDate)} />
              </div>
            </div>

            {/* Highlights */}
            {property.highlights && property.highlights.trim() ? (
              <div className="space-y-4 md:col-span-2">
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest">
                  Highlights
                </h4>
                <ul className="space-y-2">
                  {property.highlights
                    .split("\n")
                    .map((line) => line.trim())
                    .filter(Boolean)
                    .map((line, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-slate-800">
                        <span className="text-blue-600 font-bold mt-0.5">•</span>
                        <span>{line}</span>
                      </li>
                    ))}
                </ul>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyViewModal;
