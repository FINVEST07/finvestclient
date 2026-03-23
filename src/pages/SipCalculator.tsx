import { useState, useEffect, useRef } from "react";
import type { ChangeEvent, KeyboardEvent } from "react";
import { ArrowLeft, Calculator, LineChart, Target, ShieldCheck } from "lucide-react";

const formatCurrency = (val: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(val);

const formatShort = (val: number) => formatCurrency(val);

function AnimatedNumber({
  value,
  duration = 800,
}: {
  value: number;
  duration?: number;
}) {
  const [display, setDisplay] = useState<number>(value);
  const ref = useRef<number>(value);
  const frame = useRef<number | null>(null);

  useEffect(() => {
    const start = ref.current;
    const end = value;
    const startTime = performance.now();
    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(start + (end - start) * eased));
      if (progress < 1) frame.current = requestAnimationFrame(animate);
      else ref.current = end;
    };
    frame.current = requestAnimationFrame(animate);
    return () => {
      if (frame.current != null) cancelAnimationFrame(frame.current);
    };
  }, [value, duration]);

  return <span>{formatShort(display)}</span>;
}

function Slider({
  label,
  min,
  max,
  step,
  value,
  onChange,
  unit,
  prefix,
}: {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (val: number) => void;
  unit?: string;
  prefix?: string;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  const [inputVal, setInputVal] = useState(String(value));
  const [focused, setFocused] = useState(false);

  const formatBound = (v: number) => {
    if (prefix) return `${prefix}${new Intl.NumberFormat("en-IN").format(v)}`;
    if (unit?.includes("%")) return `${v}%`;
    if (unit === "yr") return `${v} yr${v > 1 ? "s" : ""}`;
    return unit ? `${v} ${unit}` : String(v);
  };

  useEffect(() => {
    if (!focused) setInputVal(String(value));
  }, [value, focused]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputVal(e.target.value);
  };

  const handleInputBlur = () => {
    setFocused(false);
    const parsed = parseFloat(inputVal);
    if (!isNaN(parsed)) {
      const clamped = Math.min(max, Math.max(min, parsed));
      onChange(clamped);
      setInputVal(String(clamped));
    } else {
      setInputVal(String(value));
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") e.currentTarget.blur();
  };

  return (
    <div className="mb-8">
      <div className="flex flex-col gap-3 mb-8 sm:flex-row sm:items-center sm:justify-between">
        <span className="text-[0.90rem] font-medium text-blue-900 tracking-wide uppercase sm:max-w-[60%]">
          {label}
        </span>
        <div className="flex items-center gap-2 w-full sm:w-auto sm:justify-end">
          <div
            className={`flex items-center bg-white border rounded-lg px-3 py-2 shadow-sm transition-colors w-full sm:w-auto ${
              focused ? "border-blue-700" : "border-slate-200"
            }`}
          >
            {prefix ? <span className="mr-2 text-sm font-semibold text-slate-500">{prefix}</span> : null}
            <input
              type="number"
              value={focused ? inputVal : value}
              onChange={handleInputChange}
              onFocus={() => {
                setFocused(true);
                setInputVal(String(value));
              }}
              onBlur={handleInputBlur}
              onKeyDown={handleKeyDown}
              min={min}
              max={max}
              step={step}
              className="w-full sm:w-[120px] font-mono text-base text-slate-900 font-semibold bg-transparent border-none outline-none text-right"
            />
          </div>
          {unit ? <span className="text-sm font-medium text-slate-500">{unit}</span> : null}
        </div>
      </div>

      <div className="relative h-1.5 rounded-full bg-blue-100 cursor-pointer">
        <div
          className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-blue-900 to-finance-gold transition-[width] duration-100"
          style={{ width: `${pct}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer m-0"
        />
        <div
          className="absolute top-1/2 h-[18px] w-[18px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-900 border-[3px] border-white shadow-[0_0_12px_rgba(214,181,73,0.55)] pointer-events-none transition-[left] duration-100"
          style={{ left: `${pct}%` }}
        />
      </div>

      <div className="mt-4 flex items-center justify-between text-sm font-medium text-slate-500">
        <span>{formatBound(min)}</span>
        <span>{formatBound(max)}</span>
      </div>
    </div>
  );
}

function DonutChart({ invested, returns }: { invested: number; returns: number }) {
  const total = invested + returns;
  const r = 70, cx = 90, cy = 90, stroke = 18;
  const circ = 2 * Math.PI * r;
  const investedPct = total > 0 ? invested / total : 0.5;
  const returnsPct = total > 0 ? returns / total : 0.5;

  const [anim, setAnim] = useState(0);
  useEffect(() => {
    setAnim(0);
    const t = setTimeout(() => setAnim(1), 50);
    return () => clearTimeout(t);
  }, [invested, returns]);

  return (
    <svg viewBox="0 0 180 180" className="w-[180px] h-[180px]">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#dbeafe" strokeWidth={stroke} />
      {/* Invested segment */}
      <circle
        cx={cx} cy={cy} r={r} fill="none"
        stroke="#1e3a8a"
        strokeWidth={stroke}
        strokeDasharray={`${investedPct * circ * anim} ${circ}`}
        strokeDashoffset={0}
        strokeLinecap="butt"
        transform={`rotate(-90 ${cx} ${cy})`}
        style={{ transition: "stroke-dasharray 0.8s cubic-bezier(0.4,0,0.2,1)" }}
      />
      {/* Returns segment */}
      <circle
        cx={cx} cy={cy} r={r} fill="none"
        stroke="#D6B549"
        strokeWidth={stroke}
        strokeDasharray={`${returnsPct * circ * anim} ${circ}`}
        strokeDashoffset={-(investedPct * circ * anim)}
        strokeLinecap="butt"
        transform={`rotate(-90 ${cx} ${cy})`}
        style={{ transition: "stroke-dasharray 0.8s cubic-bezier(0.4,0,0.2,1)", transitionDelay: "0.1s" }}
      />
      <text x={cx} y={cy - 8} textAnchor="middle" fill="#64748b" fontSize="12" fontFamily="DM Sans, sans-serif" letterSpacing="0.08em">TOTAL VALUE</text>
      <text x={cx} y={cy + 10} textAnchor="middle" fill="#0f172a" fontSize="14" fontFamily="DM Mono, monospace" fontWeight="700">
        {formatCurrency(total)}
      </text>
    </svg>
  );
}

export default function SIPCalculator() {
  const [monthly, setMonthly] = useState(10000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(10);

  const months = years * 12;
  const r = rate / 100 / 12;
  const futureValue = r === 0 ? monthly * months : monthly * ((Math.pow(1 + r, months) - 1) / r) * (1 + r);
  const invested = monthly * months;
  const returns = futureValue - invested;

  return (
    <div className="min-h-screen bg-[#EBECED] p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-blue-900 hover:text-blue-800 font-medium transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </a>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-blue-100/50 overflow-hidden">
          <div className="px-6 py-5 border-b border-blue-100/50">
            <span className="text-sm font-medium text-blue-900 bg-blue-200 py-1 px-3 rounded-full">
              Investment Planner
            </span>
            <h1 className="mt-3 text-2xl md:text-3xl font-bold font-playfair text-blue-900">
              SIP <span className="text-finance-gold">Calculator</span>
            </h1>
          </div>

          <div className="p-6">
            <div className="w-full max-w-[860px] mx-auto">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-white rounded-2xl p-8 border border-blue-100 text-base font-semibold">
                  <Slider
                    label="Monthly Investment"
                    min={500}
                    max={500000}
                    step={500}
                    value={monthly}
                    onChange={setMonthly}
                    prefix="₹"
                  />
                  <Slider
                    label="Expected Return Rate"
                    min={1}
                    max={30}
                    step={0.5}
                    value={rate}
                    onChange={setRate}
                    unit="% p.a."
                  />
                  <Slider
                    label="Time Period"
                    min={1}
                    max={40}
                    step={1}
                    value={years}
                    onChange={setYears}
                    unit="yr"
                  />
                </div>

                <div className="flex flex-col gap-6">
                  <div className="bg-white rounded-2xl p-6 border border-blue-100 flex items-center justify-center gap-8">
                    <DonutChart invested={invested} returns={returns} />
                    <div className="flex flex-col gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-2.5 h-2.5 rounded-sm bg-blue-900" />
                          <span className="text-lg text-slate-500 tracking-wide uppercase">Invested</span>
                        </div>
                        <div className="font-mono text-[1rem] text-blue-900 font-semibold">
                          <AnimatedNumber value={invested} />
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-2.5 h-2.5 rounded-sm bg-finance-gold" />
                          <span className="text-lg text-slate-500 tracking-wide uppercase">Est. Returns</span>
                        </div>
                        <div className="font-mono text-[1rem] text-[#B68900] font-semibold">
                          <AnimatedNumber value={returns} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl p-6 border border-finance-gold/40 bg-gradient-to-br from-blue-900 to-blue-800">
                    <span className="text-xs text-white/80 tracking-widest uppercase">
                      Total Maturity Value
                    </span>
                    <div className="mt-1 font-mono text-2xl md:text-3xl text-white font-bold leading-tight">
                      <AnimatedNumber value={Math.round(futureValue)} />
                    </div>
                    <span className="text-sm text-finance-gold">
                      {((returns / invested) * 100).toFixed(1)}% wealth gain over {years} yr{years > 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    label: "Total Invested",
                    value: invested,
                    valueClassName: "text-blue-900",
                  },
                  {
                    label: "Estimated Returns",
                    value: returns,
                    valueClassName: "text-[#B68900]",
                  },
                  {
                    label: "Maturity Value",
                    value: Math.round(futureValue),
                    valueClassName: "text-blue-700",
                  },
                ].map(({ label, value, valueClassName }) => (
                  <div key={label} className="bg-white rounded-2xl p-5 border border-blue-100">
                    <div className="text-sm text-slate-500 tracking-wide uppercase mb-1">
                      {label}
                    </div>
                    <div className={`font-mono text-2xl font-semibold ${valueClassName}`}>
                      <AnimatedNumber value={value} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center mt-6 text-xs text-slate-500 tracking-wide">
                Returns are estimated and not guaranteed · For informational purposes only
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-10 border-t border-blue-100/70">
          <section className="bg-white rounded-2xl border border-blue-100/50 shadow-lg overflow-hidden">
            <div className="px-8 py-10">
              <h2 className="text-2xl md:text-3xl font-semibold text-blue-900 tracking-tight">
                SIP Calculator Guide
              </h2>
              <p className="mt-3 text-slate-600 leading-relaxed">
                A Systematic Investment Plan (SIP) is a simple way to invest a fixed amount into mutual funds at regular
                intervals (most commonly monthly). Many people assume SIPs and mutual funds are the same, but they’re not:
                SIP is just the method of investing, while a mutual fund is the investment product. This calculator helps you
                estimate the potential maturity value, total invested amount, and expected wealth gain based on an assumed
                return rate.
              </p>

              <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-5">
                {[
                  {
                    Icon: Target,
                    title: "Plan the right monthly amount",
                    desc: "Quickly test different monthly contributions to see what investment level matches your goal and time horizon.",
                    color: "text-[#00c6a2]",
                  },
                  {
                    Icon: LineChart,
                    title: "Understand invested vs returns",
                    desc: "See how much of your final corpus comes from your own contributions versus market-linked growth.",
                    color: "text-[#00e5ff]",
                  },
                  {
                    Icon: Calculator,
                    title: "Compare tenures instantly",
                    desc: "Adjust the time period and expected return to understand how compounding changes the outcome over time.",
                    color: "text-[#00c6a2]",
                  },
                ].map(({ Icon, title, desc, color }) => (
                  <div key={title} className="bg-white border border-blue-100 rounded-[16px] p-6">
                    <div className="flex items-start gap-3">
                      <div className={`mt-0.5 ${color}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="text-blue-900 font-semibold">{title}</div>
                        <div className="mt-2 text-slate-600 text-sm leading-relaxed">{desc}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-12">
                <h3 className="text-xl font-semibold text-blue-900">How Does the SIP Formula Work?</h3>
                <p className="mt-3 text-slate-600 leading-relaxed">
                  SIP maturity is commonly estimated using a future-value formula that assumes a fixed periodic return.
                  The formula below uses a periodic rate <span className="font-mono text-blue-900">i</span> (monthly, if you invest monthly)
                  and the total number of contributions <span className="font-mono text-blue-900">n</span>.
                </p>

                <div className="mt-4 bg-slate-50 border border-blue-100 rounded-[16px] p-6">
                  <div className="font-mono text-blue-900 text-sm whitespace-pre-wrap">
                    {`M = P × ( ((1 + i)^n − 1) / i ) × (1 + i)\n\nP = periodic investment (e.g., monthly SIP)\ni = periodic rate of return (monthly)\nn = number of payments\nM = maturity amount (estimated)`}
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-5">
                  <div className="bg-white border border-blue-100 rounded-[16px] p-6">
                    <div className="text-blue-900 font-semibold">Correct monthly rate conversion</div>
                    <p className="mt-2 text-slate-600 text-sm leading-relaxed">
                      A common mistake is to convert an annual return to monthly by doing
                      <span className="font-mono text-blue-900"> annualRate / 12 </span>.
                      That inflates results because SIP returns are typically shown as compounded.
                      If your expected return is an effective annual rate, convert it like this:
                    </p>
                    <div className="mt-4 font-mono text-blue-900 text-sm bg-slate-50 border border-blue-100 rounded-xl p-4 whitespace-pre-wrap">
                      {`monthlyRate = (1 + annualRate)^(1/12) − 1`}
                    </div>
                    <p className="mt-3 text-slate-600 text-sm leading-relaxed">
                      Example: for 12% annual return,
                      <span className="font-mono text-blue-900"> (1 + 0.12)^(1/12) − 1 ≈ 0.0095 </span>
                      (about 0.95% per month).
                    </p>
                  </div>

                  <div className="bg-white border border-blue-100 rounded-[16px] p-6">
                    <div className="text-blue-900 font-semibold">Worked example</div>
                    <p className="mt-2 text-slate-600 text-sm leading-relaxed">
                      Suppose you invest <span className="font-mono text-blue-900">₹1,000</span> per month for
                      <span className="font-mono text-blue-900"> 12 months</span> with an expected annual return of
                      <span className="font-mono text-blue-900"> 12%</span>.
                    </p>
                    <div className="mt-4 font-mono text-blue-900 text-sm bg-slate-50 border border-blue-100 rounded-xl p-4 whitespace-pre-wrap">
                      {`P = 1000\nannualRate = 0.12\ni = (1 + annualRate)^(1/12) − 1 ≈ 0.0095\nn = 12\n\nM = 1000 × ( ((1 + 0.0095)^12 − 1) / 0.0095 ) × (1 + 0.0095)\nM ≈ ₹12,766`}
                    </div>
                    <p className="mt-3 text-slate-600 text-sm leading-relaxed">
                      This is an estimate. Real mutual fund returns vary with market conditions and the fund’s costs.
                    </p>
                  </div>
                </div>

                <div className="mt-10 bg-slate-50 border border-blue-100 rounded-[16px] p-6">
                  <div className="flex items-start gap-3">
                    <div className="text-blue-900 mt-0.5">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-blue-900 font-semibold">Disclaimer</div>
                      <p className="mt-2 text-slate-600 text-sm leading-relaxed">
                        The SIP calculator provides an indicative estimate based on the inputs you choose.
                        Mutual fund returns are market-linked and not guaranteed. The calculation does not account for
                        scheme-specific factors like expense ratio, exit load, taxation, or changes in return over time.
                        Always review scheme documents and consider speaking with a qualified advisor before investing.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
