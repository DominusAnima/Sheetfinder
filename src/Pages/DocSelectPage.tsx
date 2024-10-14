import { useEffect, useState } from "react";
import { deleteCharacter, getDocList, saveNew } from "../firebase/firebase";
import { DEFAULT_STATE } from "../DefaultState";
import Button from "../Components/Button";
// import { QueryDocumentSnapshot, DocumentData } from "firebase/firestore";
import Container from "../Components/Container";
import { reducer } from "../reducer";
import Field from "../Components/Field";

interface DocListEntry {
  id: number;
  create_time: string;
  name: string;
}

export function DocSelectPage({
  userId,
  docIdSetter,
  userIdSetter,
}: {
  userId: string;
  docIdSetter: React.Dispatch<React.SetStateAction<number | undefined>>;
  userIdSetter: React.Dispatch<React.SetStateAction<string | undefined>>;
}) {
  const [docList, setDocList] = useState<DocListEntry[]>();

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
    return (
      <LoadedSelectPage
        userId={userId}
        docList={docList}
        docIdSetter={docIdSetter}
        docListSetter={setDocList}
        userIdSetter={userIdSetter}
      />
    );
  }
}

function LoadedSelectPage({
  userId,
  docList,
  docIdSetter,
  docListSetter,
  userIdSetter,
}: {
  userId: string;
  docList: DocListEntry[];
  docIdSetter: React.Dispatch<React.SetStateAction<number | undefined>>;
  docListSetter: React.Dispatch<React.SetStateAction<DocListEntry[] | undefined>>;
  userIdSetter: React.Dispatch<React.SetStateAction<string | undefined>>;
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
              userIdSetter(undefined);
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
            {/* <th className="whitespace-nowrap">Character Level</th> */}
          </tr>
        </thead>
        <tbody>
          {docList.map((e) => (
            <tr key={e.id}>
              <td className="text-left">{e.name}</td>
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
                      await deleteCharacter(e.id);
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
