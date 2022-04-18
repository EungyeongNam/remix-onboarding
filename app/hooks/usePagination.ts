import { useCallback, useMemo } from "react";
import { useNavigate, useLocation } from "remix"

interface CustomizedState {
    state: {
        page?: any;
        perPage?: any;
        name?: any;
    }
}

export const usePagination = (pathname: string, defaultPageSize = 5, defaultName = "") => {
    const navigate = useNavigate();
    const location = useLocation();
    const locationState = useLocation() as unknown as CustomizedState;

    // 페이지 네비게이션
    const pageIndex = useMemo(() => locationState.state?.page ?? 1, [locationState.state]);
    const setPageIndex = useCallback((page) => {
        return navigate(
            pathname,
            {
                state: { page },
                replace: false
            },
        )
    }, [navigate, pathname]);

    // 보여지는 페이지 수
    const pageSize = useMemo(() => locationState.state?.perPage ?? defaultPageSize, [defaultPageSize, locationState.state]);
    const setPageSize = useCallback((perPage) => {
        const params = { page: 1, perPage };
        return navigate(
            pathname,
            {
                state: { params },
                replace: false
            }
        )
    }, [navigate, pathname]);

    // 게시판 검색
    const filters = useMemo(() => {
        return {
            name: locationState.state?.name ?? defaultName
        };
    }, [defaultName, locationState.state]);

    const setFilters = useCallback((filters) => {
        const name = filters?.name;
        return navigate(
            pathname,
            {
                state: { page: 1, name },
                replace: false,
            }
        )
    }, [navigate, pathname]);

    // console.log(location);

    return {
        pageIndex,
        setPageIndex,
        pageSize,
        setPageSize,
        setFilters,
        filters
    }
}

