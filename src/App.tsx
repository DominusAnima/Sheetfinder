import { useState } from "react";
import Container from "./Components/Container.tsx";
import "./constants.tsx";
import { LoginPage } from "./Pages/LoginPage.tsx";
import { SheetPage } from "./Pages/SheetPage.tsx";
import { DocSelectPage } from "./Pages/DocSelectPage.tsx";

export default function App() {
  const [userId, setUserId] = useState<string>();
  const [dataId, setDataId] = useState<number>();

  console.log("New user state", userId, dataId);

  return (
    <Container>
      <h1
        className="text-lg font-bold text-center mb-4"
        style={{ marginBottom: "0px", paddingBottom: "1rem", borderBottom: "solid 1px black" }}
      >
        SheetFinder
      </h1>
      {userId != undefined ? (
        dataId != undefined ? (
          <SheetPage userId={userId} docId={dataId} docIdSetter={setDataId} userIdSetter={setUserId} />
        ) : (
          <DocSelectPage userId={userId} docIdSetter={setDataId} userIdSetter={setUserId} />
        )
      ) : (
        <LoginPage userIdSetter={setUserId} />
      )}
    </Container>
  );
}
