import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { installImageFallback } from "./lib/imageFallback";
import "./index.css";

installImageFallback();

createRoot(document.getElementById("root")!).render(<App />);
