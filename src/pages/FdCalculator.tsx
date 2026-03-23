import { useState, useEffect, useRef } from "react";
import type { ChangeEvent, KeyboardEvent } from "react";
import { ArrowLeft, Banknote, TrendingUp, ShieldCheck } from "lucide-react";

const formatCurrency = (val: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(val);

function AnimatedNumber({
  value,
  duration = 700,
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
  return <span>{formatCurrency(display)}</span>;
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
  const pct = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
  const [inputVal, setInputVal] = useState(String(value));
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (!focused) setInputVal(String(value));
  }, [value, focused]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") e.currentTarget.blur();
  };

  const formatBound = (v: number) => {
    if (prefix) return `${prefix}${new Intl.NumberFormat("en-IN").format(v)}`;
    if (unit?.includes("%")) return `${v}%`;
    if (unit === "yr") return `${v} yr${v > 1 ? "s" : ""}`;
    return unit ? `${v} ${unit}` : String(v);
  };

  return (
    <div className="mb-8">
      <div className="flex flex-col gap-3 mb-8 sm:flex-row sm:items-center sm:justify-between">
        <span className="text-[0.90rem] font-medium text-blue-900 tracking-wide uppercase sm:max-w-[60%]">{label}</span>

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
              onChange={(e: ChangeEvent<HTMLInputElement>) => setInputVal(e.target.value)}
              onFocus={() => {
                setFocused(true);
                setInputVal(String(value));
              }}
              onBlur={() => {
                setFocused(false);
                const parsed = parseFloat(inputVal);
                if (!isNaN(parsed)) onChange(Math.min(max, Math.max(min, parsed)));
                else setInputVal(String(value));
              }}
              onKeyDown={handleKeyDown}
              min={min}
              max={max}
              step={step}
              className="w-full sm:w-[140px] font-mono text-base text-slate-900 font-semibold bg-transparent border-none outline-none text-right"
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

function DonutChart({ principal, interest }: { principal: number; interest: number }) {
  const total = principal + interest;
  const r = 70, cx = 90, cy = 90, stroke = 18;
  const circ = 2 * Math.PI * r;
  const pPct = total > 0 ? principal / total : 0.5;
  const iPct = total > 0 ? interest / total : 0.5;
  const [anim, setAnim] = useState(0);
  useEffect(() => {
    setAnim(0);
    const t = setTimeout(() => setAnim(1), 50);
    return () => clearTimeout(t);
  }, [principal, interest]);

  return (
    <svg viewBox="0 0 180 180" className="w-[170px] h-[170px] shrink-0">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#dbeafe" strokeWidth={stroke} />
      <circle
        cx={cx} cy={cy} r={r} fill="none"
        stroke="#1e3a8a"
        strokeWidth={stroke}
        strokeDasharray={`${pPct * circ * anim} ${circ}`}
        strokeDashoffset={0}
        transform={`rotate(-90 ${cx} ${cy})`}
        style={{ transition: "stroke-dasharray 0.8s cubic-bezier(0.4,0,0.2,1)" }}
      />
      <circle
        cx={cx} cy={cy} r={r} fill="none"
        stroke="#D6B549"
        strokeWidth={stroke}
        strokeDasharray={`${iPct * circ * anim} ${circ}`}
        strokeDashoffset={-(pPct * circ * anim)}
        transform={`rotate(-90 ${cx} ${cy})`}
        style={{
          transition: "stroke-dasharray 0.8s cubic-bezier(0.4,0,0.2,1)",
          transitionDelay: "0.1s",
        }}
      />
      <text x={cx} y={cy - 8} textAnchor="middle" fill="#64748b" fontSize="12" fontFamily="DM Sans,sans-serif" letterSpacing="0.08em">MATURITY</text>
      <text x={cx} y={cy + 10} textAnchor="middle" fill="#0f172a" fontSize="14" fontFamily="DM Mono,monospace" fontWeight="700">
        {formatCurrency(total)}
      </text>
    </svg>
  );
}

const FREQ_OPTIONS = [
  { label: "Monthly", value: 12 },
  { label: "Quarterly", value: 4 },
  { label: "Half-Yearly", value: 2 },
  { label: "Annually", value: 1 },
];

export default function FDCalculator() {
  const [principal, setPrincipal] = useState(100000);
  const [rate, setRate] = useState(7.5);
  const [years, setYears] = useState(3);
  const [freq, setFreq] = useState(4);

  const n = freq * years;
  const r = rate / 100 / freq;
  const maturityValue = principal * Math.pow(1 + r, n);
  const totalInterest = maturityValue - principal;

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
              FD <span className="text-finance-gold">Calculator</span>
            </h1>
          </div>

          <div className="p-6">
            <div className="w-full max-w-[860px] mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-white rounded-2xl p-8 border border-blue-100 text-base font-semibold">
                  <Slider
                    label="Principal Amount"
                    min={1000}
                    max={10000000}
                    step={1000}
                    value={principal}
                    onChange={setPrincipal}
                    prefix="₹"
                  />
                  <Slider
                    label="Annual Interest Rate"
                    min={1}
                    max={30}
                    step={0.1}
                    value={rate}
                    onChange={setRate}
                    unit="% p.a."
                  />
                  <Slider
                    label="Tenure"
                    min={1}
                    max={40}
                    step={1}
                    value={years}
                    onChange={setYears}
                    unit="yr"
                  />

                  <div className="mt-1">
                    <div className="text-[0.90rem] font-medium text-blue-900 tracking-wide uppercase mb-4">
                      Compounding Frequency
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {FREQ_OPTIONS.map((opt) => {
                        const active = freq === opt.value;
                        return (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => setFreq(opt.value)}
                            className={`rounded-lg border px-3 py-2 text-sm transition-colors ${
                              active
                                ? "border-finance-gold bg-finance-gold/15 text-blue-900 font-semibold"
                                : "border-blue-100 bg-white text-slate-600 hover:border-blue-200"
                            }`}
                          >
                            {opt.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-6">
                  <div className="bg-white rounded-2xl p-6 border border-blue-100 flex items-center justify-center gap-8">
                    <DonutChart principal={principal} interest={totalInterest} />

                    <div className="flex flex-col gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-2.5 h-2.5 rounded-sm bg-blue-900" />
                          <span className="text-lg text-slate-500 tracking-wide uppercase">Principal</span>
                        </div>
                        <div className="font-mono text-[1rem] text-blue-900 font-semibold">
                          <AnimatedNumber value={principal} />
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-2.5 h-2.5 rounded-sm bg-finance-gold" />
                          <span className="text-lg text-slate-500 tracking-wide uppercase">Interest</span>
                        </div>
                        <div className="font-mono text-[1rem] text-[#B68900] font-semibold">
                          <AnimatedNumber value={Math.round(totalInterest)} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl p-6 border border-finance-gold/40 bg-gradient-to-br from-blue-900 to-blue-800">
                    <span className="text-xs text-white/80 tracking-widest uppercase">Maturity Value</span>
                    <div className="mt-1 font-mono text-2xl md:text-3xl text-white font-bold leading-tight">
                      <AnimatedNumber value={Math.round(maturityValue)} />
                    </div>
                    <span className="text-sm text-finance-gold">
                      {((totalInterest / principal) * 100).toFixed(2)}% total interest over {years} yr
                      {years !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    label: "Principal Amount",
                    value: principal,
                    valueClassName: "text-blue-900",
                  },
                  {
                    label: "Total Interest",
                    value: Math.round(totalInterest),
                    valueClassName: "text-[#B68900]",
                  },
                  {
                    label: "Maturity Value",
                    value: Math.round(maturityValue),
                    valueClassName: "text-blue-700",
                  },
                ].map(({ label, value, valueClassName }) => (
                  <div key={label} className="bg-white rounded-2xl p-5 border border-blue-100">
                    <div className="text-sm text-slate-500 tracking-wide uppercase mb-1">{label}</div>
                    <div className={`font-mono text-2xl font-semibold ${valueClassName}`}>
                      <AnimatedNumber value={value} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center mt-6 text-xs text-slate-500 tracking-wide">
                Returns are indicative and may vary · For informational purposes only
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-10 border-t border-blue-100/70">
          <section className="bg-white rounded-2xl border border-blue-100/50 shadow-lg overflow-hidden">
            <div className="px-8 py-10">
              <h2 className="text-[1.4rem] font-semibold text-blue-900">
                What is a Fixed Deposit?
              </h2>
              <p className="mt-3 text-slate-600 leading-[1.8]">
                A Fixed Deposit (FD) is a low-risk investment where you deposit a lump sum with a bank or financial
                institution for a fixed period at a pre-agreed interest rate. Unlike market-linked investments, FD returns
                are typically predictable because the interest rate and tenure are known upfront. This FD calculator helps
                you estimate the maturity value, total interest earned, and how compounding frequency changes the final
                amount.
              </p>

              <h3 className="mt-10 text-[1.4rem] font-semibold text-blue-900">
                Why Invest in an FD?
              </h3>
              <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-5">
                {[
                  {
                    Icon: ShieldCheck,
                    title: "Predictable returns",
                    desc: "Know your expected maturity amount in advance based on rate, tenure, and compounding frequency.",
                  },
                  {
                    Icon: Banknote,
                    title: "Capital preservation",
                    desc: "FDs are commonly used to reduce portfolio volatility and keep a portion of savings stable.",
                  },
                  {
                    Icon: TrendingUp,
                    title: "Flexible interest payouts",
                    desc: "Compare compounding options (monthly/quarterly/half-yearly/yearly) to match your cash-flow needs.",
                  },
                ].map(({ Icon, title, desc }) => (
                  <div key={title} className="bg-white border border-blue-100 rounded-[16px] p-6">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 text-finance-gold">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="text-blue-900 font-semibold">{title}</div>
                        <div className="mt-2 text-slate-600 text-sm leading-[1.8]">{desc}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <h3 className="mt-12 text-[1.4rem] font-semibold text-blue-900">
                How is FD Interest Calculated?
              </h3>
              <p className="mt-3 text-slate-600 leading-[1.8]">
                Most FD calculators use compound interest. The compounding frequency decides how often interest is added
                back to the principal—more frequent compounding generally leads to a slightly higher maturity value.
              </p>

              <div className="mt-5 bg-slate-50 border border-blue-100 rounded-[16px] p-6">
                <div className="font-mono text-blue-900 text-sm whitespace-pre-wrap">
                  {`M = P × (1 + r)^n\n\nP = principal (investment amount)\nr = periodic interest rate (annualRate / frequency)\nn = total number of compounding periods (frequency × years)\nM = maturity amount`}
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div className="bg-white border border-blue-100 rounded-[16px] p-6">
                  <div className="text-blue-900 font-semibold">Compounding frequency explained</div>
                  <p className="mt-2 text-slate-600 text-sm leading-[1.8]">
                    If you choose monthly compounding, frequency = <span className="font-mono text-blue-900">12</span>.
                    Quarterly is <span className="font-mono text-blue-900">4</span>, half-yearly is
                    <span className="font-mono text-blue-900"> 2</span>, and yearly is
                    <span className="font-mono text-blue-900"> 1</span>. A higher frequency means interest is added more
                    often, which increases compounding slightly.
                  </p>
                  <div className="mt-4 font-mono text-blue-900 text-sm bg-slate-50 border border-blue-100 rounded-xl p-4 whitespace-pre-wrap">
                    {`frequency: monthly=12, quarterly=4, half-yearly=2, yearly=1`}
                  </div>
                </div>

                <div className="bg-white border border-blue-100 rounded-[16px] p-6">
                  <div className="text-blue-900 font-semibold">Worked example</div>
                  <p className="mt-2 text-slate-600 text-sm leading-[1.8]">
                    Example: Invest <span className="font-mono text-blue-900">₹1,00,000</span> at
                    <span className="font-mono text-blue-900"> 7%</span> p.a. for
                    <span className="font-mono text-blue-900"> 5 years</span>.
                  </p>
                  <div className="mt-4 font-mono text-blue-900 text-sm bg-slate-50 border border-blue-100 rounded-xl p-4 whitespace-pre-wrap">
                    {`P = 100000\nyears = 5\nannualRate = 0.07\nfrequency = 4 (quarterly)\nr = annualRate / frequency\nn = frequency × years\n\nM = P × (1 + r)^n`}
                  </div>
                  <p className="mt-3 text-slate-600 text-sm leading-[1.8]">
                    If you change the frequency to monthly, the maturity amount generally increases slightly compared to
                    yearly/half-yearly compounding.
                  </p>
                </div>
              </div>

              <div className="mt-8 bg-white border border-blue-100 rounded-[16px] overflow-hidden">
                <div className="px-6 py-4 border-b border-blue-100/70">
                  <div className="text-blue-900 font-semibold">Example outcomes (₹1,00,000 @ 7% for 5 years)</div>
                  <div className="mt-1 text-slate-600 text-sm leading-[1.8]">
                    These sample figures show how compounding frequency can slightly change the final maturity amount.
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50">
                        <th className="px-6 py-3 text-sm font-semibold text-blue-900">Compounding Frequency</th>
                        <th className="px-6 py-3 text-sm font-semibold text-blue-900">Principal</th>
                        <th className="px-6 py-3 text-sm font-semibold text-blue-900">Interest Rate</th>
                        <th className="px-6 py-3 text-sm font-semibold text-blue-900">Returns for 5 years</th>
                        <th className="px-6 py-3 text-sm font-semibold text-blue-900">Final Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-blue-100">
                      {[
                        {
                          freq: "Monthly",
                          principal: "₹1,00,000",
                          rate: "7%",
                          returns: "₹41,763",
                          finalAmount: "₹1,41,763",
                        },
                        {
                          freq: "Quarterly",
                          principal: "₹1,00,000",
                          rate: "7%",
                          returns: "₹41,478",
                          finalAmount: "₹1,41,478",
                        },
                        {
                          freq: "Half-Yearly",
                          principal: "₹1,00,000",
                          rate: "7%",
                          returns: "₹41,060",
                          finalAmount: "₹1,41,060",
                        },
                        {
                          freq: "Yearly",
                          principal: "₹1,00,000",
                          rate: "7%",
                          returns: "₹40,255",
                          finalAmount: "₹1,40,255",
                        },
                      ].map((row) => (
                        <tr key={row.freq} className="bg-white">
                          <td className="px-6 py-3 text-sm text-slate-600">{row.freq}</td>
                          <td className="px-6 py-3 text-sm font-mono text-blue-900">{row.principal}</td>
                          <td className="px-6 py-3 text-sm font-mono text-blue-900">{row.rate}</td>
                          <td className="px-6 py-3 text-sm font-mono text-[#B68900]">{row.returns}</td>
                          <td className="px-6 py-3 text-sm font-mono text-blue-900">{row.finalAmount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mt-10 bg-slate-50 border border-blue-100 rounded-[16px] p-6">
                <div className="text-blue-900 font-semibold">Disclaimer</div>
                <p className="mt-2 text-slate-600 text-sm leading-[1.8]">
                  This calculator provides an estimate based on the inputs you select. Actual FD returns may differ by
                  bank, product rules, payout type (cumulative vs periodic), taxation, and other charges. Always confirm
                  the latest rates and terms with your bank or financial institution before investing.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
