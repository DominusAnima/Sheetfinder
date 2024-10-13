import { useEffect, useState } from "react";
import Container from "./Components/Container.tsx";
import "./constants.tsx";
// import { monitorAuthState } from "./firebase.ts";
import { LoginPage } from "./Pages/LoginPage.tsx";
import { SheetPage } from "./Pages/SheetPage.tsx";
import { DocSelectPage } from "./Pages/DocSelectPage.tsx";

export default function App() {
  const [userId, setUserId] = useState<string>();
  const [dataId, setDataId] = useState<number>();

  // useEffect(() => {
  //   monitorAuthState(setUserId, setDataId);
  // }, []);

  console.log("New user state", userId, dataId);

  return (
    <Container>
      <h1 className="text-lg font-bold text-center mb-4">SheetFinder</h1>
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
