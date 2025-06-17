import { useQueries } from '@tanstack/react-query';
import { useVirtualizer } from '@tanstack/react-virtual';
import axios from 'axios';
import { useRef, useEffect, useState, useMemo } from 'react';

const BASE_URL = 'http://172.16.7.76:15460';
const API_URL = `${BASE_URL}/api/v1/files/image/list`;
const PAGE_SIZE = 80;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
  withCredentials: true,
});

// Page<T> 타입 정의
interface PageResponse {
  content: string[];
  totalElements: number;
  // ...필요시 다른 필드 추가
}

export default function Virtualization() {
  const parentRef = useRef(null);
  const [totalElements, setTotalElements] = useState(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageMeta, setImageMeta] = useState<any>(null);
  const [imagesPerRow, setImagesPerRow] = useState(16);

  const rowCount = Math.ceil(totalElements / imagesPerRow) || 1;

  const estimateSize = useMemo(() => {
    if (imagesPerRow === 16) return 80;
    if (imagesPerRow === 8) return 148;
    return 80;
  }, [imagesPerRow]);

  const rowVirtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => parentRef.current,
    estimateSize: () => estimateSize,
    overscan: 8,
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

  // useQueries로 여러 page 쿼리 선언적으로 호출
  const pageResults = useQueries({
    queries: neededPages.map((page) => ({
      queryKey: ['images', page],
      queryFn: async (): Promise<PageResponse> => {
        const response = await axiosInstance.get(
          `${API_URL}?page=${page}&size=${PAGE_SIZE}`
        );
        return response.data;
      },
      staleTime: 1000 * 60 * 5,
    })),
  });

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

  // 랜덤 메타데이터 생성 함수
  function generateRandomMeta(image: string) {
    return {
      name: image,
      filePath: `/data/com.google.android.apps.books/files/accounts/gmdsystem2012@gmail.com/volumes/${image}`,
      hash:
        'MD5 : ' +
        Math.random().toString(36) +
        '\n' +
        'SHA256 : ' +
        Math.random().toString(36),
      size: Math.floor(Math.random() * 5000) + 100 + ' KB',
      type: 'PNG',
      uploadedAt: new Date(Date.now() - Math.random() * 1e10).toLocaleString(),
      resolution: `${Math.floor(Math.random() * 1000) + 500}x${
        Math.floor(Math.random() * 1000) + 500
      }`,
    };
  }

  // 이미지 클릭 핸들러 추가 및 오른쪽 패널 추가
  return (
    <div className="flex flex-col">
      {/* 상단 총 개수 및 행 개수 조절 UI */}
      <div className="flex items-center justify-between">
        <div className="text-lg font-semibold text-gray-700">
          총 개수: {totalElements.toLocaleString()}개
        </div>
        <div className="flex items-center">
          {[8, 16].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => setImagesPerRow(num)}
              className={`px-3 py-1 rounded border text-sm font-medium transition-colors duration-100
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
      <div className="flex">
        <div
          ref={parentRef}
          className="h-[720px] w-[1200px] overflow-auto border rounded"
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
              const isEmpty = rowItems.every((item) => item === undefined);

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
                    <div className={`grid grid-cols-${imagesPerRow} gap-4`}>
                      {Array.from({ length: imagesPerRow }).map(
                        (item, index) => (
                          <div
                            key={startIndex + index}
                            className={`flex flex-col items-center border rounded p-2 cursor-pointer ${
                              selectedImage === item
                                ? 'ring-2 ring-blue-500'
                                : ''
                            }`}
                          >
                            <div
                              className={`w-full ${
                                imagesPerRow === 16 ? 'h-16' : 'h-32'
                              } object-cover rounded justify-center items-center flex text-xs`}
                            >
                              Loading
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  ) : (
                    <div
                      className={
                        imagesPerRow === 16
                          ? `grid grid-cols-16 gap-4`
                          : `grid grid-cols-8 gap-4`
                      }
                    >
                      {rowItems.map((item, index) =>
                        item ? (
                          <div
                            key={startIndex + index}
                            className={`flex flex-col items-center border rounded p-2 cursor-pointer ${
                              selectedImage === item
                                ? 'ring-2 ring-blue-500'
                                : ''
                            }`}
                            onClick={() => {
                              setSelectedImage(item);
                              setImageMeta(generateRandomMeta(item));
                            }}
                          >
                            <img
                              src={`${BASE_URL}/${item}`}
                              alt={item}
                              loading="lazy"
                              className={`w-full ${
                                imagesPerRow === 16 ? 'h-16' : 'h-32'
                              } object-cover rounded`}
                            />
                          </div>
                        ) : (
                          <div
                            key={startIndex + index}
                            className={`flex flex-col items-center border rounded p-2 cursor-pointer ${
                              selectedImage === item
                                ? 'ring-2 ring-blue-500'
                                : ''
                            }`}
                          >
                            <div
                              className={`w-full ${
                                imagesPerRow === 16 ? 'h-16' : 'h-32'
                              } object-cover rounded justify-center items-center flex text-xs`}
                            >
                              Loading
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        {/* 오른쪽 메타데이터 패널 */}
        <div className="ml-6 w-80 h-[720px] border rounded p-4 bg-white shadow-lg flex flex-col">
          {selectedImage && imageMeta ? (
            <>
              <div className="flex flex-col items-center mb-4">
                <img
                  src={`${BASE_URL}/${selectedImage}`}
                  alt={selectedImage}
                  className="w-60 h-48 object-contain bg-gray-100 border rounded shadow mb-2"
                />
                <span className="text-xs text-gray-500 break-all">
                  {imageMeta.filePath}
                </span>
              </div>
              <h2 className="text-lg font-bold mb-3 border-b pb-1"></h2>
              <ul className="text-sm space-y-2">
                {Object.entries(imageMeta)
                  .filter(([k]) => k !== 'filePath')
                  .map(([k, v]) => (
                    <li
                      key={k}
                      className="flex justify-between border-b pb-1 last:border-b-0 last:pb-0"
                    >
                      <span className="font-semibold text-gray-700 capitalize">
                        {k}
                      </span>
                      <span className="text-gray-900 text-right ml-2 break-all whitespace-pre-line">
                        {String(v)}
                      </span>
                    </li>
                  ))}
              </ul>
            </>
          ) : (
            <div className="flex flex-1 flex-col justify-center items-center text-gray-400">
              <span className="text-2xl mb-2">🖼️</span>
              <div>
                이미지를 클릭하면
                <br />
                메타데이터가 표시됩니다.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
