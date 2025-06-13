import { useInfiniteQuery } from '@tanstack/react-query';
import { useVirtualizer } from '@tanstack/react-virtual';
import axios from 'axios';
import { useRef, useEffect } from 'react';

// API 기본 URL 및 이미지 리스트 API URL 상수 선언
const BASE_URL = 'http://172.16.7.76:15460';

const API_URL = `${BASE_URL}/api/v1/files/image/list`;
const IMAGES_PER_ROW = 4;

// axios 인스턴스 생성 (기본 설정 포함)
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
  withCredentials: true,
});

// 이미지 가상 스크롤링 컴포넌트
export default function Virtualization() {
  // 스크롤 컨테이너 ref
  const parentRef = useRef(null);

  // 이미지 데이터 페이징 요청 함수
  const fetchData = async ({ pageParam = 1 }) => {
    const response = await axiosInstance.get(
      `${API_URL}?page=${pageParam}&size=40`
    );
    return response.data;
  };

  // react-query의 useInfiniteQuery로 무한 스크롤 데이터 관리
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ['images'],
      queryFn: fetchData,
      initialPageParam: 1,
      getNextPageParam: (lastPage, pages) =>
        lastPage.length === 0 ? undefined : pages.length + 1,
    });

  // 모든 페이지의 아이템을 1차원 배열로 합침
  const items = data?.pages.flat() || [];

  // 행(row) 개수 계산 (마지막에 더 불러올 데이터가 있으면 1 추가)
  const rowCount =
    Math.ceil(items.length / IMAGES_PER_ROW) + (hasNextPage ? 1 : 0);

  // 행 단위로 가상화 설정
  const rowVirtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 240, // 각 행의 높이(px) 추정값
    overscan: 15, // 미리 렌더링할 행 개수
  });

  // 스크롤이 마지막 행에 도달하면 다음 페이지 데이터 요청
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

  // 렌더링: 스크롤 컨테이너 및 가상화된 행 렌더링
  return (
    <div
      ref={parentRef}
      className="h-[720px] w-[600px] overflow-auto border rounded"
    >
      <div
        style={{ height: rowVirtualizer.getTotalSize(), position: 'relative' }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          // 각 행의 시작 인덱스 및 행에 포함될 이미지 추출
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
                // 데이터가 없으면 로딩 표시
                <div className="text-center text-gray-500 py-8">Loading...</div>
              ) : (
                // 이미지 1행(4개)씩 그리드로 렌더링
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
