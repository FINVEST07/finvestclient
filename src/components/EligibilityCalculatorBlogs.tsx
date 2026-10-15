export default function LoanEligibilityGuide() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 leading-7 bg-white rounded-2xl mt-4">

      <h1 className="text-3xl font-bold mb-6 text-blue-900">
        Loan Eligibility Calculator Complete Guide – Check Maximum Loan Amount
      </h1>

      <p className="mb-6">
        If you are planning to apply for a home loan, personal loan, business loan, or loan against property,
        the first question that comes to mind is: <strong>“How much loan can I get?”</strong> A{" "}
        <strong>Loan Eligibility Calculator</strong> helps you estimate your maximum eligible loan amount based
        on your income, existing EMIs, age, credit profile, and repayment capacity — before you even apply.
        This complete guide explains how loan eligibility calculators work, which factors affect your
        eligibility, how to increase your loan amount, and how to use the calculator correctly.
      </p>

      {/* Section */}
      <h2 className="text-2xl font-semibold mt-8 mb-4">
        What Is a Loan Eligibility Calculator?
      </h2>

      <p>
        A <strong>Loan Eligibility Calculator</strong> is an online financial tool that estimates the maximum
        loan amount you may qualify for based on:
      </p>

      <ul className="list-disc ml-6 mt-3 space-y-1">
        <li>Monthly income</li>
        <li>Existing EMIs or debts</li>
        <li>Age</li>
        <li>Employment type</li>
        <li>Interest rate</li>
        <li>Loan tenure</li>
        <li>Credit score</li>
      </ul>

      <p className="mt-4">
        It gives you a quick estimate so you can plan your loan application smartly and avoid rejection.
      </p>

      {/* Benefits */}
      <h2 className="text-2xl font-semibold mt-8 mb-4">
        Why You Should Check Loan Eligibility Before Applying
      </h2>

      <ul className="space-y-2">
        <li>✅ Avoids loan rejection</li>
        <li>✅ Protects your credit score</li>
        <li>✅ Helps you plan EMI comfortably</li>
        <li>✅ Saves time in documentation</li>
        <li>✅ Lets you compare lenders better</li>
        <li>✅ Improves approval chances</li>
      </ul>

      <p className="mt-4">
        Loan rejection due to over-borrowing or low repayment capacity can reduce your creditworthiness —
        so pre-checking is always smart.
      </p>

      {/* Formula */}
      <h2 className="text-2xl font-semibold mt-8 mb-4">
        How Loan Eligibility Is Calculated
      </h2>

      <p>
        Most lenders use a <strong>FOIR method</strong> (Fixed Obligation to Income Ratio).
      </p>

      <div className="bg-gray-100 p-4 rounded mt-4 font-semibold text-center">
        Eligible EMI Capacity = Monthly Income × FOIR % − Existing EMIs
      </div>

      <p className="mt-4">
        Then the EMI capacity is converted into a loan amount based on interest rate and tenure.
      </p>

      {/* Example */}
      <h2 className="text-2xl font-semibold mt-8 mb-4">
        Example Calculation
      </h2>

      <ul className="list-disc ml-6 space-y-1">
        <li>Net Monthly Income = ₹80,000</li>
        <li>FOIR allowed = 50%</li>
        <li>Existing EMIs = ₹10,000</li>
      </ul>

      <p className="mt-4 font-medium">
        Eligible EMI capacity = ₹80,000 × 50% − ₹10,000 = ₹30,000 EMI possible
      </p>

      <p className="mt-3">
        Based on ₹30,000 EMI at 9% interest for 20 years, eligible loan may be approx{" "}
        <strong>₹32–35 lakh</strong>.
      </p>

      {/* Factors */}
      <h2 className="text-2xl font-semibold mt-8 mb-4">
        Key Factors That Affect Loan Eligibility
      </h2>

      <h3 className="font-semibold mt-4">1️⃣ Monthly Income</h3>
      <p>Higher stable income = higher eligibility.</p>
      <ul className="list-disc ml-6">
        <li>Salaried: Net take-home considered</li>
        <li>Self-employed: Average profit considered</li>
      </ul>

      <h3 className="font-semibold mt-4">2️⃣ Existing EMIs & Debts</h3>
      <p>More ongoing loans reduce your eligibility.</p>

      <h3 className="font-semibold mt-4">3️⃣ Credit Score</h3>
      <ul className="list-disc ml-6">
        <li>750+ → Best eligibility</li>
        <li>700–749 → Good</li>
        <li>650–699 → Moderate</li>
        <li>Below 650 → Risk category</li>
      </ul>

      <h3 className="font-semibold mt-4">4️⃣ Age</h3>
      <p>Younger applicants get higher tenure → higher eligibility.</p>

      <h3 className="font-semibold mt-4">5️⃣ Loan Tenure</h3>
      <p>Longer tenure = lower EMI = higher eligibility.</p>

      <h3 className="font-semibold mt-4">6️⃣ Employment Stability</h3>
      <ul className="list-disc ml-6">
        <li>Salaried with 2+ years experience</li>
        <li>Self-employed with 3+ years business</li>
        <li>Stable job/business continuity</li>
      </ul>

      {/* Types */}
      <h2 className="text-2xl font-semibold mt-8 mb-4">
        Types of Loans You Can Check
      </h2>

      <ul className="list-disc ml-6 space-y-1">
        <li>Home Loan</li>
        <li>Loan Against Property</li>
        <li>Personal Loan</li>
        <li>Business Loan</li>
        <li>Working Capital Loan</li>
        <li>Mortgage Loan</li>
        <li>Balance Transfer Top-Up</li>
      </ul>

      {/* Steps */}
      <h2 className="text-2xl font-semibold mt-8 mb-4">
        How to Use Calculator
      </h2>

      <ol className="list-decimal ml-6 space-y-1">
        <li>Enter monthly income</li>
        <li>Enter existing EMIs</li>
        <li>Select loan type</li>
        <li>Choose interest rate</li>
        <li>Select tenure</li>
        <li>Enter age</li>
        <li>Submit</li>
      </ol>

      <p className="mt-4">You’ll instantly see:</p>
      <ul className="list-disc ml-6">
        <li>Maximum loan amount</li>
        <li>Estimated EMI</li>
        <li>Suggested tenure</li>
        <li>Repayment capacity</li>
      </ul>

      {/* Improve Eligibility */}
      <h2 className="text-2xl font-semibold mt-8 mb-4">
        How to Increase Loan Eligibility
      </h2>

      <ul className="space-y-2">
        <li>✅ Add co-applicant income</li>
        <li>✅ Close small loans first</li>
        <li>✅ Reduce credit card balances</li>
        <li>✅ Improve credit score</li>
        <li>✅ Choose longer tenure</li>
        <li>✅ Show additional income</li>
        <li>✅ File proper ITR</li>
        <li>✅ Maintain bank balance discipline</li>
      </ul>

      {/* Mistakes */}
      <h2 className="text-2xl font-semibold mt-8 mb-4">
        Common Mistakes to Avoid
      </h2>

      <ul className="space-y-2">
        <li>❌ Applying without checking eligibility</li>
        <li>❌ Hiding EMIs</li>
        <li>❌ Over-estimating income</li>
        <li>❌ Ignoring credit score</li>
        <li>❌ Applying to multiple lenders blindly</li>
        <li>❌ Choosing very high EMI burden</li>
      </ul>

      {/* Conclusion */}
      <h2 className="text-2xl font-semibold mt-8 mb-4">
        Conclusion
      </h2>

      <p>
        A <strong>Loan Eligibility Calculator</strong> is the smartest first step before applying for any loan.
        It helps you understand borrowing capacity, plan your EMI, and improve approval chances. Always check
        eligibility, credit score, and repayment comfort before applying.
      </p>

      {/* CTA */}
      <div className="mt-8 p-5 bg-blue-50 rounded-lg">
        <p className="font-semibold">
          📞 Planning to apply for a loan?
        </p>
        <p>Get a free eligibility check and best home loan offers with Finvestcorp.</p>
        <p className="mt-2">📲 Call / WhatsApp: 9324592709 / 9892204806</p>
        <p>🌐 Visit: www.finvestcorp.com</p>
      </div>

      {/* Disclaimer */}
      <p className="text-sm text-gray-500 mt-8">
        Disclaimer: This article is for educational purposes only. Loan eligibility calculations are indicative
        and may vary by lender, credit policy, and applicant profile. Consult a financial solution provider before making
        borrowing decisions.
      </p>

    </div>
  );
}