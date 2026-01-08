import React, { useState, useEffect, useRef } from 'react';
import { Plus, X } from 'lucide-react';

interface CategoryAutocompleteProps {
    value: string;
    onChange: (category: string) => void;
    categories: string[];
    onAddCategory?: (category: string) => void;
    required?: boolean;
    placeholder?: string;
}

const CategoryAutocomplete: React.FC<CategoryAutocompleteProps> = ({
    value,
    onChange,
    categories,
    onAddCategory,
    required = false,
    placeholder = 'Type to search or add new category...',
}) => {
    const [inputValue, setInputValue] = useState(value);
    const [isOpen, setIsOpen] = useState(false);
    const [filteredCategories, setFilteredCategories] = useState<string[]>([]);
    const [isNewCategory, setIsNewCategory] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setInputValue(value);
    }, [value]);

    useEffect(() => {
        if (inputValue.trim() === '') {
            setFilteredCategories(categories);
            setIsNewCategory(false);
        } else {
            const filtered = categories.filter(cat =>
                cat.toLowerCase().includes(inputValue.toLowerCase())
            );
            setFilteredCategories(filtered);
            
            const isNew = !categories.some(cat => 
                cat.toLowerCase() === inputValue.toLowerCase().trim()
            );
            setIsNewCategory(isNew && inputValue.trim() !== '');
        }
    }, [inputValue, categories]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setInputValue(newValue);
        setIsOpen(true);
    };

    const handleSelectCategory = (category: string) => {
        setInputValue(category);
        onChange(category);
        setIsOpen(false);
        setIsNewCategory(false);
    };

    const handleAddNewCategory = () => {
        const trimmedValue = inputValue.trim();
        if (trimmedValue && isNewCategory) {
            if (onAddCategory) {
                onAddCategory(trimmedValue);
            }
            onChange(trimmedValue);
            setIsOpen(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (isNewCategory && inputValue.trim()) {
                handleAddNewCategory();
            } else if (filteredCategories.length > 0) {
                handleSelectCategory(filteredCategories[0]);
            }
        } else if (e.key === 'Escape') {
            setIsOpen(false);
        }
    };

    const handleFocus = () => {
        setIsOpen(true);
    };

    return (
        <div ref={containerRef} className="relative w-full">
            <div className="relative">
                <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    onFocus={handleFocus}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    required={required}
                    className="block w-full px-4 py-3 rounded-lg border-gray-300 shadow-sm focus:ring-ruju-blue focus:border-ruju-blue transition-colors border pr-10"
                />
                {inputValue && (
                    <button
                        type="button"
                        onClick={() => {
                            setInputValue('');
                            onChange('');
                            setIsOpen(false);
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X size={16} />
                    </button>
                )}
            </div>

            {isOpen && (filteredCategories.length > 0 || isNewCategory) && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                    {filteredCategories.length > 0 && (
                        <div className="p-1">
                            <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Existing Categories
                            </div>
                            {filteredCategories.map((category, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    onClick={() => handleSelectCategory(category)}
                                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded transition-colors flex items-center gap-2"
                                >
                                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                    {category}
                                </button>
                            ))}
                        </div>
                    )}
                    {isNewCategory && inputValue.trim() && (
                        <div className="border-t border-gray-200 p-1">
                            <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Add New Category
                            </div>
                            <button
                                type="button"
                                onClick={handleAddNewCategory}
                                className="w-full text-left px-3 py-2 text-sm text-green-700 hover:bg-green-50 rounded transition-colors flex items-center gap-2 font-medium"
                            >
                                <Plus size={16} className="text-green-600" />
                                <span>Add "{inputValue.trim()}"</span>
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default CategoryAutocomplete;

