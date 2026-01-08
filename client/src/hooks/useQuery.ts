import { useLocation } from 'react-router-dom';

/**
 * Custom hook to parse URL query parameters
 */
export const useQuery = () => {
    return new URLSearchParams(useLocation().search);
};
