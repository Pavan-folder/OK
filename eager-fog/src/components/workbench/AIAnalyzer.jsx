import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Brain, Settings, History, Info, XCircle } from "lucide-react";

/**
 * AIAnalyzer component
 * Analyzes compatibility between buyer and seller
 * with simulated AI insights and history of analyses.
 *
 * Props:
 * - buyer: object with buyer details
 * - seller: object with seller details
 */
const AIAnalyzer = ({ buyer, seller }) => {
  // Loading state for AI run
  const [loading, setLoading] = useState(false);
  // Stores current analysis result
  const [analysis, setAnalysis] = useState(null);
  // Stores history of past analyses (mocked saved in local state here)
  const [history, setHistory] = useState([]);
  // Control for showing settings panel
  const [showSettings, setShowSettings] = useState(false);
  // Analysis options - customizable parameters
  const [options, setOptions] = useState({
    detailedReport: true,
    includeRiskAnalysis: true,
    confidenceThreshold: 80,
  });
  // Show/hide detailed report
  const [showDetailed, setShowDetailed] = useState(true);
  // Error message if any
  const [error, setError] = useState(null);

  // Utility: generate a random integer between min and max inclusive
  function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // Generate a random mock analysis (simulate AI output)
  const generateMockAnalysis = () => {
    const baseScore = randomInt(70, 95);
    const riskFactor = randomInt(0, 10);
    const finalScore = Math.min(100, baseScore - riskFactor);

    // Mock insights, optionally more if detailed report
    const baseInsights = [
      "Strong product-market fit detected.",
      "Buyer’s target market aligns with seller’s capacity.",
      "Seller’s pricing model is competitive for buyer’s region.",
      "High probability of deal closure within 30 days.",
    ];

    const riskInsights = [
      "Minor logistical challenges expected.",
      "Payment terms may require negotiation.",
      "Potential regulatory hurdles detected.",
    ];

    const detailedInsights = [
      "Customer reviews indicate strong satisfaction in similar markets.",
      "Seller has consistent delivery record over the past 12 months.",
      "Buyer’s demand forecast indicates steady growth.",
      "Seller’s inventory levels support increased order volume.",
    ];

    let insights = [...baseInsights];
    if (options.includeRiskAnalysis) {
      insights = insights.concat(riskInsights);
    }
    if (options.detailedReport) {
      insights = insights.concat(detailedInsights);
    }

    // Shuffle insights array
    insights = insights.sort(() => Math.random() - 0.5);

    // Filter insights by confidence threshold
    if (finalScore < options.confidenceThreshold) {
      insights.unshift(
        "Warning: Compatibility score below confidence threshold. Proceed with caution."
      );
    }

    return {
      score: finalScore,
      insights,
      timestamp: new Date().toISOString(),
      detailedReport: options.detailedReport,
      riskIncluded: options.includeRiskAnalysis,
    };
  };

  // Run analysis handler
  const runAnalysis = () => {
    if (!buyer || !seller) {
      setError("Buyer and Seller must be selected to run analysis.");
      return;
    }
    setError(null);
    setLoading(true);
    setAnalysis(null);

    // Simulate API delay
    setTimeout(() => {
      const result = generateMockAnalysis();
      setAnalysis(result);

      // Save to history
      setHistory((prev) => [result, ...prev.slice(0, 9)]); // keep max 10

      setLoading(false);
    }, 1800);
  };

  // Clear history handler
  const clearHistory = () => {
    setHistory([]);
  };

  // Format ISO date nicely
  const formatDate = (isoString) => {
    const d = new Date(isoString);
    return d.toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  // JSX: render a single insight item with optional icon
  const InsightItem = ({ text }) => (
    <li className="mb-2 flex items-start gap-2">
      <Info className="text-blue-600 mt-0.5 flex-shrink-0" size={18} />
      <span>{text}</span>
    </li>
  );

  // JSX: Render settings panel content
  const SettingsPanel = () => (
    <div className="bg-gray-100 p-4 rounded-lg border border-gray-300 mt-4 max-w-md">
      <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
        <Settings size={20} /> Analysis Settings
      </h3>
      <label className="flex items-center gap-2 mb-3">
        <input
          type="checkbox"
          checked={options.detailedReport}
          onChange={(e) =>
            setOptions({ ...options, detailedReport: e.target.checked })
          }
          className="form-checkbox"
        />
        <span>Include Detailed Report</span>
      </label>
      <label className="flex items-center gap-2 mb-3">
        <input
          type="checkbox"
          checked={options.includeRiskAnalysis}
          onChange={(e) =>
            setOptions({ ...options, includeRiskAnalysis: e.target.checked })
          }
          className="form-checkbox"
        />
        <span>Include Risk Analysis</span>
      </label>
      <label className="flex flex-col mb-3">
        <span>Confidence Threshold: {options.confidenceThreshold}%</span>
        <input
          type="range"
          min={50}
          max={100}
          step={1}
          value={options.confidenceThreshold}
          onChange={(e) =>
            setOptions({ ...options, confidenceThreshold: Number(e.target.value) })
          }
          className="w-full"
        />
      </label>
      <Button
        variant="outline"
        onClick={() => setShowSettings(false)}
        className="mt-2"
      >
        Close Settings
      </Button>
    </div>
  );

  // JSX: Render analysis result panel
  const AnalysisResult = () => (
    <div className="bg-white p-5 rounded-lg shadow-md border border-gray-300 mt-4 max-w-3xl">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-green-700 flex items-center gap-2">
          <Brain size={24} /> Compatibility Score: {analysis.score}%
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowDetailed(!showDetailed)}
          aria-label={showDetailed ? "Hide details" : "Show details"}
        >
          {showDetailed ? "Hide Details" : "Show Details"}
        </Button>
      </div>
      {showDetailed && (
        <>
          <ul className="list-disc list-inside text-gray-700 mb-4">
            {analysis.insights.map((tip, idx) => (
              <InsightItem key={idx} text={tip} />
            ))}
          </ul>
          <div className="text-xs text-gray-400 italic">
            Report generated on: {formatDate(analysis.timestamp)}
          </div>
        </>
      )}
    </div>
  );

  // JSX: Render analysis history panel
  const AnalysisHistory = () => (
    <section className="mt-8 max-w-4xl">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <History size={20} /> Analysis History
        </h3>
        {history.length > 0 && (
          <Button variant="destructive" size="sm" onClick={clearHistory}>
            Clear History
          </Button>
        )}
      </div>
      {history.length === 0 ? (
        <p className="text-gray-500 italic">No past analyses run yet.</p>
      ) : (
        <div className="space-y-4 max-h-96 overflow-y-auto border border-gray-200 rounded p-4 bg-gray-50">
          {history.map((item, idx) => (
            <div
              key={idx}
              className="border border-gray-300 rounded p-3 bg-white shadow-sm"
            >
              <div className="flex justify-between items-center mb-1">
                <div className="font-semibold text-gray-700">
                  Score: {item.score}%
                </div>
                <div className="text-xs text-gray-400">
                  {formatDate(item.timestamp)}
                </div>
              </div>
              <ul className="list-disc list-inside text-gray-700">
                {item.insights.slice(0, 3).map((tip, tidx) => (
                  <li key={tidx}>{tip}</li>
                ))}
                {item.insights.length > 3 && (
                  <li className="text-sm text-gray-500 italic">...and more</li>
                )}
              </ul>
            </div>
          ))}
        </div>
      )}
    </section>
  );

  return (
    <Card className="p-6 shadow-xl rounded-3xl max-w-5xl mx-auto">
      <CardContent>
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Brain className="text-purple-600" size={32} />
          <h1 className="text-3xl font-extrabold">AI Deal Analyzer</h1>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSettings(!showSettings)}
            className="ml-auto"
            aria-label="Toggle analysis settings"
          >
            <Settings size={18} />
          </Button>
        </div>

        {/* Buyer/Seller Status */}
        {buyer && seller ? (
          <>
            <p className="mb-4 text-gray-700 text-lg">
              Analyzing potential match between{" "}
              <b>{buyer.name}</b> and <b>{seller.name}</b>.
            </p>

            {/* Run Analysis Button */}
            <Button
              onClick={runAnalysis}
              disabled={loading}
              className="mb-6"
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={20} />
                  Analyzing...
                </>
              ) : (
                "Run AI Analysis"
              )}
            </Button>

            {/* Error Display */}
            {error && (
              <div className="text-red-600 font-semibold mb-4">{error}</div>
            )}

            {/* Settings Panel */}
            {showSettings && <SettingsPanel />}

            {/* Analysis Result */}
            {analysis && <AnalysisResult />}

            {/* Analysis History */}
            <AnalysisHistory />
          </>
        ) : (
          <p className="text-gray-500 italic text-center py-20">
            Please select both a buyer and a seller to run AI analysis.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default AIAnalyzer;
