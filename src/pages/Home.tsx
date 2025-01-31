import UseContext from '../components/UseContext';
import UseEffect from '../components/useEffect';
import UseImperativeHandler from '../components/UseImperativeHandler';
import UseLayoutEffect from '../components/UseLayoutEffect';
import UseReducer from '../components/UseReducer';
import UseRef from '../components/UseRef';
import UseState from '../components/UseState';

export default function Home() {
  return (
    <>
      {/* <UseState /> */}
      {/* <UseReducer /> */}
      {/* <UseEffect /> */}
      {/* <UseLayoutEffect /> */}
      {/* <UseRef /> */}
      {/* <UseImperativeHandler /> */}
      <UseContext />
    </>
  );
}

// const [dimensions, setDimensions] = useState({ width: 200, height: 200 });

// useEffect(() => {
//   const resizeObserver = new ResizeObserver((entries) => {
//     for (const entry of entries) {
//       const { width, height } = entry.contentRect;
//       setDimensions({ width, height });
//     }
//   });

//   if (chartContainerRef.current) {
//     resizeObserver.observe(chartContainerRef.current);
//   }

//   return () => {
//     if (chartContainerRef.current) {
//       resizeObserver.unobserve(chartContainerRef.current);
//     }
//   };
// }, []);
