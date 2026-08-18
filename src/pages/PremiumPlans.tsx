import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Crown, Check, ArrowLeft, Zap, Loader2 } from "lucide-react";
import { Helmet } from "react-helmet-async";
import axios from "axios";
import Cookie from "js-cookie";
import { toast } from "react-toastify";
import { openLoginModal } from "@/lib/loginModal";
import { getLoggedInEmail } from "@/lib/favourites";

interface PlanVariant {
  id: string;
  label: string;
  savings: string;
  popular?: boolean;
}

interface ProductOption {
  id: string;
  label: string;
  description: string;
  prices: Record<string, number>;
  perMonth: Record<string, number>;
}

const GST_RATE = 0.18;

const plans: PlanVariant[] = [
  { id: "1m", label: "1 Month", savings: "" },
  { id: "3m", label: "3 Months", savings: "Save 20%" },
  { id: "1y", label: "1 Year", savings: "Save 40%", popular: true },
];

const products: ProductOption[] = [
  {
    id: "auction",
    label: "Auction Property",
    description: "Access bank-seized & auction property details",
    prices: { "1m": 2499, "3m": 4999, "1y": 14999 },
    perMonth: { "1m": 2499, "3m": 1666, "1y": 1250 },
  },
  {
    id: "alternate-investment",
    label: "Alternate Investment",
    description: "Access distressed & alternate investment properties",
    prices: { "1m": 2499, "3m": 4999, "1y": 14999 },
    perMonth: { "1m": 2499, "3m": 1666, "1y": 1250 },
  },
  {
    id: "new-resale",
    label: "New / Resale Property",
    description: "Access new & resale property details",
    prices: { "1m": 2499, "3m": 4999, "1y": 14999 },
    perMonth: { "1m": 2499, "3m": 1666, "1y": 1250 },
  },
  {
    id: "all",
    label: "All Products",
    description: "Club all features — access everything",
    prices: { "1m": 4999, "3m": 8999, "1y": 24999 },
    perMonth: { "1m": 4999, "3m": 3000, "1y": 2083 },
  },
];

const features = [
  "Unlock full property details (address, contact, inspection dates)",
  "Access exclusive bank-seized & distressed property listings",
  "Download property documents & sale notices",
  "Direct contact with banks & builders",
  "Priority site inspection booking",
  "Save unlimited favourites",
  "Early access to new listings",
  "Dedicated support team",
];

