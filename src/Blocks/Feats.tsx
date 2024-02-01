import { useState } from "react";
import { FeatBlock } from "../charSheet";
import { useFormDispatch } from "../lib/useFormDispatch";
import SectionTitle from "../Components/SectionTitle";
import EditButton from "../Components/EditButton";
import FlatButton from "../Components/FlatButton";
import { FaPlusCircle } from "react-icons/fa";
import Button from "../Components/Button";
import InlineInput from "../Components/InlineInput";
import Textarea from "../Components/Textarea";

export function Feats({ state }: { state: FeatBlock }) {
  const [editing, setEditing] = useState(false);
  const dispatch = useFormDispatch();

  function handleChange(field: "name" | "description", index: number, value: string) {
    dispatch({ type: "changeFeatEntryField", payload: { field, index, value } });
  }

  return (
    <div className="mt-4">
      <SectionTitle title="Feats & Features">
        <EditButton editing={editing} onClick={() => setEditing((v) => !v)} />
        <FlatButton onClick={() => dispatch({ type: "addFeatEntry" })}>
          <FaPlusCircle />
        </FlatButton>
      </SectionTitle>

      <table className="table table--striped w-full mt-4">
        <thead>
          <tr>
            <th className="whitespace-nowrap">Description</th>
            <th className="whitespace-nowrap">Name</th>
          </tr>
        </thead>
        {editing ? (
          <tbody>
            {state.entries.map((entry, i) => (
              <>
                <tr>
                  <td>
                    <Button size="small" onClick={() => dispatch({ type: "toggleFeatDetail", payload: { index: i } })}>
                      Toggle
                    </Button>
                  </td>
                  <td>
                    <InlineInput value={entry.name} onChange={(e) => handleChange("name", i, e.target.value)} />
                  </td>
                  <td>
                    <Button
                      size="small"
                      onClick={() => {
                        if (confirm("Are you sure?")) {
                          dispatch({ type: "removeFeatEntry", payload: { entry } });
                        }
                      }}
                    >
                      Remove
                    </Button>
                  </td>
                </tr>
                {entry.toggleDescr && (
                  <tr>
                    <td colSpan={2}>
                      <Textarea
                        value={entry.description}
                        onChange={(e) => handleChange("description", i, e.target.value)}
                        rows={1}
                      />
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        ) : (
          <tbody>
            {state.entries.map((entry, i) => (
              <>
                <tr>
                  <td>
                    <Button size="small" onClick={() => dispatch({ type: "toggleFeatDetail", payload: { index: i } })}>
                      Toggle
                    </Button>
                  </td>
                  <td className="text-center">{entry.name}</td>
                </tr>
                {entry.toggleDescr && (
                  <tr>
                    <td colSpan={2} className="text-center">
                      {entry.description.trim()}
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        )}
      </table>
    </div>
  );
}
