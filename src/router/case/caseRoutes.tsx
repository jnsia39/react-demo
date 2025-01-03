import CaseStatus from "../../page/case/CaseStatus";
import CaseDetails from "../../page/case/CaseDetails";
import CaseReports from "../../page/case/CaseReports";

const caseRoutes = [
  {
    path: "",
    element: <CaseStatus />,
  },
  {
    path: "details",
    element: <CaseDetails />,
  },
  {
    path: "reports",
    element: <CaseReports />,
  },
]

export default caseRoutes