const PremiumPlans = () => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<string>("1y");
  const [selectedProduct, setSelectedProduct] = useState<string>("all");
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [promoCodes, setPromoCodes] = useState<{ code: string; discountType: string; discountValue: number }[]>([]);
  const [selectedPromo, setSelectedPromo] = useState<string>("");
  const [discountAmount, setDiscountAmount] = useState(0);

  const selectedPlanData = plans.find((p) => p.id === selectedPlan);
  const selectedProductData = products.find((p) => p.id === selectedProduct);
  const basePrice = selectedProductData?.prices[selectedPlan] || 0;
  const perMonthPrice = selectedProductData?.perMonth[selectedPlan] || 0;
  const gstAmount = basePrice * GST_RATE;
  const totalPayable = basePrice - discountAmount + gstAmount;

  const loadPromoCodes = useCallback(async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URI}promocodes`);
      const now = new Date();
      const active = (res.data?.payload || []).filter((p: any) => {
        if (!p.isActive) return false;
        if (p.startDate && now < new Date(p.startDate)) return false;
        if (p.endDate && now > new Date(p.endDate)) return false;
        return true;
      });
      setPromoCodes(active.map((p: any) => ({ code: p.code, discountType: p.discountType, discountValue: p.discountValue })));
    } catch {
      setPromoCodes([]);
    }
  }, []);

  useEffect(() => {
    loadPromoCodes();
  }, [loadPromoCodes]);

  useEffect(() => {
    if (!selectedPromo) {
      setDiscountAmount(0);
      return;
    }
    const promo = promoCodes.find((p) => p.code === selectedPromo);
    if (!promo) {
      setDiscountAmount(0);
      return;
    }
    if (promo.discountType === "percentage") {
      setDiscountAmount(Math.round((basePrice * promo.discountValue) / 100));
    } else {
      setDiscountAmount(Math.min(promo.discountValue, basePrice));
    }
  }, [selectedPromo, basePrice, promoCodes]);

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (document.getElementById("razorpay-checkout-script")) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.id = "razorpay-checkout-script";
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => {
        document.getElementById("razorpay-checkout-script")?.remove();
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const verifyWithRetry = async (paymentData: any, email: string, retries = 2): Promise<boolean> => {
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const verifyRes = await axios.post(
          `${import.meta.env.VITE_API_URI}payments/verify`,
          {
            razorpay_order_id: paymentData.razorpay_order_id,
            razorpay_payment_id: paymentData.razorpay_payment_id,
            razorpay_signature: paymentData.razorpay_signature,
            planId: selectedPlan,
            product: selectedProduct,
          },
          {
            headers: { "x-user-email": email },
            withCredentials: true,
            timeout: 15000,
          }
        );

        if (verifyRes.data.status) {
          const msg = verifyRes.data.invoiceEmailSent
            ? "Payment successful! Premium activated. An invoice has been sent to your email."
            : verifyRes.data.message || "Payment successful! Premium activated.";
          toast.success(msg);
          return true;
        }

        if (verifyRes.data.alreadyVerified) {
          toast.success("Your premium subscription is already active.");
          return true;
        }

        if (attempt < retries) {
          await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
          continue;
        }

        toast.error(verifyRes.data.message || "Payment verification failed. Please contact support.");
        return false;
      } catch (err: any) {
        if (attempt < retries) {
          await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
          continue;
        }

        const apiMsg = err?.response?.data?.message;
        if (err?.response?.status === 409 && err?.response?.data?.alreadyVerified) {
          toast.success("Your premium subscription is already active.");
          return true;
        }
        toast.error(apiMsg || "Payment verification failed. Please contact support with your payment ID.");
        return false;
      }
    }
    return false;
  };

  const handleSubscribe = async () => {
    const email = getLoggedInEmail();
    if (!email) {
      openLoginModal();
      return;
    }

    if (loading || verifying) return;

    setLoading(true);

    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error("Failed to load payment gateway. Please check your internet connection and try again.");
        setLoading(false);
        return;
      }

      let orderData;
      try {
        const { data } = await axios.post(
          `${import.meta.env.VITE_API_URI}payments/create-order`,
          { planId: selectedPlan, product: selectedProduct, ...(selectedPromo ? { promoCode: selectedPromo } : {}) },
          {
            headers: { "x-user-email": email },
            withCredentials: true,
            timeout: 15000,
          }
        );

        if (!data.status) {
          if (data.premium) {
            toast.info("You already have an active premium subscription.");
          } else {
            toast.error(data.message || "Failed to create order. Please try again.");
          }
          setLoading(false);
          return;
        }
        orderData = data;
      } catch (err: any) {
        const apiMsg = err?.response?.data?.message;
        if (err?.response?.status === 409) {
          toast.info(apiMsg || "You already have an active premium subscription.");
        } else {
          toast.error(apiMsg || "Failed to create payment order. Please try again.");
        }
        setLoading(false);
        return;
      }

      const { order, planLabel, productLabel, keyId } = orderData;
      const cookieValue = Cookie.get("finvest") || "";
      const mobile = cookieValue ? cookieValue.split("$")[1] || "" : "";

      const options = {
        key: keyId,
        amount: order.amount,
        currency: order.currency,
        name: "FINVESTCORP",
        description: `Premium Subscription - ${productLabel} (${planLabel})`,
        order_id: order.id,
        prefill: {
          email,
          contact: mobile,
        },
        theme: {
          color: "#0F172A",
        },
        handler: async (response: any) => {
          if (!response?.razorpay_payment_id) {
            toast.error("Payment was not completed. Please try again.");
            setLoading(false);
            return;
          }

          setVerifying(true);
          const success = await verifyWithRetry(response, email);
          setVerifying(false);
          setLoading(false);

          if (success) {
            setTimeout(() => {
              navigate(-1);
            }, 2000);
          }
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);

      rzp.on("payment.failed", (response: any) => {
        const reason = response?.error?.description || response?.error?.reason || "Payment failed";
        toast.error(`${reason}. Please try again.`);
        setLoading(false);
      });

      rzp.open();
    } catch (error) {
      console.error("Subscription error:", error);
      toast.error("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Premium Plans | FINVESTCORP</title>
        <meta name="description" content="Unlock premium property details with FINVESTCORP premium plans." />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <div className="text-center mb-10">
           
            <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-3">
              Upgrade to Premium
            </h1>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Unlock locked property details, download documents, and get direct access to bank contacts.
              Choose your product and plan.
            </p>
          </div>

          {/* Top section: Selectors on left, price box on right */}
          <div className="grid lg:grid-cols-3 gap-8 items-start mb-10">
            {/* Left side: Product, Plan selectors and Features */}
            <div className="lg:col-span-2 space-y-10">
              <div>
                <h2 className="text-lg font-bold text-blue-900 mb-4">Select Product</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                  {products.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => setSelectedProduct(product.id)}
                      className={`relative text-left p-3 rounded-xl font-semibold transition-all border-2 h-full ${
                        selectedProduct === product.id
                          ? "border-blue-900 bg-blue-50 text-blue-900 shadow-md"
                          : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                      }`}
                    >
                      <span className="block text-[13px] font-bold leading-tight">{product.label}</span>
                      <span className="block text-[10px] font-normal text-slate-500 mt-1 leading-tight">{product.description}</span>
                      {product.id === "all" && (
                        <span className="absolute top-0.5 right-0.5 bg-finance-gold text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full">
                          BEST
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-lg font-bold text-blue-900 mb-4">Choose Your Plan</h2>
                <div className="flex gap-2">
                  {plans.map((plan) => (
                    <button
                      key={plan.id}
                      onClick={() => setSelectedPlan(plan.id)}
                      className={`relative w-full text-left py-4 rounded-xl font-semibold transition-all border-2 ${
                        selectedPlan === plan.id
                          ? "border-blue-900 bg-blue-50 text-blue-900 shadow-md"
                          : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex flex-col items-center justify-between">
                        <span className="text-sm">{plan.label}</span>
                        {plan.savings && (
                          <span className={`block text-[10px] font-medium mt-0.5 ${selectedPlan === plan.id ? "text-finance-gold" : "text-emerald-600"}`}>
                            {plan.savings}
                          </span>
                        )}
                      </div>
                      {plan.popular && (
                        <span className="absolute top-0.5 right-0.5 bg-finance-gold text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full">
                          POPULAR
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Features list moved to left side */}
              <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6">
                <h2 className="text-lg font-bold text-blue-900 mb-6">What's Included</h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                  {features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                        <Check className="w-3 h-3 text-blue-900" />
                      </span>
                      <span className="text-slate-700 text-[13px] font-medium leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right side: Price summary card */}
            <div className="lg:sticky lg:top-6">
              <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-900 to-blue-800 px-6 py-5 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold">{selectedProductData?.label}</h3>
                      <p className="text-blue-100 text-xs mt-1">{plans.find((p) => p.id === selectedPlan)?.label} plan</p>
                    </div>
                    <Crown className="w-8 h-8 text-finance-gold" />
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-3xl font-bold text-blue-900">
                      ₹{basePrice.toLocaleString("en-IN")}
                    </span>
                    <span className="text-slate-500 text-sm">
                      / {plans.find((p) => p.id === selectedPlan)?.label.toLowerCase()}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 mb-4">
                    ≈ ₹{perMonthPrice.toLocaleString("en-IN")}/month
                  </p>

                  <div className="space-y-1.5 mb-6 border-t border-slate-100 pt-4">
                    <div className="flex justify-between text-sm text-slate-600">
                      <span>Base Price</span>
                      <span>₹{basePrice.toLocaleString("en-IN")}</span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex justify-between text-sm text-emerald-600">
                        <span>Discount</span>
                        <span>-₹{discountAmount.toLocaleString("en-IN")}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm text-slate-600">
                      <span>GST (18%)</span>
                      <span>₹{gstAmount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between text-base font-bold text-blue-900 pt-1.5 border-t border-slate-100">
                      <span>Total Payable</span>
                      <span>₹{totalPayable.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                  </div>

                  {promoCodes.length > 0 && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-slate-700 mb-1">Promo Code</label>
                      <select
                        value={selectedPromo}
                        onChange={(e) => setSelectedPromo(e.target.value)}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#D6B549] text-sm"
                      >
                        <option value="">Select a promo code (optional)</option>
                        {promoCodes.map((promo) => (
                          <option key={promo.code} value={promo.code}>
                            {promo.code} — {promo.discountType === "percentage" ? `${promo.discountValue}% off` : `₹${promo.discountValue} off`}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <button
                    onClick={handleSubscribe}
                    disabled={loading || verifying}
                    className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-900 to-blue-800 text-white px-6 py-3.5 rounded-xl font-bold hover:from-blue-800 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading || verifying ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        {verifying ? "Verifying..." : "Processing..."}
                      </>
                    ) : (
                      <>
                        <Zap className="w-5 h-5" />
                        Subscribe Now
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PremiumPlans;
