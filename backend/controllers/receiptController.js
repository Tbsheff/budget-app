const DocumentIntelligence = require("@azure-rest/ai-document-intelligence").default;
const { getLongRunningPoller, isUnexpected } = require("@azure-rest/ai-document-intelligence");
const { AzureKeyCredential } = require("@azure/core-auth");

// Load environment variables
require("dotenv").config();

const key = process.env.AZURE_KEY;
const endpoint = process.env.AZURE_ENDPOINT;
const modelId = "prebuilt-invoice"; // Azure's predefined invoice model

// Initialize Azure AI Document Intelligence Client
const client = DocumentIntelligence(endpoint, new AzureKeyCredential(key));

/**
 * @desc Analyzes an invoice using Azure Document Intelligence
 * @route POST /api/analyze-invoice
 */
exports.analyzeReceipt = async (req, res) => {
  try {
    const { invoiceUrl } = req.body;

    if (!invoiceUrl) {
      return res.status(400).json({ error: "Invoice URL is required." });
    }

    // Call Azure API to analyze invoice
    const initialResponse = await client
      .path("/documentModels/{modelId}:analyze", modelId)
      .post({
        contentType: "application/json",
        body: { urlSource: invoiceUrl },
      });

    if (isUnexpected(initialResponse)) {
      throw initialResponse.body.error;
    }

    // Poll for results
    const poller = await getLongRunningPoller(client, initialResponse);
    await poller.pollUntilDone();
    const analyzeResult = poller.getResult().body.analyzeResult;

    if (!analyzeResult || !analyzeResult.documents || analyzeResult.documents.length === 0) {
      return res.status(400).json({ error: "No invoice data extracted." });
    }

    // Extract invoice details
    const invoice = analyzeResult.documents[0];
    const merchantName = invoice.fields?.MerchantName?.valueString || "Unknown";
    const totalAmount = invoice.fields?.Total?.valueCurrency?.amount || 0;
    const invoiceDate = invoice.fields?.InvoiceDate?.valueDate || "Unknown";

    return res.json({
      merchant: merchantName,
      total: totalAmount,
      invoiceDate: invoiceDate,
      rawData: invoice.fields, // Optional: Full extracted data for debugging
    });

  } catch (error) {
    console.error("Error analyzing invoice:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
