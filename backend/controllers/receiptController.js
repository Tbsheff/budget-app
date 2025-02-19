const DocumentIntelligence = require("@azure-rest/ai-document-intelligence").default;
const { getLongRunningPoller, isUnexpected } = require("@azure-rest/ai-document-intelligence");
const { AzureKeyCredential } = require("@azure/core-auth");
const Buffer = require('buffer').Buffer;

// Load environment variables
require("dotenv").config();

const key = process.env.AZURE_KEY;
const endpoint = process.env.AZURE_ENDPOINT;
const modelId = "prebuilt-receipt"; // Azure's predefined invoice model

// Initialize Azure AI Document Intelligence Client
const client = DocumentIntelligence(endpoint, new AzureKeyCredential(key));

/**
 * @desc Analyzes an invoice using Azure Document Intelligence
 * @route POST /api/analyze-invoice
 */
exports.analyzeReceipt = async (req, res) => {
  try {
    const { base64Content } = req.body;
    if (!base64Content) {
      return res.status(400).json({ error: "Base64 content is required." });
    }

    // Decode base64 content
    const fileBuffer = Buffer.from(base64Content, "base64");

    // Call Azure API to analyze invoice
    const initialResponse = await client
      .path("/documentModels/{modelId}:analyze", modelId)
      .post({
        contentType: "application/octet-stream",
        body: fileBuffer,
      });

    if (isUnexpected(initialResponse)) {
      throw initialResponse.body.error;
    }

    // Extract the operation-location URL for polling
    const operationUrl = initialResponse.headers["operation-location"];

    if (!operationUrl) {
      throw new Error("Missing operation-location header for polling.");
    }

    console.log("Polling for results at:", operationUrl);

    // Poll for results manually (Azure's recommended approach)
    let result;
    while (true) {
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait before retrying
      result = await client.path(operationUrl).get();
      if (result.body.status === "succeeded") break;
      if (result.body.status === "failed") {
        throw new Error("Azure failed to process the document.");
      }
    }

    if (isUnexpected(result)) {
      throw result.error;
    }

    const analyzeResult = result.body.analyzeResult;

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
