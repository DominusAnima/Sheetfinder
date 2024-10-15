import { useEffect, useState } from "react";
import { deleteCharacter, getDocList, saveNew } from "../firebase/firebase";
import { DEFAULT_STATE } from "../DefaultState";
import Button from "../Components/Button";
import Container from "../Components/Container";
import { reducer } from "../reducer";
import Modal from "../Components/Modal";
import Toast from "../Components/Toast";
import Toolbar, { ToolbarItem } from "../Components/Toolbar";

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
  const [deleteModal, setDeleteModal] = useState<undefined | number>(undefined);
  const [signOutModal, setSignOutModal] = useState(false);
  const [toastContent, setToastContent] = useState<{ type: "success" | "error" | "info"; message: string } | undefined>(
    undefined
  );

  const toolbarItems: ToolbarItem[] = [
    {
      name: "Create new Character",
      onClick: async () => {
        docIdSetter(await saveNew(reducer(DEFAULT_STATE, { type: "recalculate" }), userId));
      },
    },
    {
      name: "Sign out",
      onClick: () => {
        setSignOutModal(true);
      },
    },
  ];

  return (
    <Container>
      <Modal
        show={deleteModal !== undefined}
        title="Are you sure you want to permanently delete this character?"
        onClose={() => setDeleteModal(undefined)}
        onOk={async () => {
          try {
            await deleteCharacter(deleteModal as number);
            docListSetter(undefined);
            setToastContent({ type: "success", message: "Successfully deleted character" });
          } catch (error) {
            setToastContent({ type: "error", message: "" + error });
          }
          setDeleteModal(undefined);
        }}
      />
      <Modal
        show={signOutModal}
        title="Are you sure you want to sign out?"
        onClose={() => setSignOutModal(false)}
        onOk={() => {
          userIdSetter(undefined);
          setSignOutModal(false);
        }}
      />
      {toastContent && (
        <Toast
          type={toastContent.type}
          message={toastContent.message}
          onClose={() => {
            setToastContent(undefined);
          }}
        />
      )}
      <Toolbar items={toolbarItems} />
      <table className="table table--striped w-full mt-4 text-center">
        <thead>
          <tr>
            <th className="whitespace-nowrap">Character Name</th>
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
                  onClick={() => {
                    setDeleteModal(e.id);
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
