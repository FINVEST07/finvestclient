import { Helmet } from "react-helmet-async";
import { ArrowLeft, Cookie, Info, Settings, Layers, SlidersHorizontal, ExternalLink, RefreshCw, Mail, ShieldCheck } from "lucide-react";

const cookieTypes = [
  {
    label: "Essential / Authentication Cookie",
    desc: "The 'finvest' cookie stores your email and mobile number (in the format email$mobile) to keep you logged in across sessions. It expires after 365 days. Without this cookie, you would need to log in again on every page visit.",
    color: "border-red-100 bg-red-50/40",
    dot: "bg-red-500",
  },
  {
    label: "Local Storage — Admin Rank",
    desc: "For admin users, your role rank is stored in the browser's local storage to control access to the admin dashboard and administrative features. This is not a cookie and persists until you clear browser data or log out.",
    color: "border-blue-100 bg-blue-50/40",
    dot: "bg-blue-500",
  },
  {
    label: "Session Preferences",
    desc: "Your selected service type, property filter preferences, and form data (such as city autocomplete) may be temporarily retained in the browser during your session to improve usability.",
    color: "border-green-100 bg-green-50/40",
    dot: "bg-green-500",
  },
  {
    label: "No Analytics or Marketing Cookies",
    desc: "We currently do not use Google Analytics, advertising cookies, or third-party tracking cookies. If we add these in the future, we will update this policy and seek your consent where required.",
    color: "border-amber-100 bg-amber-50/40",
    dot: "bg-amber-500",
  },
];

