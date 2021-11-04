// import { Display } from "./Display";
import { useRef, useState } from "react";
import { Display } from "./Display";
import { PositionsTable } from "./PositionsTable";

function App() {
    const tableRef = useRef();
    const [selectedTicker, setSelectedTicker] = useState(null);

    console.log(selectedTicker);
    return <div style={{ display: 'inline-flex' }}>
        <div>
            <PositionsTable ref={tableRef} setSelectedTicker={setSelectedTicker}/>
        </div>
        <div>
            <Display symbol={selectedTicker}/>
        </div>
    </div>;
}

export default App;