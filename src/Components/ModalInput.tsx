import cx from "classnames";
import * as React from "react";
import Button from "./Button";
import Input from "./Input";

interface IProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange"> {
  value: string;
  onChange: (newValue: string) => void;
  placeholder: string;
  valueClassNames?: string;
}

const ModalInput: React.FC<IProps> = ({ value, onChange, placeholder, valueClassNames, ...rest }) => {
  const [internalValue, setInternalValue] = React.useState("");
  const [editing, setEditing] = React.useState(false);
  const visibleValue = value.trim();

  const startEditing = () => {
    setInternalValue(visibleValue);
    setEditing(true);
  };

  const confirm = () => {
    onChange(internalValue);
    setEditing(false);
  };

  return (
    <div className="inline-block">
      <span className={cx("value cursor-pointer", valueClassNames)} onClick={startEditing}>
        {visibleValue.length > 0 ? visibleValue : placeholder}
      </span>
      {editing && (
        <>
          <div className="fixed inset-0 bg-slate-800 bg-opacity-50" onClick={() => setEditing(false)}></div>
          <div className="absolute z-20 left-[5vw] right-0 w-[90vw]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                confirm();
              }}
            >
              <Input
                value={internalValue}
                onChange={(e) => setInternalValue(e.target.value)}
                placeholder={placeholder}
                {...rest}
              />
              <div className="flex gap-4">
                <Button block onClick={() => setEditing(false)} className="mt-4">
                  Cancel
                </Button>
                <Button block onClick={confirm} className="mt-4">
                  Confirm
                </Button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default ModalInput;
