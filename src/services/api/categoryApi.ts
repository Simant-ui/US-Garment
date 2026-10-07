export interface BilingualCategoryName {
  en?: string;
  ne?: string;
}

export interface CategoryData {
  id?: string;
  _id?: string;
  name: BilingualCategoryName | string;
  slug: string;
  description?: BilingualCategoryName | string;
  image: string;
  icon?: string;
  parentCategory?: string | null;
  isActive: boolean;
  sortOrder?: number;
  productCount?: number;
  subcategories?: CategoryData[];
  createdAt?: string;
  updatedAt?: string;
}

export const getCategoryTree = async (): Promise<{ tree: CategoryData[]; all: CategoryData[] }> => {
  const res = await fetch('/api/v1/categories', { cache: 'no-store' });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch categories');
  return data.data || { tree: [], all: [] };
};

export const getCategoryBySlug = async (slug: string): Promise<CategoryData> => {
  const res = await fetch(`/api/v1/categories/slug/${slug}`, { cache: 'no-store' });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch category');
  return data.data;
};

export const createCategory = async (formData: Partial<CategoryData>): Promise<CategoryData> => {
  const res = await fetch('/api/v1/categories', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to create category');
  return data.data;
};

export const updateCategory = async (id: string, formData: Partial<CategoryData>): Promise<CategoryData> => {
  const res = await fetch(`/api/v1/categories/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to update category');
  return data.data;
};

export const deleteCategory = async (id: string): Promise<void> => {
  const res = await fetch(`/api/v1/categories/${id}`, { method: 'DELETE' });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to delete category');
};
