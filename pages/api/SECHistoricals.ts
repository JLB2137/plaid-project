export default async function handler(req, res) {
  const USER_AGENT = "JLBInvest (jeremee.bornstein@gmail.com)"; // Replace with your app name and email
  const cik = req.body.cik

  if (!cik) return res.status(400).json({ error: "CIK parameter is required" });

  const paddedCIK = cik.padStart(10, "0");
  const SEC_API_URL = `https://data.sec.gov/submissions/CIK${paddedCIK}.json`;

  try {
    console.log(`Fetching SEC submissions for CIK: ${paddedCIK}`);

    // Fetch company submissions
    const response = await fetch(SEC_API_URL, {
      headers: { "User-Agent": USER_AGENT },
    });

    if (!response.ok) {
      console.error("Failed to fetch submissions:", response.statusText);
      throw new Error("Failed to fetch SEC submissions");
    }

    const data = await response.json();
    const recentFilings = data.filings.recent;

    const quarterlyEarnings = [];

    for (let i = 0; i < recentFilings.form.length; i++) {
      if (recentFilings.form[i] === "10-Q") {
        const filingDate = recentFilings.filingDate[i];
        const accessionNumber = recentFilings.accessionNumber[i].replace(/-/g, "");
        const filingURL = `https://www.sec.gov/Archives/edgar/data/${paddedCIK}/${accessionNumber}/index.json`;

        console.log(`Fetching filing index: ${filingURL}`);

        // Add a delay to prevent rate limiting
        await delay(500);

        const indexResponse = await fetch(filingURL, {
          headers: { "User-Agent": USER_AGENT },
        });

        if (!indexResponse.ok) {
          console.warn(`Failed to fetch filing index for ${filingDate}`);
          continue;
        }

        const indexData = await indexResponse.json();
        const xbrlFile = indexData.directory.item.find((item) =>
          item.name.endsWith(".xml") && item.name.includes("xbrl")
        );

        if (!xbrlFile) {
          console.warn(`No XBRL file found for filing date: ${filingDate}`);
          continue;
        }

        const xbrlURL = `https://www.sec.gov/Archives/edgar/data/${paddedCIK}/${accessionNumber}/${xbrlFile.name}`;
        console.log(`Fetching XBRL file: ${xbrlURL}`);

        // Parse XBRL data
        const earningsData = await fetchAndParseXBRL(xbrlURL, USER_AGENT);
        quarterlyEarnings.push({
          filingDate,
          netIncome: earningsData.netIncome || "Not Found",
          revenue: earningsData.revenue || "Not Found",
        });
      }
    }

    res.status(200).json(quarterlyEarnings);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Failed to fetch quarterly earnings" });
  }
}

// Helper function to fetch and parse XBRL XML
async function fetchAndParseXBRL(xbrlURL, userAgent) {
  try {
    const response = await fetch(xbrlURL, { headers: { "User-Agent": userAgent } });

    if (!response.ok) {
      console.error("Failed to fetch XBRL file:", response.statusText);
      throw new Error("XBRL fetch failed");
    }

    const xml = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, "application/xml");

    // Extract net income and revenue (tag names might vary)
    const getTagValue = (tag) => {
      const element = xmlDoc.querySelector(tag);
      return element ? element.textContent : null;
    };

    return {
      netIncome: getTagValue("us-gaap:NetIncomeLoss"),
      revenue: getTagValue("us-gaap:Revenues"),
    };
  } catch (error) {
    console.error("Error parsing XBRL:", error.message);
    return { netIncome: null, revenue: null };
  }
}
