import { useEffect, useState } from "react";
import Container from "./Components/Container.tsx";
import "./constants.tsx";
import { monitorAuthState } from "./firebase.ts";
import { LoginPage } from "./Pages/LoginPage.tsx";
import { SheetPage } from "./Pages/SheetPage.tsx";
import { DocSelectPage } from "./Pages/DocSelectPage.tsx";

export default function App() {
  const [userId, setUserId] = useState<string>();
  const [dataId, setDataId] = useState<string>();
  const [page, setPage] = useState<JSX.Element>(<LoginPage />);

  useEffect(() => {
    monitorAuthState(setUserId, setDataId);
  }, []);

  useEffect(() => {
    console.log("New user state", userId, dataId);
    if (userId != undefined) {
      if (dataId != undefined) {
        setPage(<SheetPage userId={userId} docId={dataId} docIdSetter={setDataId} />);
      } else {
        setPage(<DocSelectPage userId={userId} docIdSetter={setDataId} />);
      }
    } else {
      setPage(<LoginPage />);
    }
  }, [userId, dataId]);

  return (
    <Container>
      <h1 className="text-lg font-bold text-center mb-4">Pathfinder digital character sheet prototype</h1>
      {page}
    </Container>
  );
}