const sections = [
  {
    icon: Info,
    title: "1. What Are Cookies?",
    body: (
      <p className="text-slate-600 leading-relaxed">
        Cookies are small text files stored on your device (computer, tablet, or mobile) when you visit a website. They allow the website to recognize your device and remember your preferences, actions, and settings over a period of time. Cookies are widely used to make websites work more efficiently and to provide a better user experience.
      </p>
    ),
  },
  {
    icon: Cookie,
    title: "2. Cookies We Use",
    body: (
      <>
        <p className="text-slate-600 leading-relaxed mb-4">
          FINVESTCORP uses a minimal set of cookies and local storage items to operate our website:
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          {cookieTypes.map((item) => (
            <div key={item.label} className={`rounded-xl border p-4 ${item.color}`}>
              <div className="flex items-center gap-2 mb-2">
                <span className={`h-2 w-2 rounded-full ${item.dot}`} />
                <p className="font-semibold text-slate-800 text-sm">{item.label}</p>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </>
    ),
  },
  {
    icon: Layers,
    title: "3. Third-Party Services & Cookies",
    body: (
      <>
        <p className="text-slate-600 leading-relaxed mb-4">
          While we do not set third-party tracking cookies, some of our service providers may set their own cookies when you interact with their embedded components:
        </p>
        <div className="space-y-3">
          {[
            { label: "Razorpay (Payment Gateway)", desc: "When you purchase a Premium subscription, Razorpay's checkout may set cookies on your device for fraud prevention and session management. Razorpay is PCI-DSS compliant and handles your payment data securely." },
            { label: "Cloudinary (Cloud Storage)", desc: "Images and documents served from Cloudinary may use CDN cookies for caching and performance optimization. No personal data is tracked." },
            { label: "Resend (Email Service)", desc: "Resend is used server-side only to send you emails. No cookies are set on your browser by Resend." },
            { label: "WhatsApp (Whatsapper API)", desc: "WhatsApp notifications are sent server-side. The WhatsApp chat link in our footer opens WhatsApp's website, which may set its own cookies subject to WhatsApp's privacy policy." },
          ].map((item) => (
            <div key={item.label} className="flex items-start gap-3 rounded-lg border border-slate-200 bg-white p-4">
              <span className="mt-0.5 h-2 w-2 rounded-full bg-amber-500 flex-shrink-0" />
              <div>
                <p className="font-semibold text-slate-800 text-sm">{item.label}</p>
                <p className="text-slate-500 text-sm leading-relaxed mt-1">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </>
    ),
  },
  {
    icon: SlidersHorizontal,
    title: "4. Managing Cookies",
    body: (
      <>
        <p className="text-slate-600 leading-relaxed mb-4">
          You can control and manage cookies through your browser settings. Most browsers allow you to:
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            "Accept or reject all cookies.",
            "Block cookies from specific websites.",
            "Delete existing cookies from your device.",
            "Set preferences for first-party and third-party cookies.",
            "Clear local storage data (for admin rank and session data).",
            "Browse in incognito/private mode to prevent cookie storage.",
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-3">
              <Settings className="h-4 w-4 text-slate-400 flex-shrink-0" />
              <span className="text-slate-600 text-sm">{item}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 rounded-lg bg-amber-50 border border-amber-200 p-4">
          <p className="text-slate-600 text-sm leading-relaxed">
            <strong className="text-slate-800">Important:</strong> If you delete or block the "finvest" cookie, you will be logged out and will need to re-authenticate using OTP or password to access your dashboard, applications, favourites, and premium features.
          </p>
        </div>
      </>
    ),
  },
  {
    icon: ShieldCheck,
    title: "5. Cookie Security",
    body: (
      <p className="text-slate-600 leading-relaxed">
        The "finvest" cookie stores only your email and mobile number — it does not contain your password or sensitive financial data. Authentication is validated server-side on each request. OTP codes are generated server-side, expire within 2 minutes, and are never stored in cookies. All data transmission is encrypted via HTTPS.
      </p>
    ),
  },
  {
    icon: ExternalLink,
    title: "6. Third-Party Cookie Policies",
    body: (
      <p className="text-slate-600 leading-relaxed">
        We recommend reviewing the cookie and privacy policies of our third-party providers for more information on how they handle cookies:
      </p>
    ),
  },
  {
    icon: RefreshCw,
    title: "7. Changes to This Policy",
    body: (
      <p className="text-slate-600 leading-relaxed">
        We may update this Cookie Policy from time to time to reflect changes in technology, legislation, or our practices — for example, if we add analytics or advertising cookies in the future. Any changes will be posted on this page with an updated revision date.
      </p>
    ),
  },
  {
    icon: Mail,
    title: "8. Contact Us",
    body: (
      <div className="rounded-xl bg-gradient-to-br from-blue-900 to-blue-800 p-6 text-white">
        <p className="leading-relaxed text-white/90 mb-4">
          If you have any questions about this Cookie Policy or our use of cookies, please contact us at:
        </p>
        <div className="space-y-1.5 text-white/80 text-sm">
          <p className="font-semibold text-white">FINVESTCORP (RISEHIGH FINCON CONSULTANCY PVT. LTD)</p>
          <p>Andheri West, Mumbai - 400058</p>
          <p>
            Email:{" "}
            <a href="mailto:officefinvestcorp@gmail.com" className="text-amber-300 hover:underline">
              officefinvestcorp@gmail.com
            </a>
          </p>
          <p>
            Phone:{" "}
            <a href="tel:+919324592709" className="text-amber-300 hover:underline">
              +91 9324592709
            </a>
            {" / "}
            <a href="tel:+919892204806" className="text-amber-300 hover:underline">
              +91 9892204806
            </a>
          </p>
        </div>
      </div>
    ),
  },
];

const CookiePolicy = () => (
  <section className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50/30">
    <Helmet>
      <title>Cookie Policy - FINVESTCORP</title>
      <meta
        name="description"
        content="Read the FINVESTCORP Cookie Policy to understand how we use cookies and local storage on our financial advisory website."
      />
    </Helmet>

    <div className="container-custom max-w-5xl py-12 px-4">
      <a
        href="/"
        className="inline-flex items-center gap-2 text-blue-900 hover:text-blue-700 font-medium transition-colors mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Home
      </a>

      <div className="rounded-3xl bg-white shadow-xl border border-slate-100 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-900 to-blue-800 px-8 py-10 md:px-12 md:py-12">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-12 w-12 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center">
              <Cookie className="h-6 w-6 text-amber-300" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">Cookie Policy</h1>
          </div>
          <p className="text-white/60 text-sm">Last updated: July 2026</p>
        </div>

        <div className="px-8 py-10 md:px-12 md:py-12 space-y-8">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <div key={section.title}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-9 w-9 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <Icon className="h-4 w-4 text-blue-700" />
                  </div>
                  <h2 className="text-lg font-semibold text-slate-800">{section.title}</h2>
                </div>
                <div className="pl-12">{section.body}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  </section>
);

export default CookiePolicy;
