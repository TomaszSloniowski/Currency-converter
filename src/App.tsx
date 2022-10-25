import { QueryClient, QueryClientProvider } from "react-query";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import Converter from "./pages/Converter.component";

const queryClient = new QueryClient();

// export default function App() {
//   return (
//     <QueryClientProvider client={queryClient}>
//       <Example />
//     </QueryClientProvider>
//   )
// }

export default function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Routes>
            <Route path="/" element={<Converter />} />
            <Route path="/converter" element={<Converter />} />
          </Routes>
        </Router>
      </QueryClientProvider>
    </>
  );
}
