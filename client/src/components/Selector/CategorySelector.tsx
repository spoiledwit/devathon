import { useEffect, useRef, useState } from 'react';
import { categories as categoryList } from '@/constants/index'

const CategorySelector = ({ selected, setSelected, limit = 5 }: { selected: string[]; setSelected: any; limit?: number }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [newCategory, setNewCategory] = useState<string>('');
    const [categories, setCategories] = useState<string[]>(
        categoryList.map((category: any) => category.name)
    );
    const divRef = useRef<HTMLDivElement>(null);

    const handleCategorySelect = (category: string) => {
        if (selected.length >= limit) return;

        if (!selected.includes(category)) {
            setSelected([...selected, category]);
        }
        setDropdownOpen(false);
    };

    const handleCategoryRemove = (category: string) => {
        setSelected(selected.filter(cat => cat !== category));
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (divRef.current && !divRef.current.contains(event.target as Node)) {
            setDropdownOpen(false);
        }
    };
    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="relative w-full">
            <div className="flex flex-wrap w-full gap-2 p-2 border rounded-md">
                {selected.map(category => (
                    <div key={category} className="flex items-center bg-gray-200 rounded-full px-3 py-1">
                        <span className="text-sm">{category}</span>
                        <button
                            onClick={() => handleCategoryRemove(category)}
                            className="ml-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                ))}
                {
                    (selected.length < limit) &&
                    <button
                        onClick={(e) => { e.preventDefault(); setDropdownOpen(!dropdownOpen) }}
                        className="text-gray-500 hover:text-gray-700 focus:outline-none"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                    </button>
                }
            </div>
            {dropdownOpen && (
                <div ref={divRef} className="absolute z-10  w-full mt-1 bg-white border rounded-md shadow-lg">
                    {categories.filter(category => !selected.includes(category)).map(category => (
                        <button
                            key={category}
                            onClick={() => handleCategorySelect(category)}
                            className="block w-full text-left px-4 py-2 hover:bg-gray-100 focus:outline-none"
                        >
                            {category}
                        </button>
                    ))}
                    <div className='flex flex-row items-center px-3 mb-3 gap-2'>
                        <input onChange={(e) => setNewCategory(e.target.value)} className='w-full px-3 py-1 border rounded outline-none focus:outline-none' type='text' placeholder='New category' />
                        <button onClick={(e) => {
                            e.preventDefault();
                            if (newCategory === '') return;
                            setSelected([...selected, newCategory]);
                            setCategories([...categories, newCategory]);
                            setNewCategory('');
                        }} className='bg-black text-white rounded cursor-pointer w-1/12 h-8 border border-black'>Create</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CategorySelector;