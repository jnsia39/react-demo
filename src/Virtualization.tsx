import { useInfiniteQuery } from '@tanstack/react-query';
import { useVirtualizer } from '@tanstack/react-virtual';
import axios from 'axios';
import { useRef, useEffect } from 'react';

const BASE_URL = 'http://172.16.7.76:15460';

const API_URL = `${BASE_URL}/api/v1/files/image/list`;
const IMAGES_PER_ROW = 4;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
  withCredentials: true,
});

export default function Virtualization() {
  const parentRef = useRef(null);

  const fetchData = async ({ pageParam = 1 }) => {
    const response = await axiosInstance.get(
      `${API_URL}?page=${pageParam}&size=40`
    );
    return response.data;
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ['images'],
      queryFn: fetchData,
      initialPageParam: 1,
      getNextPageParam: (lastPage, pages) =>
        lastPage.length === 0 ? undefined : pages.length + 1,
    });

  const items = data?.pages.flat() || [];

  const rowCount =
    Math.ceil(items.length / IMAGES_PER_ROW) + (hasNextPage ? 1 : 0);

  const rowVirtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 240,
    overscan: 15,
  });

  useEffect(() => {
    const [lastItem] = [...rowVirtualizer.getVirtualItems()].reverse();

    if (!lastItem) return;
    if (
      lastItem.index >= Math.ceil(items.length / IMAGES_PER_ROW) - 1 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  }, [
    rowVirtualizer.getVirtualItems(),
    hasNextPage,
    isFetchingNextPage,
    items.length,
  ]);

  return (
    <div
      ref={parentRef}
      className="h-[720px] w-[600px] overflow-auto border rounded"
    >
      <div
        style={{ height: rowVirtualizer.getTotalSize(), position: 'relative' }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const startIndex = virtualRow.index * IMAGES_PER_ROW;
          const rowItems = items.slice(startIndex, startIndex + IMAGES_PER_ROW);
          const isEmpty = rowItems.length === 0;

          return (
            <div
              key={virtualRow.key}
              className="absolute left-0 right-0 px-4"
              style={{
                top: 0,
                height: virtualRow.size,
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              {isEmpty ? (
                <div className="text-center text-gray-500 py-8">Loading...</div>
              ) : (
                <div className="grid grid-cols-4 gap-4">
                  {rowItems.map((item, index) => (
                    <div
                      key={startIndex + index}
                      className="flex flex-col items-center border rounded p-2"
                    >
                      <img
                        src={`${BASE_URL}/${item}`}
                        alt={item}
                        loading="lazy"
                        className="w-full h-40 object-cover rounded"
                      />
                      <h3
                        className="mt-2 text-sm text-center break-all overflow-hidden text-ellipsis"
                        style={{ maxHeight: '3em' }}
                      >
                        {item}
                      </h3>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
