import OpenAI from "openai";
import axios from "axios";

export const generateBudget = async (
  formData,
  setIsLoading,
  setError,
  setBudget
) => {
  try {
    setIsLoading(true);
    setError("");

    const openai = new OpenAI({
      apiKey: import.meta.env.VITE_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true,
    });

    const prompt = `Based on the following financial survey data, 
    create a detailed monthly budget and provide financial recommendations:

      
    Monthly Income: $${formData.monthlyIncome}
    Additional Income: $${formData.additionalIncome || 0}
    Current Expenses:
    - Housing: $${formData.housingPayment}
    - Utilities: $${formData.utilities}
    - Internet/Phone: $${formData.internetAndPhone}
    - Transportation: $${formData.transportationCosts}
    - Health Insurance: $${formData.healthInsurance}
    - Groceries: $${formData.groceries}
    Current Savings: $${formData.monthlySavings}
    Desired Monthly Savings: $${formData.desiredMonthlySavings}
    Financial Priorities: ${formData.financialPriorities.join(", ")}

    Create several budget groups that encompass a larger group of categories. For example, needs, wants, and savings.
    Create categories within each group that represent specific expenses. For example, rent, groceries, and entertainment.
    Make sure the budget is balanced and accounts for all income and expenses.
    Expenses should not total more than income. 
    Always make the first budget group Income and the category Monthly Income.

    Pick an appropriate icon for each category from the following list:
    [
  "Home",
  "Lightbulb",
  "Droplet",
  "ShoppingCart",
  "ShoppingBag",
  "Car",
  "Bus",
  "Fuel",
  "Phone",
  "Wifi",
  "Stethoscope",
  "Building2",
  "CreditCard",
  "Wallet",
  "Baby",
  "PawPrint",
  "GraduationCap",
  "Book",
  "PiggyBank",
  "AlertCircle",
  "TrendingUp",
  "LineChart",
  "Building",
  "Briefcase",
  "Scroll",
  "DollarSign",
  "UtensilsCrossed",
  "Pizza",
  "Film",
  "Music",
  "Gamepad2",
  "Palette",
  "Plane",
  "Luggage",
  "Dumbbell",
  "Heart",
  "Gift",
  "Shield",
  "FileText",
  "Tv",
  "Wrench",
  "Calculator",
  "Download",
  "MoreHorizontal",
  "Monitor"
]
 pick a color as well for each icon. It should be in the format of a tailwindcss color class. For example, text-gray-500.
 This is a list of colors to choose from. text-slate-500, text-gray-500, text-zinc-500, text-neutral-500, text-stone-500, text-red-500, text-orange-500, text-amber-500, text-yellow-500, text-lime-500, text-green-500, text-emerald-500, text-teal-500, text-cyan-500, text-sky-500, text-blue-500, text-indigo-500, text-violet-500, text-purple-500, text-fuchsia-500, text-pink-500, text-rose-500 
  this will be the icon_color

  Ensure the following six categories are always included in the "Want" budget group:
  - Charitable Donations (icon: HeartHandshake, color: text-red-500)
  - Dining (icon: Coffee, color: text-yellow-500)
  - Entertainment (icon: Film, color: text-green-500)
  - Health & Wellness (icon: HeartPulse, color: text-purple-500)
  - Shopping (icon: Tag, color: text-orange-500)
  - Miscellaneous (icon: MoreHorizontal, color: text-gray-400)
  These six categories in the Want buget group should have a monthly budget default of 0.


 Next, identify if the user has any categories that are a high percentage of their income compared to what is usually recommended for similar categories. For example, if the user is spending 50% of their income on rent, this is higher than the recommended 30%.

    Please provide:
    1. A detailed monthly budget breakdown with specific amounts for each category
    2. Recommendations for improving the user's financial situation. Including if the user is spending more on any categories than is recommended. 
    
    Format the response as JSON with the following structure:
    {
      "budgetGroups": [
        {
          "group_name": "string",
          "categories": [
            {
              "name": "string",
              "monthly_budget": number,
              "icon_name": "string",
              "icon_color": "string"
            }
          ]
        }
      ],
      "recommendations": ["string"]
    }`;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
      response_format: { type: "json_object" },
    });

    const response = JSON.parse(completion.choices[0].message.content);
    console.log("Response:", response);
    // Save the budget to the database
    const token = localStorage.getItem("token");
    await axios.post("/api/budget/save", response, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setIsLoading(false);
    return response;
  } catch (err) {
    console.error("Failed to generate budget:", err);
    setError("Failed to generate budget. Please try again.");
    setIsLoading(false);
    return null;
  }
};
