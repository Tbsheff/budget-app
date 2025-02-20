import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Loader2,
  Pause,
  Bot,
  DollarSign,
  PiggyBank,
  TrendingUp,
} from "lucide-react";
import { useChatStore } from "../../store/chatStore";
import { streamCompletion } from "../../lib/openai";
import {
  generateDefaultBudget,
  formatCurrency,
  saveBudgetToDatabase,
} from "../../lib/budget";
import { UserProvider, useUser } from "../../context/userContext";
import { SavingsGoalsList } from "../savings/SavingsGoalsList";
import { CreateSavingsGoalFlow } from "../savings/CreateSavingsGoalFlow";
import type { SavingsGoal } from "@/types/savings";
import type { Budget, BudgetChange } from "@/types/budget";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { BudgetFlow } from "@/components/budget/BudgetFlow";
import { QuickstartOptions } from "./QuickstartOptions";
import { ChatMessage } from "./ChatMessage";
import { generateSQLQuery, executeSQLQuery } from "../../lib/sqlGenerator";

interface QuickstartOption {
  id: string;
  text: string;
  next?: QuickstartOption[];
}

export const Chat: React.FC = () => {
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [budget, setBudget] = useState<Budget>({
    totalIncome: 0,
    groups: [],
  });
  const {
    messages,
    isLoading,
    addMessage,
    updateLastMessage,
    setLoading,
    isOpen,
    quickstartOptions,
    setQuickstartOptions,
  } = useChatStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const { user } = useUser();
  const { toast } = useToast();

  const [showingSavingsGoals, setShowingSavingsGoals] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<SavingsGoal | null>(null);
  const [currentFlow, setCurrentFlow] = useState<{
    type: string;
    name: string | null;
    targetAmount: number | null;
    deadline: string | null;
    initialDeposit: number | null;
  } | null>(null);

  const budgetFlow: QuickstartOption[] = [
    {
      id: "income",
      text: "What's your monthly income? (e.g., $5000)",
    },
  ];

  const savingsFlow: QuickstartOption[] = [
    {
      id: "manage-savings",
      text: "Would you like to create a new savings goal or edit an existing one?",
      next: [
        { id: "create-new", text: "Create a New Savings Goal" },
        { id: "edit-existing", text: "Edit an Existing Goal" },
      ],
    },
  ];

  const spendingFlow: QuickstartOption[] = [
    {
      id: "spending-categories",
      text: "Which spending categories would you like to analyze?",
      next: [
        { id: "all", text: "All Categories" },
        { id: "housing", text: "Housing & Utilities" },
        { id: "transportation", text: "Transportation" },
        { id: "food", text: "Food & Dining" },
        { id: "entertainment", text: "Entertainment" },
        { id: "shopping", text: "Shopping" },
      ],
    },
  ];

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (isOpen || messages.length > 0) {
      scrollToBottom();
    }
  }, [isOpen, messages]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      const newHeight = Math.min(textarea.scrollHeight, 150);
      textarea.style.height = `${newHeight}px`;

      // Enable scrolling only when content exceeds max height
      textarea.style.overflowY =
        textarea.scrollHeight > 150 ? "auto" : "hidden";
    }
  }, [input]);

  useEffect(() => {
    if (textareaRef.current && isOpen) {
      textareaRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isStreaming && !isLoading && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isStreaming, isLoading]);

  useEffect(() => {
    if (!isStreaming && !isLoading && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isStreaming, isLoading]);

  useEffect(() => {
    if (!isOpen && !isStreaming) {
      setCurrentFlow(null);
      setQuickstartOptions([]);
    }
  }, [isOpen, isStreaming, setQuickstartOptions, setCurrentFlow]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleNewSavingsGoal = async (type: string) => {
    setCurrentFlow({
      type,
      name: null,
      targetAmount: null,
      deadline: null,
      initialDeposit: null,
    });
    console.log("currentFlow", currentFlow);
    addMessage({
      role: "assistant",
      content: "What would you like to name this savings goal?",
    });
    setQuickstartOptions([]);
  };

  const handleSavingsGoalInput = async (input: string) => {
    if (!currentFlow) return;

    console.log("Before Update: ", currentFlow);

    // Handle validation errors
    if (input.startsWith("ERROR:")) {
      addMessage({
        role: "assistant",
        content: input.replace("ERROR:", "").trim(),
      });
      return;
    }

    // Step 1: Set goal name
    if (!currentFlow.name) {
      // setCurrentFlow((prev) => (prev ? { ...prev, name: input } : prev));

      setTimeout(() => {
        addMessage({ role: "user", content: input });
        addMessage({
          role: "assistant",
          content: `How much do you need to save for **${input}**? (Please enter an amount in dollars)`,
        });
      }, 100);
      setCurrentFlow({ type: "savings", name: input });

      return;
    }

    // Step 2: Set target amount
    if (!currentFlow.targetAmount) {
      const amount = parseFloat(input.replace(/[^0-9.]/g, ""));
      if (isNaN(amount) || amount <= 0) {
        addMessage({
          role: "assistant",
          content: "ERROR: Please enter a valid positive amount.",
        });
        return;
      }

      addMessage({ role: "user", content: `$${amount}` });
      addMessage({
        role: "assistant",
        content:
          "When do you need to have this amount saved by? Please select a date.",
      });

      setTimeout(() => {
        setCurrentFlow({ ...currentFlow, targetAmount: amount });
      }, 100);
      return;
    }

    // Step 3: Set deadline
    if (!currentFlow.deadline) {
      if (isNaN(Date.parse(input))) {
        addMessage({
          role: "assistant",
          content: "ERROR: Please select a valid date.",
        });
        return;
      }

      addMessage({ role: "user", content: input });
      addMessage({
        role: "assistant",
        content:
          "How much would you like to deposit initially? (Enter 0 if none)",
      });

      setTimeout(() => {
        setCurrentFlow({ ...currentFlow, deadline: input });
      }, 100);
      return;
    }

    // Step 4: Set initial deposit and save the goal
    if (!currentFlow.initialDeposit) {
      const deposit = parseFloat(input.replace(/[^0-9.]/g, ""));
      if (isNaN(deposit) || deposit < 0) {
        addMessage({
          role: "assistant",
          content: "ERROR: Please enter a valid non-negative amount.",
        });
        return;
      }

      const goalData = {
        ...currentFlow,
        initialDeposit: deposit,
      };

      try {
        const token = localStorage.getItem("token");
        await axios.post(
          "/api/savings-goals/create",
          {
            user_id: user?.id,
            name: goalData.name,
            target_amount: goalData.targetAmount,
            current_amount: goalData.initialDeposit,
            deadline: new Date(goalData.deadline),
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        toast({
          title: "Success",
          description: "Savings goal created successfully!",
        });

        addMessage({ role: "user", content: `$${deposit}` });
        addMessage({
          role: "assistant",
          content: `Great! Your savings goal for **${goalData.name}** is set with a target of **$${goalData.targetAmount}** by **${goalData.deadline}** with an initial deposit of **$${deposit}**.`,
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to create savings goal. Please try again.",
          variant: "destructive",
        });
      }

      setTimeout(() => {
        setCurrentFlow(null);
      }, 100);
      return;
    }
  };

  const handleBudgetRequest = async (income: number) => {
    const budget = generateDefaultBudget(income);

    if (user) {
      try {
        await saveBudgetToDatabase(user.id, budget);
        console.log("Budget saved successfully");
      } catch (error) {
        console.error("Error saving budget:", error);
      }
    }

    let response = `Here's your personalized monthly budget plan based on an income of ${formatCurrency(
      income
    )}:\n\n`;

    budget.categories.forEach((category) => {
      response += `## ${category.name} (${
        category.percentage
      }% - ${formatCurrency(category.amount)})\n\n`;
      category.subcategories?.forEach((sub) => {
        response += `- ${sub.name}: ${formatCurrency(sub.amount)} (${
          sub.percentage
        }%)\n`;
      });
      response += "\n";
    });

    response += "\nYou can customize this budget by:\n";
    response += "1. Adjusting category percentages\n";
    response += "2. Adding new categories\n";
    response += "3. Removing existing categories\n";
    response += "4. Saving your modifications\n\n";
    response += "Would you like to make any adjustments to this budget plan?";

    return response;
  };

  const handleSavingsPlanRequest = async (command: string, args: string[]) => {
    if (!user) {
      return "Please log in to manage your savings plans.";
    }

    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      if (command === "create") {
        const [name, targetAmount, targetDate] = args;
        const response = await axios.post(
          "/api/savings-goals/create",
          {
            user_id: user.id,
            name,
            target_amount: parseFloat(targetAmount),
            current_amount: 0,
            deadline: new Date(targetDate),
          },
          { headers }
        );
        return `Savings plan "${name}" created successfully.`;
      } else if (command === "edit") {
        const [id, name, targetAmount, targetDate] = args;
        const response = await axios.put(
          `/api/savings-goals/${id}`,
          {
            name,
            target_amount: parseFloat(targetAmount),
            deadline: new Date(targetDate),
          },
          { headers }
        );
        return `Savings plan "${name}" updated successfully.`;
      } else if (command === "delete") {
        const [id] = args;
        await axios.delete(`/api/savings-goals/${id}`, { headers });
        return `Savings plan with ID ${id} deleted successfully.`;
      } else {
        return "Unknown command. Please use create, edit, or delete.";
      }
    } catch (error) {
      console.error("Error managing savings plan:", error);
      return "An error occurred while managing the savings plan.";
    }
  };

  const handleSQLQuery = async (userMessage: string) => {
    const dataQueryKeywords = [
      "show me",
      "what is",
      "how much",
      "tell me about",
      "find",
      "search",
      "query",
      "get",
      "display",
      "list",
    ];

    const mightBeDataQuery = dataQueryKeywords.some((keyword) =>
      userMessage.toLowerCase().includes(keyword)
    );

    if (!mightBeDataQuery) {
      return false;
    }

    addMessage({ role: "assistant", content: "", isStreaming: true });
    const assistantResponse = "Let me check for you.\n\n";
    updateLastMessage(assistantResponse);

    try {
      // Mock schema for now - in production, you'd fetch this from your database
      const schema = {
        tables: [
          {
            name: "budget_history",
            columns: [
              "history_id",
              "user_id",
              "category_id",
              "month_year",
              "monthly_budget",
              "created_at",
              "updated_at",
              "rolled_over_amount",
            ],
          },
          {
            name: "currencies",
            columns: ["currency_id", "code", "name", "symbol"],
          },
          {
            name: "languages",
            columns: ["language_id", "code", "name"],
          },
          {
            name: "notifications",
            columns: [
              "notification_id",
              "user_id",
              "type",
              "message",
              "is_sent",
              "send_date",
              "created_at",
            ],
          },
          {
            name: "recurring_transactions",
            columns: [
              "recurring_id",
              "user_id",
              "category_id",
              "amount",
              "description",
              "frequency",
              "next_occurrence",
              "created_at",
            ],
          },
          {
            name: "savings_goals",
            columns: [
              "goal_id",
              "user_id",
              "name",
              "target_amount",
              "current_amount",
              "deadline",
              "created_at",
              "category_id",
            ],
          },
          {
            name: "survey",
            columns: [
              "survey_id",
              "user_id",
              "age",
              "targetRetirementAge",
              "employmentStatus",
              "monthlyIncome",
              "additionalIncome",
              "housingPayment",
              "utilities",
              "internetAndPhone",
              "transportationCosts",
              "healthInsurance",
              "groceries",
              "creditCardDebt",
              "otherLoans",
              "monthlySavings",
              "financialPriorities",
              "otherPriority",
              "desiredMonthlySavings",
              "createdAt",
              "updatedAt",
            ],
          },
          {
            name: "transactions",
            columns: [
              "transaction_id",
              "user_id",
              "category_id",
              "amount",
              "description",
              "transaction_date",
              "created_at",
            ],
          },
          {
            name: "user_budget_groups",
            columns: [
              "budget_group_id",
              "group_name",
              "user_id",
              "default_category_id",
              "created_at",
            ],
          },
          {
            name: "user_categories",
            columns: [
              "category_id",
              "user_id",
              "default_category_id",
              "name",
              "monthly_budget",
              "created_at",
              "icon_name",
              "icon_color",
              "budget_group_id",
              "is_deleted",
              "deleted_at",
            ],
          },
          {
            name: "user_settings",
            columns: [
              "setting_id",
              "user_id",
              "currency",
              "timezone",
              "theme",
              "notifications_enabled",
              "created_at",
            ],
          },
          {
            name: "user_subcategories",
            columns: [
              "subcategory_id",
              "user_id",
              "category_id",
              "name",
              "created_at",
            ],
          },
        ],
      };

      const sqlData = await generateSQLQuery(
        userMessage,

        schema
      );

      if (!sqlData) {
        updateLastMessage(
          "I couldn't find the correct information for your request."
        );
        return true;
      }

      updateLastMessage(assistantResponse + "\nSearching your budget...");

      const result = await executeSQLQuery(sqlData);

      let formattedResponse = "";

      // Function to capitalize each word in a string
      const capitalizeWords = (str: string) => {
        return str
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
      };

      if (Array.isArray(result)) {
        formattedResponse = result
          .map((item, index) => {
            const entry = Object.entries(item)
              .map(
                ([key, value]) =>
                  `${capitalizeWords(key.replace(/_/g, " "))}: ${value}`
              )
              .join(", ");
            return `${entry}`;
          })
          .join("\n\n");
      } else {
        formattedResponse = JSON.stringify(result, null, 2);
      }

      updateLastMessage(
        `${assistantResponse}\nHere's what I found:\n\n${formattedResponse}`
      );
    } catch (error) {
      console.error("Error in SQL query handling:", error);
      updateLastMessage(
        "I encountered an error while trying to query the database: " +
          error.message
      );
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    console.log("Handling submit, current flow:", currentFlow);

    const userMessage = input.trim();
    setInput("");

    if (currentFlow) {
      console.log("Triggering handleSavingsGoalInput");
      await handleSavingsGoalInput(userMessage);
      return;
    }

    addMessage({ role: "user", content: userMessage });
    setLoading(true);
    setIsStreaming(true);
  };

  const handleOptionClick = async (option: QuickstartOption) => {
    addMessage({ role: "user", content: option.text });

    if (option.id === "create-new") {
      addMessage({
        role: "assistant",
        content: "What type of savings goal would you like to create?",
      });
      setQuickstartOptions([
        { id: "emergency-fund", text: "Emergency Fund" },
        { id: "retirement", text: "Retirement Savings" },
        { id: "major-purchase", text: "Major Purchase (e.g., car, house)" },
        { id: "vacation", text: "Vacation Fund" },
        { id: "education", text: "Education Savings" },
        { id: "custom", text: "Custom Goal" },
      ]);
      return;
    }

    if (option.id === "edit-existing") {
      setShowingSavingsGoals(true);
      setQuickstartOptions([]);
      addMessage({
        role: "assistant",
        content:
          "Please select a savings goal from the list on the right to edit it.",
      });
      return;
    }

    if (
      [
        "all",
        "housing",
        "transportation",
        "food",
        "entertainment",
        "shopping",
      ].includes(option.id)
    ) {
      setCurrentFlow({ type: "spending", category: option.id });
      addMessage({
        role: "assistant",
        content: `For what time period would you like to analyze your ${
          option.id === "all"
            ? "overall spending"
            : `spending in the ${option.id} category`
        }?`,
      });
      setQuickstartOptions([
        { id: "last-month", text: "Last Month" },
        { id: "last-3-months", text: "Last 3 Months" },
        { id: "last-6-months", text: "Last 6 Months" },
        { id: "last-year", text: "Last Year" },
        { id: "custom", text: "Custom Period" },
      ]);
      return;
    }

    if (
      [
        "last-month",
        "last-3-months",
        "last-6-months",
        "last-year",
        "custom",
      ].includes(option.id)
    ) {
      if (currentFlow?.type === "spending") {
        const timePeriod = option.text.toLowerCase();
        const category = currentFlow.category;

        addMessage({ role: "user", content: `Analyze for ${timePeriod}` });
        addMessage({ role: "assistant", content: "", isStreaming: true });

        let assistantResponse = "";
        const analysisPrompt = `Analyze ${category === "all" ? "overall spending" : `spending in the ${category} category`} for ${timePeriod}. Consider patterns, trends, and potential areas for improvement.`;

        try {
          abortControllerRef.current = new AbortController();
          await streamCompletion(
            analysisPrompt,
            (token) => {
              assistantResponse += token;
              updateLastMessage(assistantResponse);
            },
            abortControllerRef.current.signal
          );
        } catch (error) {
          if (error.name === "AbortError") {
            updateLastMessage(
              assistantResponse + "\n\n*Message streaming was stopped*"
            );
          } else {
            throw error;
          }
        }

        setCurrentFlow(null);
        setQuickstartOptions([]);
        return;
      }
    }

    if (
      [
        "major-purchase",
        "custom",
        "emergency-fund",
        "retirement",
        "vacation",
        "education",
      ].includes(option.id)
    ) {
      await handleNewSavingsGoal(option.id);
      return;
    }

    if (option.next) {
      addMessage({
        role: "assistant",
        content: option.next[0].text,
      });
      setQuickstartOptions(option.next);
    } else {
      setQuickstartOptions([]);

      let prompt = "";
      switch (option.id) {
        case "emergency-fund":
          prompt =
            "Create a savings goal for an emergency fund that covers 3-6 months of expenses";
          break;
        case "retirement":
          prompt =
            "Create a retirement savings plan with monthly contribution targets";
          break;
        case "major-purchase":
          prompt =
            "Help me create a savings plan for a major purchase with a specific target amount and deadline";
          break;
        case "vacation":
          prompt = "Set up a vacation fund with a target amount and timeline";
          break;
        case "education":
          prompt = "Create an education savings plan with long-term goals";
          break;
        case "custom":
          prompt =
            "Help me set up a custom savings goal with specific parameters";
          break;
        default:
          prompt = option.text;
      }

      addMessage({ role: "assistant", content: "", isStreaming: true });
      let assistantResponse = "";

      try {
        abortControllerRef.current = new AbortController();
        await streamCompletion(
          prompt,
          (token) => {
            assistantResponse += token;
            updateLastMessage(assistantResponse);
          },
          abortControllerRef.current.signal
        );
      } catch (error) {
        if (error.name === "AbortError") {
          updateLastMessage(
            assistantResponse + "\n\n*Message streaming was stopped*"
          );
        } else {
          throw error;
        }
      }
    }
  };

  const handleGoalSelection = (goal: SavingsGoal) => {
    setSelectedGoal(goal);
    setInput(
      `I'd like to edit my savings goal "${goal.name}". The current target is $${goal.target_amount} by ${new Date(goal.deadline).toLocaleDateString()}. What would you like to modify?`
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    handleSubmit(new Event("submit") as any);
  };

  const stopStreaming = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsStreaming(false);
    }
  };

  const formatTime = () => {
    const now = new Date();
    return now.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleQuickstartPrompt = async (prompt: string) => {
    switch (prompt) {
      case "I need help adjusting my budget":
        addMessage({
          role: "assistant",
          content:
            "Got it! You want to adjust your budget. What would you like to change?",
        });
        setCurrentFlow({ type: "budget" });
        break;
      case "I want to create a savings plan":
        addMessage({
          role: "assistant",
          content:
            "Would you like to create a new savings goal or edit an existing one?",
        });
        setQuickstartOptions([
          { id: "create-new", text: "Create a New Savings Goal" },
          { id: "edit-existing", text: "Edit an Existing Goal" },
        ]);
        break;
      case "Analyze my spending patterns":
        addMessage({
          role: "assistant",
          content:
            "I'll help you analyze your spending patterns. First, let's identify which areas to focus on:",
        });
        setQuickstartOptions([
          { id: "all", text: "All Categories" },
          { id: "housing", text: "Housing & Utilities" },
          { id: "transportation", text: "Transportation" },
          { id: "food", text: "Food & Dining" },
          { id: "entertainment", text: "Entertainment" },
          { id: "shopping", text: "Shopping" },
        ]);
        break;
    }
  };

  const handleBudgetChanges = async (changes: BudgetChange[]) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "/api/budget/update",
        { changes },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast({
        title: "Success",
        description: "Budget updated successfully!",
      });

      addMessage({
        role: "assistant",
        content:
          "Your budget has been updated successfully! What would you like to do next?",
      });

      setQuickstartOptions([
        {
          id: "adjust-budget",
          text: "I need help adjusting my budget",
        },
        {
          id: "create-savings",
          text: "I want to create a savings plan",
        },
        {
          id: "analyze-spending",
          text: "Analyze my spending patterns",
        },
      ]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update budget. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div
      className={`flex ${showingSavingsGoals ? "flex-row" : "flex-col"} h-full min-h-0`}
    >
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-4 sm:space-y-6">
          {messages.length === 0 ? (
            <QuickstartOptions onOptionSelect={handleQuickstartPrompt} />
          ) : (
            <>
              {messages.map((message, index) => (
                <ChatMessage
                  key={message.id}
                  role={message.role}
                  content={message.content}
                  isStreaming={
                    message.isStreaming &&
                    isStreaming &&
                    index === messages.length - 1
                  }
                  timestamp={formatTime()}
                />
              ))}
              {currentFlow?.type === "budget" && (
                <BudgetFlow
                  budget={budget}
                  onBudgetChange={handleBudgetChanges}
                  onComplete={() => setCurrentFlow(null)}
                />
              )}
              {currentFlow?.type === "savings" && (
                <CreateSavingsGoalFlow
                  currentFlow={currentFlow}
                  onInputSubmit={handleSavingsGoalInput}
                />
              )}
              {quickstartOptions.length > 0 && (
                <div className="ml-12 mt-2">
                  {quickstartOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => handleOptionClick(option)}
                      className="block w-full text-left px-4 py-3 mb-2 bg-purple-50 hover:bg-purple-100 
                        rounded-lg transition-colors duration-200 text-gray-700"
                    >
                      {option.text}
                    </button>
                  ))}
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        <div className="flex-none border-t border-gray-200 bg-white p-2 sm:p-4">
          <form
            onSubmit={handleSubmit}
            className="max-w-4xl mx-auto flex items-end gap-2"
          >
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                className="w-full py-2 px-3 sm:p-3 text-sm sm:text-base rounded-2xl border-2 
                  border-purple-300/20 bg-white resize-none
                  focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent
                  min-h-[44px] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                disabled={isLoading}
                rows={1}
              />
              <div className="absolute right-3 bottom-2 text-xs text-gray-400 select-none">
                ⏎ to send
              </div>
            </div>
            <button
              type="button"
              onClick={isStreaming ? stopStreaming : handleSubmit}
              disabled={!isStreaming && (isLoading || !input.trim())}
              className="p-2 sm:p-3 rounded-full bg-purple-600 text-white hover:bg-purple-700 
                disabled:opacity-50 disabled:hover:bg-purple-600 transition-colors duration-200
                flex-shrink-0"
            >
              {isLoading ? (
                isStreaming ? (
                  <Pause className="w-4 h-4 sm:w-5 sm:h-5" />
                ) : (
                  <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                )
              ) : (
                <Send className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </button>
          </form>
        </div>
      </div>

      {showingSavingsGoals && (
        <div className="w-1/2 h-full overflow-y-auto border-l border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold">Your Savings Goals</h2>
            <p className="text-sm text-gray-500">Click on a goal to edit it</p>
          </div>
          <SavingsGoalsList onSelectGoal={handleGoalSelection} />
        </div>
      )}
    </div>
  );
};
