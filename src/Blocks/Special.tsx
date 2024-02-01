import { FaPlusCircle } from "react-icons/fa";
import FlatButton from "../Components/FlatButton";
import SectionTitle from "../Components/SectionTitle";
import { SpecialBlock } from "../charSheet";
import { useFormDispatch } from "../lib/useFormDispatch";
import Button from "../Components/Button";
import InlineInput from "../Components/InlineInput";
import { useState } from "react";
import EditButton from "../Components/EditButton";
import Textarea from "../Components/Textarea";

export function Special({ state }: { state: SpecialBlock }) {
  const [editing, setEditing] = useState(false);
  const dispatch = useFormDispatch();
  function handleChange(field: "name" | "description" | "usesLimit" | "used", index: number, value: string) {
    dispatch({
      type: "changeSpecialEntryField",
      payload: { field, index, value },
    });
  }

  return (
    <div className="mt-4">
      <SectionTitle title="Special Usable Abilities">
        <EditButton editing={editing} onClick={() => setEditing((v) => !v)} />
        <FlatButton onClick={() => dispatch({ type: "addSpecialEntry" })}>
          <FaPlusCircle />
        </FlatButton>
      </SectionTitle>

      <table className="table table--striped w-full mt-4">
        <thead>
          <tr>
            <th className="whitespace-nowrap">Description</th>
            <th className="whitespace-nowrap">Name</th>
            <th className="whitespace-nowrap">Uses</th>
            <th className="whitespace-nowrap">Used</th>
          </tr>
        </thead>
        {editing ? (
          <tbody>
            {state.entries.map((entry, i) => (
              <>
                <tr>
                  <td>
                    <Button
                      size="small"
                      onClick={() => dispatch({ type: "toggleSpecialDetail", payload: { index: i } })}
                    >
                      Toggle
                    </Button>
                  </td>
                  <td>
                    <InlineInput value={entry.name} onChange={(e) => handleChange("name", i, e.target.value)} />
                  </td>
                  <td>
                    <InlineInput
                      value={entry.usesLimit}
                      onChange={(e) => handleChange("usesLimit", i, e.target.value)}
                    />
                  </td>
                  <td>
                    <InlineInput value={entry.used} onChange={(e) => handleChange("used", i, e.target.value)} />
                  </td>
                  <td>
                    <Button
                      size="small"
                      onClick={() => {
                        if (confirm("Are you sure?")) {
                          dispatch({ type: "removeSpecialEntry", payload: { entry } });
                        }
                      }}
                    >
                      Remove
                    </Button>
                  </td>
                </tr>
                {entry.toggleDescr && (
                  <tr>
                    <td colSpan={4}>
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
                    <Button
                      size="small"
                      onClick={() => dispatch({ type: "toggleSpecialDetail", payload: { index: i } })}
                    >
                      Toggle
                    </Button>
                  </td>
                  <td className="text-center">{entry.name}</td>
                  <td className="text-center value">{entry.usesLimit}</td>
                  <td>
                    <InlineInput value={entry.used} onChange={(e) => handleChange("used", i, e.target.value)} />
                  </td>
                </tr>
                {entry.toggleDescr && (
                  <tr>
                    <td colSpan={4} className="text-center">
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
