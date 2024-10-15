import { useEffect, useState } from "react";
import { deleteCharacter, getDocList, logOutGoogle, saveNew } from "../firebase";
import { DEFAULT_STATE } from "../DefaultState";
import Button from "../Components/Button";
import { QueryDocumentSnapshot, DocumentData } from "firebase/firestore";
import Container from "../Components/Container";
import { reducer } from "../reducer";
import Field from "../Components/Field";

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
        if (docList == undefined) {
          setDocList(await getDocList(userId));
        }
      } catch (error) {
        console.error(error);
      }
    }
    fetchDocList();
  }, [docList]);

  if (docList == undefined) {
    return <label className="text-center mb-4">Loading</label>;
  } else {
    return <LoadedSelectPage userId={userId} docList={docList} docIdSetter={docIdSetter} docListSetter={setDocList} />;
  }
}

function LoadedSelectPage({
  userId,
  docList,
  docIdSetter,
  docListSetter,
}: {
  userId: string;
  docList: QueryDocumentSnapshot<DocumentData, DocumentData>[];
  docIdSetter: React.Dispatch<React.SetStateAction<string | undefined>>;
  docListSetter: React.Dispatch<React.SetStateAction<QueryDocumentSnapshot<DocumentData, DocumentData>[] | undefined>>;
}) {
  return (
    <Container>
      <Field className="text-center mb-4">
        <Button
          onClick={async () => {
            docIdSetter(await saveNew(reducer(DEFAULT_STATE, { type: "recalculate" }), userId));
          }}
        >
          Create new Character
        </Button>
        <Button
          onClick={() => {
            if (confirm("Are you sure you want to sign out?")) {
              logOutGoogle();
            }
          }}
        >
          Sign out
        </Button>
      </Field>
      <table className="table table--striped w-full mt-4 text-center">
        <thead>
          <tr>
            <th className="whitespace-nowrap">Character Name</th>
            <th className="whitespace-nowrap">Character Level</th>
          </tr>
        </thead>
        <tbody>
          {docList.map((e) => (
            <tr key={e.id}>
              <td className="text-left">{e.data().bio.name}</td>
              <td>{e.data().classRecorder.totals.levels}</td>
              <td>
                <Button size="small" onClick={() => docIdSetter(e.id)}>
                  Open Character Sheet
                </Button>
              </td>
              <td className="text-right">
                <Button
                  size="small"
                  onClick={async () => {
                    if (confirm("Are you sure you want to pemanently delete this character?")) {
                      await deleteCharacter(userId + "/" + e.id);
                      docListSetter(undefined);
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
