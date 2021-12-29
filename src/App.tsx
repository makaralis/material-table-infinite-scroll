import "./styles.css";
import TableDemo from "./TableDemo";

export default function App() {
  const handleScroll = (e) => {
    console.log("This is div scroll");
  };
  return (
    <div>
      <TableDemo />
    </div>
  );
}
