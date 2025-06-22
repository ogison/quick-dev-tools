import { useRouter } from 'next/navigation';
import { useState, useEffect, useMemo, useCallback } from 'react';

import { TOOLS } from '@/constants/tools';
import type { Tool } from '@/features/tools/types';

export const useHomePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showSearch, setShowSearch] = useState(false);
  const router = useRouter();

  // Get unique categories
  const categories = useMemo(() => {
    const cats = [...new Set(TOOLS.map((tool) => tool.category))];
    return ['all', ...cats];
  }, []);

  // Filter tools based on search and category
  const filteredTools = useMemo(() => {
    let filtered = TOOLS;

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((tool) => tool.category === selectedCategory);
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (tool) =>
          tool.name.toLowerCase().includes(query) ||
          tool.description.toLowerCase().includes(query) ||
          tool.category.toLowerCase().includes(query) ||
          tool.badge.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [searchQuery, selectedCategory]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + K to open search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearch(true);
      }

      // Escape to close search
      if (e.key === 'Escape') {
        setShowSearch(false);
        setSearchQuery('');
      }

      // Number keys to navigate to tools (1-9)
      if (e.key >= '1' && e.key <= '9' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const toolIndex = parseInt(e.key) - 1;
        if (toolIndex < TOOLS.length) {
          const tool = TOOLS[toolIndex];
          router.push(tool.href);
        }
      }

      // Arrow keys for category navigation
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        const currentIndex = categories.indexOf(selectedCategory);
        if (e.key === 'ArrowLeft' && currentIndex > 0) {
          setSelectedCategory(categories[currentIndex - 1]);
        } else if (e.key === 'ArrowRight' && currentIndex < categories.length - 1) {
          setSelectedCategory(categories[currentIndex + 1]);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedCategory, categories, router]);

  // Clear search
  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setShowSearch(false);
  }, []);

  // Reset filters
  const resetFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedCategory('all');
    setShowSearch(false);
  }, []);

  // Navigate to tool
  const navigateToTool = useCallback(
    (tool: Tool) => {
      router.push(tool.href);
    },
    [router]
  );

  // Get category display name
  const getCategoryDisplayName = useCallback((category: string) => {
    if (category === 'all') {
      return 'すべて';
    }
    return category;
  }, []);

  // Get popular tools (first 4)
  const popularTools = useMemo(() => TOOLS.slice(0, 4), []);

  // Get search suggestions
  const searchSuggestions = useMemo(() => {
    if (!searchQuery.trim()) {
      return [];
    }

    const query = searchQuery.toLowerCase();
    const suggestions = new Set<string>();

    TOOLS.forEach((tool) => {
      if (tool.name.toLowerCase().includes(query)) {
        suggestions.add(tool.name);
      }
      if (tool.category.toLowerCase().includes(query)) {
        suggestions.add(tool.category);
      }
      if (tool.badge.toLowerCase().includes(query)) {
        suggestions.add(tool.badge);
      }
    });

    return Array.from(suggestions).slice(0, 5);
  }, [searchQuery]);

  return {
    // State
    searchQuery,
    selectedCategory,
    showSearch,
    filteredTools,
    categories,
    popularTools,
    searchSuggestions,

    // Setters
    setSearchQuery,
    setSelectedCategory,
    setShowSearch,

    // Actions
    clearSearch,
    resetFilters,
    navigateToTool,
    getCategoryDisplayName,
  };
};
