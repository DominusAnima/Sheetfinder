import { useEffect, useState } from "react";
import { deleteCharacter, getDocList, saveNew } from "../firebase";
import { DEFAULT_STATE } from "../DefaultState";
import Button from "../Components/Button";
import { QueryDocumentSnapshot, DocumentData } from "firebase/firestore";
import Container from "../Components/Container";

export function DocSelectPage({
  userId,
  docIdSetter,
}: {
  userId: string;
  docIdSetter: React.Dispatch<React.SetStateAction<string | undefined>>;
}) {
  const [docList, setDocList] = useState<QueryDocumentSnapshot<DocumentData, DocumentData>[]>();

  useEffect(() => {
    async function fetchDocList() {
      try {
        setDocList(await getDocList(userId));
      } catch (error) {
        if (error == "empty") {
          console.log("No saved docs found. Creating a new doc.");
          docIdSetter(await saveNew(DEFAULT_STATE, userId));
        } else {
          console.error(error);
        }
      }
    }
    fetchDocList();
  }, []);

  if (docList == undefined) {
    return <label>Loading</label>;
  } else {
    return <LoadedSelectPage userId={userId} docList={docList} docIdSetter={docIdSetter} />;
  }
}

function LoadedSelectPage({
  userId,
  docList,
  docIdSetter,
}: {
  userId: string;
  docList: QueryDocumentSnapshot<DocumentData, DocumentData>[];
  docIdSetter: React.Dispatch<React.SetStateAction<string | undefined>>;
}) {
  return (
    <Container>
      <Button
        onClick={async () => {
          docIdSetter(await saveNew(DEFAULT_STATE, userId));
        }}
      >
        Create new Character
      </Button>
      <table className="table table--striped w-full mt-4">
        <thead>
          <tr>
            <th className="whitespace-nowrap">Character Name</th>
            <th className="whitespace-nowrap">Character Level</th>
          </tr>
        </thead>
        <tbody>
          {docList.map((e) => (
            <tr>
              <td>{e.data().bio.name}</td>
              <td>{e.data().classRecorder.totals.levels}</td>
              <td>
                <Button onClick={() => docIdSetter(e.id)}>Open Character Sheet</Button>
              </td>
              <td>
                <Button
                  onClick={() => {
                    if (confirm("Are you sure you want to pemanently delete this character?")) {
                      deleteCharacter(e.id);
                    }
                  }}
                >
                  Delete Character
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Container>
  );
}
