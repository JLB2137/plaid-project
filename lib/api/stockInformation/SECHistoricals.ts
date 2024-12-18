export const fetchHistoricalEarnings = async (ticker) => {
    const SEC_TICKER_URL = "https://www.sec.gov/files/company_tickers.json";
    const USER_AGENT = "JLB Investments (jeremee.bornstein@gmail.com)"; // Replace with your info

    try {
        // Step 1: Fetch CIK for the given ticker
        const response = await fetch(SEC_TICKER_URL, { headers: { "User-Agent": USER_AGENT } });
        const data = await response.json();

        // Find CIK by ticker (case insensitive)
        const company = Object.values(data).find(
            (entry) => entry.ticker.toLowerCase() === ticker.toLowerCase()
        );

        if (!company) {
            console.log("Company not found.");
            return;
        }

        const cik = company.cik_str.toString().padStart(10, "0"); // Format CIK to 10 digits
        console.log(`Found CIK: ${cik} for ${ticker}`);

        // Step 2: Fetch company submissions (10-K and 10-Q filings)
        const SUBMISSIONS_URL = `https://data.sec.gov/submissions/CIK${cik}.json`;
        const filingsResponse = await fetch(SUBMISSIONS_URL, { headers: { "User-Agent": USER_AGENT } });
        const filingsData = await filingsResponse.json();

        // Step 3: Extract earnings data from filings
        const earnings = [];
        const reports = filingsData.filings.recent;

        // Loop through recent filings (10-K and 10-Q only)
        for (let i = 0; i < reports.form.length; i++) {
            const form = reports.form[i];
            if (form === "10-K" || form === "10-Q") {
                const filingDate = reports.filingDate[i];
                const filingLink = `https://www.sec.gov/Archives/edgar/data/${cik}/${reports.accessionNumber[i].replace(/-/g, '')}/${reports.primaryDocument[i]}`;
                earnings.push({ form, filingDate, filingLink });
            }
        }

        console.log("Historical Earnings Filings:");
        console.table(earnings);
    } catch (error) {
        console.error("Error fetching historical earnings:", error);
    }
};

