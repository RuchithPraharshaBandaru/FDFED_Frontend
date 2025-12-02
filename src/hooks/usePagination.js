// Custom hook for pagination logic
import { useState, useMemo } from 'react';

export const usePagination = (items, itemsPerPage = 9) => {
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(items.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    const currentItems = useMemo(() => {
        return items.slice(startIndex, endIndex);
    }, [items, startIndex, endIndex]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            handlePageChange(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            handlePageChange(currentPage + 1);
        }
    };

    const resetPage = () => {
        setCurrentPage(1);
    };

    return {
        currentPage,
        totalPages,
        currentItems,
        handlePageChange,
        handlePrevPage,
        handleNextPage,
        resetPage
    };
};

export default usePagination;
