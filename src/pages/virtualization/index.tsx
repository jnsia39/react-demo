import { useQueries } from '@tanstack/react-query';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef, useEffect, useState, useMemo } from 'react';
import ImageDetails from './components/ImageDetails';
import { useNavigate } from 'react-router-dom';
import { cloudApi } from '@shared/lib/axios/axios';
import VirtualImageRow from './components/VirtualImageRow';

const BASE_URL = import.meta.env.VITE_AWS_URL;
const API_URL = `/api/v1/files/image/list`;
const PAGE_SIZE = 40;

interface PageResponse {
  content: string[];
  totalElements: number;
}

export default function Virtualization() {
  const parentRef = useRef<HTMLDivElement | null>(null);

  const abortControllers = useRef<Record<number, AbortController>>({});
  const [totalElements, setTotalElements] = useState(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imagesPerRow, setImagesPerRow] = useState(16);
  const [size, setSize] = useState('42.195KB');

  const navigate = useNavigate();

  const goHome = () => {
    navigate('/');
  };

  const rowCount = Math.ceil(totalElements / imagesPerRow) || 1;

  const estimateSize = useMemo(() => {
    if (imagesPerRow === 16) return 72;
    if (imagesPerRow === 8) return 140;
    return 80;
  }, [imagesPerRow]);

  const rowVirtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => parentRef.current,
    estimateSize: () => estimateSize,
    overscan: 20,
  });

  // 현재 보이는 row에서 필요한 page 번호 계산
  const neededPages = useMemo(() => {
    const set = new Set<number>();

    rowVirtualizer.getVirtualItems().forEach((row) => {
      const startIndex = row.index * imagesPerRow;
      const page = Math.floor(startIndex / PAGE_SIZE) + 1;
      set.add(page);
    });

    return Array.from(set);
  }, [rowVirtualizer.getVirtualItems(), imagesPerRow]);

  // useQueries로 여러 page 쿼리 선언적으로 호출 (AbortController 적용)
  const pageResults = useQueries({
    queries: neededPages.map((page) => ({
      queryKey: ['images', page],
      queryFn: async (): Promise<PageResponse> => {
        // 이전 요청이 있다면 취소
        if (abortControllers.current[page]) {
          abortControllers.current[page].abort();
        }
        const controller = new AbortController();
        abortControllers.current[page] = controller;
        try {
          const response = await cloudApi.get(
            `${API_URL}?page=${page}&size=${PAGE_SIZE}`,
            { signal: controller.signal }
          );
          return response.data;
        } finally {
          // 요청 완료 후 컨트롤러 정리
          delete abortControllers.current[page];
        }
      },
      staleTime: 1000 * 60 * 5,
    })),
  });

  // neededPages에 없는 page의 요청은 즉시 취소
  useEffect(() => {
    const controllers = abortControllers.current;
    Object.keys(controllers).forEach((pageStr) => {
      const page = Number(pageStr);
      if (!neededPages.includes(page)) {
        controllers[page]?.abort();
        delete controllers[page];
      }
    });
  }, [neededPages]);

  // totalElements는 첫 번째 로딩된 page에서만 갱신
  useEffect(() => {
    const firstLoaded = pageResults.find((r) => r.data?.totalElements);
    if (firstLoaded?.data?.totalElements) {
      setTotalElements(firstLoaded.data.totalElements);
    }
  }, [pageResults]);

  // 모든 캐시된 페이지를 하나의 배열로 합침
  const items: string[] = useMemo(() => {
    const arr: string[] = [];
    const maxPage = Math.ceil(totalElements / PAGE_SIZE);

    for (let page = 1; page <= maxPage; page++) {
      const found = pageResults.find((_, idx) => neededPages[idx] === page);
      if (found?.data?.content) {
        arr.push(...found.data.content);
      } else {
        arr.push(...Array(PAGE_SIZE).fill(undefined));
      }
    }

    return arr;
  }, [pageResults, totalElements, neededPages]);

  const handleClickImage = async (image: string) => {
    const response = await cloudApi.get(`/api/v1/files/image/${image}`);

    setSize(`${response.data / 1000}KB`);
    setSelectedImage(image);
  };

  // 이미지 클릭 핸들러 추가 및 오른쪽 패널 추가
  return (
    <div className="flex flex-col flex-1 items-center justify-center min-h-screen w-full bg-gradient-to-br from-gray-50 to-gray-200">
      <div className="flex flex-col w-full max-w-6xl mx-auto">
        {/* 상단 총 개수 및 행 개수 조절 UI */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-6 px-2">
          <div className="flex items-center gap-4">
            <button
              className="px-4 py-1.5 rounded-lg border text-sm font-semibold transition-colors duration-150 bg-white hover:bg-blue-50 border-gray-300 shadow-sm"
              onClick={goHome}
            >
              뒤로가기
            </button>
            <div className="font-semibold text-gray-700 text-base">
              총 개수:{' '}
              <span className="font-mono">
                {totalElements.toLocaleString()}
              </span>
              개
            </div>
          </div>
          <div className="flex items-center gap-2 mt-2 md:mt-0">
            {[8, 16].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => setImagesPerRow(num)}
                className={`px-4 py-1.5 rounded-lg border text-sm font-semibold transition-colors duration-150 shadow-sm
              ${
                imagesPerRow === num
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50'
              }`}
              >
                {num}개씩 보기
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-6 w-full">
          <div
            ref={parentRef}
            className="w-full md:w-[80%] min-h-[60vh] max-h-[80vh] overflow-auto border rounded-xl bg-white shadow-lg"
          >
            <div
              style={{
                height: rowVirtualizer.getTotalSize(),
                position: 'relative',
              }}
            >
              {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                const startIndex = virtualRow.index * imagesPerRow;
                const rowItems = items.slice(
                  startIndex,
                  startIndex + imagesPerRow
                );
                return (
                  <div
                    key={virtualRow.key}
                    className="absolute left-0 right-0"
                    style={{
                      top: 0,
                      height: virtualRow.size,
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                  >
                    <VirtualImageRow
                      rowItems={rowItems}
                      startIndex={startIndex}
                      imagesPerRow={imagesPerRow}
                      selectedImage={selectedImage}
                      onClick={handleClickImage}
                      baseUrl={BASE_URL}
                    />
                  </div>
                );
              })}
            </div>
          </div>
          <div className="w-full md:w-[20%]">
            <ImageDetails source={selectedImage} size={size} />
          </div>
        </div>
      </div>
    </div>
  );
}
