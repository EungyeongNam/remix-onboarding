import { useCallback, useMemo } from "react";
import { useNavigate, useLocation } from "remix"

interface CustomizedState {
    state: {
        page?: any;
        perPage?: any;
    }
}

export const usePagination = (pathname: string, defaultPageSize = 5) => {
    const navigate = useNavigate();
    const location = useLocation();

    const setPageIndex = useCallback((page) => {
        void navigate(
            pathname,
            {
                state: { page },
                replace: false
            },
        )
    }, [navigate, pathname]);

    const setPageSize = useCallback((perPage) => {
        const params = { page: 1, perPage };
        void navigate(
            pathname,
            {
                state: { params },
                replace: false
            }
        )
    }, [navigate, pathname]);

    const locationState = useLocation() as unknown as CustomizedState;

    const pageIndex = useMemo(() => locationState.state?.page ?? 1, [locationState.state?.page]);
    const pageSize = useMemo(() => locationState.state?.perPage ?? defaultPageSize, [defaultPageSize, locationState.state?.perPage]);


    console.log(location);

    return {
        pageIndex,
        setPageIndex,
        pageSize,
        setPageSize
    }
}

