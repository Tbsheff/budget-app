import { useState, useEffect } from "react";
import axios from "axios";
import { useToast } from "./ui/use-toast";
import { CategorySection } from "./Categories/CategorySection";

// Define the Category type
interface Category {
  category_id: number;
  user_id: number;
  default_category_id?: number;
  name: string;
  monthly_budget: number;
  created_at?: string;
  icon_name: string;
  icon_color: string;
}

interface BudgetCategoriesProps {
  currentDate: Date;
}

export function BudgetCategories({ currentDate }: BudgetCategoriesProps) {
  const { toast } = useToast();
  const [categoriesWithSubcategories, setCategoriesWithSubcategories] =
    useState<Record<number, { category: Category; subcategories: Category[] }>>(
      {}
    );

  const [loading, setLoading] = useState(true);
  const [aggregatedTotals, setAggregatedTotals] = useState<
    Record<number, number>
  >({});
  const [aggregatedEarnings, setAggregatedEarnings] = useState<number>(0);

  // Fetch both categories and subcategories
  useEffect(() => {
    const fetchCategoriesAndSubcategories = async () => {
      try {
        const token = localStorage.getItem("token");

        // Fetch Categories
        const categoryResponse = await axios.get<Category[]>(
          "/api/user-categories",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // Fetch Subcategories
        const subcategoryResponse = await axios.get<Category[]>(
          "/api/subcategories",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // Organize subcategories under their parent category
        const categoryMap: Record<
          number,
          { category: Category; subcategories: Category[] }
        > = {};
        categoryResponse.data.forEach((category) => {
          categoryMap[category.category_id] = { category, subcategories: [] };
        });

        subcategoryResponse.data.forEach((sub) => {
          if (categoryMap[sub.category_id]) {
            categoryMap[sub.category_id].subcategories.push(sub);
          }
        });

        setCategoriesWithSubcategories(categoryMap);
      } catch (error) {
        console.error("Error fetching categories and subcategories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoriesAndSubcategories();
  }, []);

  const handleIconChange = (categoryId: number, newIconName: string) => {
    setCategoriesWithSubcategories((prev) => {
      const updatedCategories = { ...prev };

      if (updatedCategories[categoryId]) {
        updatedCategories[categoryId] = {
          ...updatedCategories[categoryId],
          category: {
            ...updatedCategories[categoryId].category,
            icon_name: newIconName, // ✅ Update the icon
          },
        };
      }

      return updatedCategories;
    });
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      {Object.values(categoriesWithSubcategories).map(
        ({ category, subcategories }) => (
          <CategorySection
            key={category.category_id}
            category={category}
            subcategories={subcategories}
            aggregatedTotals={aggregatedTotals}
            aggregatedEarnings={aggregatedEarnings}
            currentDate={currentDate}
            onIconChange={handleIconChange} // Pass the function as a prop
          />
        )
      )}
    </div>
  );
}
